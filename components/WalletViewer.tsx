"use client";

import {useAtom, useAtomValue} from 'jotai'
import { currentUserState } from '@/stores/users'
import {chainState} from '@/stores/chain'

interface Props {
  children?: React.ReactNode;
}

const WalletViewerFrame = ({children}: Props) => {
  return (
    <div className="fixed top-2 left-2 px-4 py-2 text-black border-2" >
      {children}
    </div>
  )
}

const WalletViewer = () => {
  const currentUser = useAtomValue(currentUserState)
  const chain = useAtom(chainState)
  if (!currentUser) return (
    <WalletViewerFrame>
      <p className="text-sm">Loading...</p>
    </WalletViewerFrame>
  )
  return (
    <WalletViewerFrame>
      <p className="text-sm">ID: {currentUser?.id}</p>
    </WalletViewerFrame>
  )
}

export default WalletViewer
