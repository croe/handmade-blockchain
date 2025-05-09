'use client'

import { useEffect } from 'react'
import { db, DB_USER } from '@/lib/firebase'
import { DataSnapshot, off, onValue, ref } from 'firebase/database'
import { convertUsers } from '@/models/user'
import { useAtom, useSetAtom } from 'jotai'
import { usersState, latestTimestampUserState, currentUserState } from '@/stores/users'
import { MonitorCheck } from 'lucide-react'
import {getTxs, syncTxs} from '@/api/transaction'
import { uniqBy } from 'lodash'
import { txsState } from '@/stores/transactions'

const SYNC_LIMIT = 3

const UsersViewer = () => {
  const [users, setUsers] = useAtom(usersState)
  const [currentUser] = useAtom(currentUserState)
  const [latestTimestampUser] = useAtom(latestTimestampUserState)
  const setTxs = useSetAtom(txsState)

  useEffect(() => {
    console.log('run')
    if (!db) return
    if (!currentUser) return
    const usersRef = ref(db, DB_USER)
    const handleValueChange = async (snapshot: DataSnapshot) => {
      const users = convertUsers(snapshot)
      setUsers(users)

      /**
       * Sync Txs/Blocks
       */
      const onlineUsers = users.filter((user) => user.status && user.id !== currentUser.id)
      if (onlineUsers.length === 0) return
      const limitedOnlineUsers = onlineUsers.slice(0, SYNC_LIMIT)

      /**
       * Sync Txs
       */
      const txsPromises = limitedOnlineUsers.map(async (user) => await getTxs(user.id))
      const usersTxs = await Promise.all(txsPromises)
      const myTxs = await getTxs(currentUser.id)
      if (usersTxs.length === 0) return
      console.log(usersTxs)
      const mergedTxs = uniqBy(usersTxs
        .concat(myTxs)
        .flatMap(e => e != null ? e : [])
        .sort((a, b) => b.timestamp - a.timestamp), 'id')
      const flatMappedMyTxs = myTxs ? myTxs.flatMap(e => e != null ? e : []) : []
      if (mergedTxs.length > 0) {
        setTxs(mergedTxs)
        await syncTxs(currentUser.id, mergedTxs, flatMappedMyTxs)
      }

      /**
       * Sync Blocks
       */

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
    <div className="px-4 py-2 text-black">
      <p className="text-sm mb-2 font-bold">Users Viewer</p>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {users.filter((user) => user.status).map((user) => (
          <li key={user.id} className="text-sm flex gap-2 items-center">
            <p>ID: {user.id}</p>
            <p>
              <span className="text-green-500">
                  <MonitorCheck size={20}/>
                </span>
            </p>
          </li>
        ))}
      </ul>
      {latestTimestampUser && (
        <p className="mt-4 text-sm text-gray-500">
          <span>Latest Synced: </span>
          <span>{new Date(latestTimestampUser.timestamp).toLocaleString()}</span>
        </p>
      )}
    </div>
  )
}

export default UsersViewer
