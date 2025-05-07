import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Transaction } from '@/models/transaction'

export const txsState = atomWithStorage<Transaction[]>('txs', [])
//
// export const syncedTxsState = atom<Transaction[]>((get) => {
//   const txs = get(txsState)
//   // 同期済みのトランザクションを取得する
//   return txs.filter((tx) => tx.synced)
// }
