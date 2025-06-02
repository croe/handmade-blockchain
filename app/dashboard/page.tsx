'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { sideMenuState } from '@/stores/ui'
import { currentUserState } from '@/stores/users'
import ChainViewer from '@/components/ChainViewer'
import UsersViewer from '@/components/UsersViewer'
import WalletViewer from '@/components/WalletViewer'
import MenuButton from '@/components/Button/MenuButton'
import SideMenu from '@/components/SideMenu'
import BottomBar from '@/components/BottomBar'
import CountDownTimer from '@/components/CountDownTimer'

// Modal.setAppElement('#root')

const Dashboard = () => {
  const [currentUser] = useAtom(currentUserState)
  const [sideMenu] = useAtom(sideMenuState)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser])

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
          <CountDownTimer />
          <div className="w-full flex justify-center gap-5 mb-8">
            <Link href={`/shop`}>
              <div className="relative w-[45px] h-[77px]">
                <img className="absolute top-0 left-1/2 -translate-x-1/2 w-[34px] h-[40px]" src="/images/icons/tip_shop.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[45px] h-[42px]" src="/images/icons/box_shop.svg" alt=""/>
              </div>
              <p className="text-[10px] text-[#3E68C6] font-black mt-2">ショップ</p>
            </Link>
            <Link href={`/tx/create`}>
              <div className="relative w-[35px] h-[77px]">
                <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tip_tx_make.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_tx.svg" alt=""/>
              </div>
              <p className="text-[10px] text-[#763EC6] font-black mt-2">取引作成</p>
            </Link>
            <Link href={`/tx/pool`}>
              <div className="relative w-[35px] h-[77px]">
                <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tip_tx_pool.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_pool.svg" alt=""/>
              </div>
              <p className="text-[10px] text-[#2AE864] font-black mt-2">取引プール</p>
            </Link>
          </div>
        </div>
      </BottomBar>
      <div>
        <UsersViewer />
      </div>
    </main>
  )
}

export default Dashboard
