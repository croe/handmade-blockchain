import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { latestTimestampUserState, currentUserState } from '@/stores/users'
import { Transaction } from '@/models/transaction'
import { isValidTimestamp } from '@/utils/isValidTimestamp'

export const txsState = atomWithStorage<Transaction[]>('txs', [])

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
    // 自分以外のユーザーがいる場合
    // 自分と相手を比較する → オンラインかどうかを比較する→判断
    if (currentUser.timestamp > latestTimestampUser.timestamp) {
      // 自分の方が新しい場合
      if (isValidTimestamp(currentUser.timestamp)) {
        // オンラインである場合 → 自分のTxで自分のタイムスタンプ以前のTxを返却する
        console.log('pattern 1-1')
        return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
      }
      // オフラインの場合
      console.log('pattern 1-2')
      return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
    } else {
      // 他の方が新しい場合
      if (isValidTimestamp(latestTimestampUser.timestamp)) {
        // オンラインである場合 → Txで他のユーザーのタイムスタンプ以前のTxを返却する
        console.log('pattern 2-1')
        return txs.filter((tx) => tx.timestamp <= latestTimestampUser.timestamp)
      }
      // オフラインの場合
      console.log('pattern 2-2')
      return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
    }
  } else {
    // 自分だけしかいない場合（多分ない）
    console.log('pattern 3')
    return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
  }
})
