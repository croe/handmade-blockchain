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
    if (isValidTimestamp(latestTimestampUser.timestamp)) {
      /**
       * 1. 最新の他のユーザーのタイムスタンプが現在から10秒以内の場合 ＝ 全てのトランザクションの中で最新である
       * 最新のトランザクションを返却する
       */
      return txs
    } else if (currentUser.timestamp > latestTimestampUser.timestamp) {
      /**
       * 2. 自分のタイムスタンプが最新のタイムスタンプよりも新しい場合 = 自分が最新である
       * 自分のタイムスタンプよりも前のトランザクションを返却する
       */
      return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
    } else {
      /**
       * 3. 最新の他のユーザーのタイムスタンプが自分のタイムスタンプよりも新しい場合 ＝ 他のユーザーの最新が最新である
       * 他の最新ユーザーのタイムスタンプよりも前のトランザクションを返却する
       */
      return txs.filter((tx) => tx.timestamp <= latestTimestampUser.timestamp)
    }
  } else {
    /**
     * 4. 最新の他のユーザーがいない場合 = 自分が最新である
     * 自分のタイムスタンプよりも前のトランザクションを返却する
     */
    return txs.filter((tx) => tx.timestamp <= currentUser.timestamp)
  }
})
