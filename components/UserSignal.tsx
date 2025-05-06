'use client'

import {useAtom, useSetAtom} from 'jotai'
import {currentUserState, usersState} from '@/stores/users'
import {useEffect} from 'react'
import {getUser, updateUserOnline} from '@/api/user'
import { useInterval } from 'react-use'

const USER_SIGNAL_INTERVAL = 10000 // 10 seconds

const UserSignal = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserState)
  useInterval(
    async () => {
      if (currentUser) {
        const result = await updateUserOnline(currentUser.id)
        if (!result) return
        const me = await getUser(currentUser.id)
        if (!me) return
        setCurrentUser(me)
        console.log(me)
      }
    },
    USER_SIGNAL_INTERVAL
  );

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold mb-4">User Signal</h1>
      <p className="text-lg">This is the User Signal component.</p>
      <p>{currentUser?.timestamp}</p>
    </div>
  );
}

export default UserSignal
