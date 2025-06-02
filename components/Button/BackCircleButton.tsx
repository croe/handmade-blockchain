'use client'

import React from 'react'

type Props = {
  onClick?: () => void
}

const BackCircleButton = ({onClick}:Props) => {
  return (
    <button
      className="rounded-full w-14 h-14 bg-gray-500 flex items-center justify-center p-1"
      onClick={onClick}
    >
      <div className="border border-[#E5E5E5] w-full h-full rounded-full flex justify-center items-center">
        <img src="/images/icons/mini/white/menu_opened.svg" className="w-5 h-5" alt="back"/>
      </div>
    </button>
  )
}

export default BackCircleButton
