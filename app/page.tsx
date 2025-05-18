'use client'

import Link from 'next/link'
import type React from 'react'
import SplashImage from '@/assets/images/splash.svg'

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <Link href="/dashboard">
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <img className="w-[250px] animate-fadeIn" src={SplashImage.src} alt=""/>
        </div>
        <div className="fixed bottom-24 left-0 w-full">
          <p className="font-black text-center text-[#6B73FF] animate-fadeIn-delay-1s">Tap To Start</p>
        </div>
      </Link>
    </main>
  )
}
