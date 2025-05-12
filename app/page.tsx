'use client'

import Link from 'next/link'
import CreateWalletView from '@/components/CreateWalletView'
import UsersViewer from '@/components/UsersViewer'
import ChainViewer from '@/components/ChainViewer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 py-8">
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
