'use client'

import {useAtom, useSetAtom} from 'jotai'
import {currentUserState, latestTimestampUserState} from '@/stores/users'
import { getUser, updateUserOnline } from '@/api/user'
import { useInterval } from 'react-use'
import { USER_SIGNAL_INTERVAL } from '@/lib/const'
import {isValidTimestamp} from '@/utils/isValidTimestamp'
import {syncedTimestampState} from '@/stores/transactions'
import {db, DB_USER, getMyUserPath} from '@/lib/firebase'
import {DataSnapshot, off, onDisconnect, onValue, ref, serverTimestamp} from 'firebase/database'
import {useEffect} from 'react'

const UserSignal = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserState)
  const handleUpdateUserOnline = async () => {
    if (!currentUser) return
    await updateUserOnline(currentUser.id)
  }

  const connectedRef = (db && currentUser) && ref(db, ".info/connected");
  const meRef = (db && currentUser) && ref(db, getMyUserPath(currentUser.id))
  if (connectedRef && meRef) {
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        console.log("connected")
        handleUpdateUserOnline()
      } else {
        console.log("not connected")
      }
    });
    onDisconnect(meRef).set({
      t: serverTimestamp(),
      s: 0
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold mb-4">User Signal</h1>
      <p className="text-lg">This is the User Signal component.</p>
      <p>{currentUser?.timestamp}</p>
    </div>
  );
}

export default UserSignal
