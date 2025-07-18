'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {useAtom} from 'jotai/index'
import {sideMenuState} from '@/stores/ui'

const BackButton = () => {
  const [sideMenu] = useAtom(sideMenuState)
  const router = useRouter()
  const handleClick = () => {
    router.back()
  }

  return (
    <button
      className={`fixed ${!sideMenu && 'z-20'} top-6 left-0 rounded-r-full bg-[#E0E0E0] w-20 py-5 px-8 mt-0 flex items-center gap-3 text-sm h-20`}
      onClick={handleClick}
    >
      <img src="/images/icons/menu_opened.svg" alt="" />
    </button>
  )
}

export default BackButton
