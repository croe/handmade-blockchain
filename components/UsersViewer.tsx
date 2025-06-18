'use client'

import { useEffect } from 'react'
import { db, DB_USER } from '@/lib/firebase'
import { DataSnapshot, off, onValue, ref } from 'firebase/database'
import { convertUsers } from '@/models/user'
import { useAtom, useSetAtom } from 'jotai'
import { usersState, currentUserState } from '@/stores/users'
import { getTxs, syncTxs } from '@/api/transaction'
import { uniqBy, differenceBy } from 'lodash'
import { txsState } from '@/stores/transactions'
import { getBlocks, syncBlocks } from '@/api/block'
import { filterNonNullableTxs, filterNonNullableBlocks } from '@/utils/filterNonNullable'
import { chainState } from '@/stores/chain'
import { syncInfoState } from '@/stores/sync'

/**
 * ユーザー、トランザクション、ブロックの同期を行うコンポーネント
 */

const SYNC_LIMIT = 3

const UsersViewer = () => {
  const [_, setUsers] = useAtom(usersState)
  const [currentUser] = useAtom(currentUserState)
  const setTxs = useSetAtom(txsState)
  const setBlocks = useSetAtom(chainState)
  const setSyncInfo = useSetAtom(syncInfoState)

  useEffect(() => {
    if (!db) return
    if (!currentUser) return
    const usersRef = ref(db, DB_USER)
    const handleValueChange = async (snapshot: DataSnapshot) => {
      const users = convertUsers(snapshot)
      setUsers(users)

      // オンラインユーザーを取得
      const onlineUsers = users.filter((user) => user.status && user.id !== currentUser.id)
      
      // 接続ユーザーリストを更新
      setSyncInfo(prev => ({
        ...prev,
        connectedUsers: onlineUsers
      }))

      // オンラインユーザーがいない場合は同期処理をスキップ
      if (onlineUsers.length === 0) return
      const limitedOnlineUsers = onlineUsers.slice(0, SYNC_LIMIT)

      /**
       * Sync Txs
       */
      const txsPromises = limitedOnlineUsers.map(async (user) => await getTxs(user.id))
      const usersTxs = await Promise.all(txsPromises)
      const myTxs = await getTxs(currentUser.id)
      if (usersTxs.length === 0) return
      const mergedTxs = uniqBy(filterNonNullableTxs(usersTxs.concat(myTxs)), 'id')
      const flatMappedMyTxs = myTxs ? myTxs.flatMap(e => e != null ? e : []) : []
      if (mergedTxs.length > 0) {
        const targetSyncTxs = differenceBy(mergedTxs, flatMappedMyTxs, 'id')
        setTxs(mergedTxs)
        await syncTxs(currentUser.id, targetSyncTxs)
      }

      /**
       * Sync Blocks
       */
      const chainPromises = limitedOnlineUsers.map(async (user) => await getBlocks(user.id))
      const userChains = await Promise.all(chainPromises)
      const myChain = await getBlocks(currentUser.id)
      if (userChains.length === 0) return
      const mergedChain = uniqBy(filterNonNullableBlocks(userChains.concat(myChain)), 'id')
      const flatMappedMyChains = myChain ? myChain.flatMap(e => e != null ? e : []) : []
      if (mergedChain.length > 0) {
        const targetSyncChain = differenceBy(mergedChain, flatMappedMyChains, 'id')
        console.log(targetSyncChain)
        setBlocks(mergedChain)
        await syncBlocks(currentUser.id, targetSyncChain)
      }

      // 同期完了時に最終更新時刻を更新
      const syncCompletedTime = Date.now()
      setSyncInfo(prev => ({
        ...prev,
        lastUpdate: syncCompletedTime
      }))
    }
    const handleError = (err: Error) => {
      console.error('Firebase read error:', err)
    }
    const unsubscribe = onValue(usersRef, handleValueChange, handleError)

    return () => {
      off(usersRef, 'value', handleValueChange)
    }
  }, [])

  return (
    <></>
  )
}

export default UsersViewer
