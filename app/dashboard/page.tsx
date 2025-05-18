'use client'

import Link from 'next/link'
import { useAtom } from 'jotai'
import { sideMenuState } from '@/stores/ui'
import TxsViewer from '@/components/TxsViewer'
import ChainViewer from '@/components/ChainViewer'
import CreateWalletView from '@/components/CreateWalletView'
import UsersViewer from '@/components/UsersViewer'
import WalletViewer from '@/components/WalletViewer'
import MenuButton from '@/components/MenuButton'
import SideMenu from '@/components/SideMenu'

// Modal.setAppElement('#root')

const Dashboard = () => {
  const [sideMenu] = useAtom(sideMenuState)

  return (
    <main className={`flex min-h-screen flex-col items-center overflow-x-hidden ${
      sideMenu ? 'overflow-hidden h-screen' : 'overflow-x-hidden'
    }`}>
      <WalletViewer />
      <MenuButton />
      <SideMenu />
      <ChainViewer />
      <div>
        <TxsViewer />
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
