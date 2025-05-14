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
export const currentChainState = atom<Block[]>(
  (get) => {
    const chain = get(chainState)
    if (chain.length === 0) return []

    // blockHeightの最大値を取得
    const maxHeight = Math.max(...chain.map(block => block.blockHeight))

    // 最大のblockHeightを持つブロックをフィルタリング
    const blocksWithMaxHeight = chain.filter(block => block.blockHeight === maxHeight)

    // timestampが最も古いブロックを選択
    const oldestBlock = blocksWithMaxHeight.reduce((oldest, current) =>
      current.timestamp < oldest.timestamp ? current : oldest
    )

    return [oldestBlock]
  }
)


/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)
