'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { addNewUser } from '@/api/user'
import { getUnixTime } from 'date-fns'
import { Hammer, CheckCircle } from 'lucide-react'

const CreateWalletView = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserState)

  const handleCreateWallet = async () => {
    // FIXME: ここタイムスタンプの持ち方がサーバーとクライアントで違うので考える
    const timestamp = getUnixTime(new Date())
    const user = await addNewUser()
    console.log(user)
    if (user?.key) {
      setCurrentUser({
        id: user.key,
        timestamp: timestamp,
      })
    }
  }

  return (
    <div className="px-4 py-2 text-black border-2" >
      {currentUser ? (
        <button className="text-green-500" onClick={handleCreateWallet}><CheckCircle /></button>
      ) : (
        <button onClick={handleCreateWallet}><Hammer /></button>
      )}
    </div>
  )
}

export default CreateWalletView
