import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/block'

export const chainState = atomWithStorage<Block[]>('chains', [])

export const syncedChainState = atom<Block[]>(
  (get) => {
    const chain = get(chainState)
    return chain.sort((a, b) => a.timestamp - b.timestamp)
  }
)

/**
 * 最長のチェーン
 */
export const longestChainState = atom<Block[]>(
  (get) => {
    return []
  }
)


/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)
