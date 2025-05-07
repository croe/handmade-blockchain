import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { latestTimestampUserState, currentUserState } from '@/stores/users'
import { Transaction } from '@/models/transaction'

export const txsState = atomWithStorage<Transaction[]>('txs', [])
//
// export const syncedTxsState = atom<Transaction[]>((get) => {
//   const txs = get(txsState)
//   // 同期済みのトランザクションを取得する
//   return txs.filter((tx) => tx.synced)
// }


export const syncedTxsState = atom<Transaction[]>(
  (get) => {
  const txs = get(txsState)
  const latestTimestampUser = get(latestTimestampUserState)
  const currentUser = get(currentUserState)
  // ウォレット作成は必須（初期状態はないのでどうする？）
  if (!currentUser) return []
  // 降順でソート
  txs.sort((a, b) => b.timestamp - a.timestamp)
  if (latestTimestampUser) {
    if (currentUser.timestamp > latestTimestampUser.timestamp) {
      // 自分のタイムスタンプが最新のユーザーよりも新しい場合
      return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
    } else {
      return txs.filter((tx) => tx.timestamp <= latestTimestampUser.timestamp)
    }
  } else {
    return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
  }
})
