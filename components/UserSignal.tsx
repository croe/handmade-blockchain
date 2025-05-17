'use client'

import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { updateUserOnline } from '@/api/user'
import { db, getMyUserPath } from '@/lib/firebase'
import { onDisconnect, onValue, ref, serverTimestamp } from 'firebase/database'

/**
 * プレゼンスを管理するコンポーネント（Topで呼ぶ必要がある？）
 */
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

  return <></>
}

export default UserSignal
