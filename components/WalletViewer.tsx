"use client";

import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { myBalanceState } from '@/stores/transactions'
import { useEffect } from 'react'
import { generateReadableId, getAvatarForId } from '@/utils/id-to-readable-string'

const WalletViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [myBalance] = useAtom(myBalanceState)

  useEffect(() => {
    console.log(myBalance)
  }, [myBalance])

  if (!currentUser) return (
    <div>Loading...</div>
  )
  return (
    <div className="fixed top-20 left-0 rounded-r-full bg-[#E0E0E0] py-5 pl-5 pr-10 flex items-center gap-3 text-sm h-20">
      <img className="w-8 h-8" src={getAvatarForId(currentUser.id)} alt=""/>
      <div>
        <div className="flex gap-2 items-center">
          <span className="text-[#666]">{currentUser && generateReadableId(currentUser.id)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <img className="h-4" src="/images/icons/cnc.svg" alt=""/>
          <span className="text-[#3d3d3d]">{myBalance}</span>
        </div>
      </div>
    </div>
  )
}

export default WalletViewer
