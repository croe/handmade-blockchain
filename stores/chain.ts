import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/block'

export const chainState = atomWithStorage<Block[]>('chains', [])

export const syncedBlocksState = atom<Block[]>(
  (get) => {
    const chain = get(chainState)
    return chain.sort((a, b) => a.timestamp - b.timestamp)
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


/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)
