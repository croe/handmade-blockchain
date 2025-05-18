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
import BottomBar from '@/components/BottomBar'

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
      <BottomBar>
        <div className="flex items-center gap-8 justify-center">
          <div className="min-w-32 text-[#3842FF] flex flex-col items-center justify-center">
            <p className="text-xs font-black">ブロック作成可能まで</p>
            <p className="text-[29px] font-black">08m28s</p>
          </div>
          <div className="w-full flex justify-center gap-5 mb-8">
            <Link href={`/shop`}>
              <div className="relative w-[45px] h-[77px]">
                <img className="absolute top-0 left-1/2 -translate-x-1/2 w-[34px] h-[40px]" src="/images/icons/shop_1.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[45px] h-[42px]" src="/images/icons/box_shop.svg" alt=""/>
              </div>
            </Link>
            <Link href={`/tx/create`}>
              <div className="relative w-[35px] h-[77px]">
                <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tx_make.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_tx.svg" alt=""/>
              </div>
            </Link>
            <Link href={`/tx`}>
              <div className="relative w-[35px] h-[77px]">
                <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tx_list.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_verify.svg" alt=""/>
              </div>
            </Link>
          </div>
        </div>
      </BottomBar>
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
