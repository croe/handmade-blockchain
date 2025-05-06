'use client'

import { useEffect } from 'react'
import { db, DB_USER } from '@/lib/firebase'
import { DataSnapshot, off, onValue, ref } from 'firebase/database'
import { convertUsers } from '@/models/user'
import {useAtom} from 'jotai'
import {usersState} from '@/stores/users'
import { MonitorCheck, MonitorX } from 'lucide-react'
import {isValidTimestamp} from '@/utils/isValidTimestamp'

const UsersViewer = () => {
  const [users, setUsers] = useAtom(usersState)

  useEffect(() => {
    if (!db) return
    const usersRef = ref(db, DB_USER)
    const handleValueChange = (snapshot: DataSnapshot) => {
      const users = convertUsers(snapshot)
      console.log(users)
      setUsers(users)
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
        {users.map((user) => (
          <li key={user.id} className="text-sm flex gap-2 items-center">
            <p>ID: {user.id}</p>
            <p>
              {isValidTimestamp(user.timestamp) ? (
                <span className="text-green-500">
                  <MonitorCheck size={20}/>
                </span>
              ) : (
                <span className="text-red-500">
                  <MonitorX size={20} />
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersViewer
