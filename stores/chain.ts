import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/block'
import { uniq } from 'lodash'

export const chainState = atomWithStorage<Block[]>('chains', [])

export const syncedBlocksState = atom<Block[]>(
  (get) => {
    const chain = get(chainState)
    return chain.sort((a, b) => a.timestamp - b.timestamp)
  }
)

// チェーンの型定義
export type Chain = {
  blocks: Block[];
  lastBlock: Block;
  length: number;
}

// チェーンごとにブロックを整理する関数
const organizeChains = (blocks: Block[]): Chain[] => {
  // ブロックの高さでソート
  const sortedBlocks = [...blocks].sort((a, b) => a.blockHeight - b.blockHeight)

  // チェーンを格納する配列
  const chains: Chain[] = []

  // 処理済みのブロックを記録
  const processedBlocks = new Set<string>()

  // 各ブロックからチェーンを構築
  for (const block of sortedBlocks) {
    if (processedBlocks.has(block.id)) continue

    // 新しいチェーンを構築
    const chain: Chain = {
      blocks: [block],
      lastBlock: block,
      length: 1,
    }

    processedBlocks.add(block.id)

    // 子ブロックを探して追加
    let currentBlock = block
    while (true) {
      const nextBlock = sortedBlocks.find(b => b.prevId === currentBlock.id)
      if (!nextBlock) break

      chain.blocks.push(nextBlock)
      chain.lastBlock = nextBlock
      chain.length++
      processedBlocks.add(nextBlock.id)
      currentBlock = nextBlock
    }

    chains.push(chain)
  }

  // チェーンの長さで降順ソート
  return chains.sort((a, b) => b.length - a.length)
}

// チェーンを取得するatomを作成
export const chainsState = atom<Chain[]>(
  (get) => {
    const blocks = get(chainState)
    return organizeChains(blocks)
  }
)

/**
 * 最長のチェーン
 */
export const currentChainState = atom<Block[]>((get) => {
  const chain = get(chainState)
  if (chain.length === 0) return []

  // 1. 起点となるブロック (startBlock) を見つける
  // blockHeightの最大値を取得
  const maxHeight = Math.max(...chain.map((block) => block.blockHeight))

  // 最大のblockHeightを持つブロックをフィルタリング
  const blocksWithMaxHeight = chain.filter(
    (block) => block.blockHeight === maxHeight,
  )

  // timestampが最も古いブロックを選択
  // blocksWithMaxHeight が空の場合はありえないが、念のためチェック
  if (blocksWithMaxHeight.length === 0) return []

  const startBlock = blocksWithMaxHeight.reduce((oldest, current) =>
    current.timestamp < oldest.timestamp ? current : oldest,
  )

  // 2. startBlock から prevId をたどってチェーンを構築
  const resultChain: Block[] = []
  let currentBlock: Block | undefined = startBlock

  while (currentBlock) {
    resultChain.push(currentBlock)
    if (currentBlock.prevId === '') {
      // ジェネシスブロックに到達
      break
    }
    currentBlock = chain.find((block) => block.id === currentBlock!.prevId)
  }

  // 3. 配列を返す (現在は startBlock からジェネシスブロックの順)
  // もしジェネシスブロックから startBlock の順にしたければ、最後に reverse() する
  return resultChain.reverse() // ジェネシスから最新の順にするのだ
})

export const forkedPointsState = atom<number[]>((get) => {
  const chains = get(chainsState)
  return chains.map((chain) => {
    return chain.blocks[0].blockHeight
  }).slice(1)
})

/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)
