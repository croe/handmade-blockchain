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
  if (blocks.length === 0) return []

  const chains: Chain[] = []
  const processedBlocks = new Set<string>()

  // リーフブロック（子を持たないブロック）を見つける
  const leafBlocks = blocks.filter(block => {
    return !blocks.some(b => b.prevId === block.id)
  })

  // 各リーフブロックから始まって、ジェネシスまで遡る
  for (const leafBlock of leafBlocks) {
    if (processedBlocks.has(leafBlock.id)) continue

    // リーフからジェネシスまでの完全なチェーンを構築
    const chainBlocks = buildChainToGenesis(leafBlock, blocks)

    if (chainBlocks.length > 0) {
      const chain: Chain = {
        blocks: chainBlocks,
        lastBlock: chainBlocks[chainBlocks.length - 1],
        length: chainBlocks.length
      }

      chains.push(chain)

      // このチェーンのブロックをすべて処理済みにマーク
      chainBlocks.forEach(block => processedBlocks.add(block.id))
    }
  }

  // チェーンの長さで降順ソート
  return chains.sort((a, b) => b.length - a.length)
}

// リーフブロックからジェネシスブロックまで遡る
const buildChainToGenesis = (leafBlock: Block, allBlocks: Block[]): Block[] => {
  const chain: Block[] = []
  let currentBlock: Block | undefined = leafBlock

  while (currentBlock) {
    chain.unshift(currentBlock) // 配列の先頭に追加（ジェネシス→リーフの順になる）
    if (currentBlock.prevId === '') break // ジェネシスブロックに到達

    currentBlock = allBlocks.find(b => b.id === currentBlock!.prevId)
  }

  return chain
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
  const chains = get(branchedChainsState)
  return chains
    .sort((a, b) => a.blocks[0].blockHeight - b.blocks[0].blockHeight)
    .map((chain) => {
      return chain.blocks[0].blockHeight
    }).slice(1)
})

/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)

// 分岐チェーンを含む配列を取得するatomを作成
// [最長のチェーン, 分岐したところからのチェーン, 分岐したところからのチェーン, ...]
export const branchedChainsState = atom<Chain[]>(
  (get) => {
    const blocks = get(chainState)
    return organizeBranchedChains(blocks)
  }
)

// 分岐チェーンを整理する関数
const organizeBranchedChains = (blocks: Block[]): Chain[] => {
  if (blocks.length === 0) return []

  // まず現在のアルゴリズムで最長チェーンを取得
  const allChains = organizeChains(blocks)
  if (allChains.length === 0) return []

  // 最長チェーン
  const longestChain = allChains[0]
  const result: Chain[] = [longestChain]

  // 最長チェーンに含まれるブロックIDのセット
  const longestChainBlockIds = new Set(longestChain.blocks.map(b => b.id))

  // 最長チェーンに含まれないブロックを探す
  const remainingBlocks = blocks.filter(block => !longestChainBlockIds.has(block.id))

  // 分岐チェーンを構築
  const processedBlocks = new Set<string>()

  // 分岐チェーンを反復的に検出
  let foundNewBranch = true
  while (foundNewBranch) {
    foundNewBranch = false

    for (const block of remainingBlocks) {
      if (processedBlocks.has(block.id)) continue

      // このブロックの親が最長チェーンまたは既に処理した分岐チェーンに含まれているかチェック
      const parentInLongestChain = longestChainBlockIds.has(block.prevId)
      const parentInProcessed = processedBlocks.has(block.prevId)

      if (parentInLongestChain || parentInProcessed) {
        // 分岐点から始まるチェーンを構築
        const branchChain = buildBranchFromBlock(block, blocks)
        result.push(branchChain)

        // 処理済みに追加
        branchChain.blocks.forEach(b => processedBlocks.add(b.id))
        foundNewBranch = true
      }
    }
  }

  // 分岐チェーンを長さでソート（最長チェーンは最初のまま）
  const branchChains = result.slice(1).sort((a, b) => b.length - a.length)
  return [result[0], ...branchChains]
}

// 分岐点から始まるチェーンを構築するヘルパー関数
const buildBranchFromBlock = (startBlock: Block, allBlocks: Block[]): Chain => {
  const chainBlocks: Block[] = [startBlock]
  let currentBlock = startBlock

  // 子ブロックを探して追加
  while (true) {
    const nextBlock = allBlocks.find(b => b.prevId === currentBlock.id)
    if (!nextBlock) break

    chainBlocks.push(nextBlock)
    currentBlock = nextBlock
  }

  return {
    blocks: chainBlocks,
    lastBlock: currentBlock,
    length: chainBlocks.length
  }
}
