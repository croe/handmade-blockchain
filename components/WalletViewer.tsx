"use client";

import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { myBalanceState } from '@/stores/transactions'
import { useEffect } from 'react'

const WalletViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [myBalance] = useAtom(myBalanceState)

  useEffect(() => {
    console.log(myBalance)
  }, [myBalance])

  return (
    <div className="px-4 py-2 text-gray-500 border-b-2 mb-10">
      <p className="text-sm">
        <span>ID:</span>
        <span className="text-base font-bold text-black">{currentUser?.id}</span>
      </p>
      <p className="text-sm flex gap-2 items-center">
        <span>Your Balance:</span>
        <span className="text-base font-bold text-black">{myBalance}</span>
      </p>
    </div>
  )
}

export default WalletViewer
