'use client'

import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { updateUserOnline } from '@/api/user'
import { db, getMyUserPath } from '@/lib/firebase'
import { onDisconnect, onValue, ref, serverTimestamp } from 'firebase/database'

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
      {/*<p>{currentUser?.timestamp}</p>*/}
    </div>
  );
}

export default UserSignal
