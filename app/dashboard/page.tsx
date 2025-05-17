'use client'

import TxsViewer from '@/components/TxsViewer'
import ChainViewer from '@/components/ChainViewer'
import CreateWalletView from '@/components/CreateWalletView'
import UsersViewer from '@/components/UsersViewer'
import Link from 'next/link'
import type React from 'react'
import WalletViewer from '@/components/WalletViewer'
import MenuButton from '@/components/MenuButton'

const Dashboard = () => {
  return (
    <main className="flex min-h-screen flex-col items-center py-8">
      <WalletViewer />
      <MenuButton />
      <div>
        <TxsViewer />
      </div>
      <div>
        <ChainViewer />
      </div>
      <div>
        <CreateWalletView/>
      </div>
      <div>
        <UsersViewer />
      </div>
      <p><Link href={`/tx/create`}>CREATE TX</Link></p>
      <p><Link href={`/block/create`}>CREATE BLOCK</Link></p>
    </main>
  )
}

export default Dashboard
