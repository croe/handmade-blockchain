'use client'

import React from 'react'
import { useAtom } from 'jotai'
import { sideMenuState } from '@/stores/ui'

const MenuButton = () => {
  const [sideMenu, setSideMenu] = useAtom(sideMenuState)

  const handleClick = () => {
    setSideMenu(!sideMenu)
  }

  return (
    <button
      className={`fixed z-20 top-20 right-0 rounded-l-full w-20 py-5 px-8 mt-0 flex items-center gap-3 text-sm h-20 ${sideMenu ? "bg-[#F4F4F4]" : "bg-[#E0E0E0]"}`}
      onClick={handleClick}
    >
      {sideMenu ? (
        <img src="/images/icons/menu_close.svg" alt="" />
      ): (
        <img src="/images/icons/menu.svg" alt="" />
      )}
    </button>
  )
}

export default MenuButton
