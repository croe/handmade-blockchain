'use client'

import {useAtom, useSetAtom} from 'jotai'
import {currentUserState, latestTimestampUserState} from '@/stores/users'
import { getUser, updateUserOnline } from '@/api/user'
import { useInterval } from 'react-use'
import { USER_SIGNAL_INTERVAL } from '@/lib/const'
import {isValidTimestamp} from '@/utils/isValidTimestamp'
import {syncedTimestampState} from '@/stores/transactions'

const UserSignal = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserState)
  const [latestTimestampUser] = useAtom(latestTimestampUserState)
  const setSyncedTimestamp = useSetAtom(syncedTimestampState)
  useInterval(
    async () => {
      if (currentUser) {
        const result = await updateUserOnline(currentUser.id)
        if (!result) return
        const me = await getUser(currentUser.id)
        if (!me) return
        setCurrentUser(me)
        if (latestTimestampUser) {
          if (!(me.timestamp > latestTimestampUser.timestamp)) {
            if (isValidTimestamp(latestTimestampUser.timestamp)) {
              // 最新のタイムスタンプを持つユーザーがオンラインの場合
              console.log(latestTimestampUser.timestamp)
              setSyncedTimestamp(latestTimestampUser.timestamp)
            }
          }
        }
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
