'use client'

import Link from 'next/link'
import type React from 'react'
import SplashImage from '@/assets/images/splash.svg'

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <Link href="/dashboard">
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <img className="w-[250px]" src={SplashImage.src} alt=""/>
        </div>
      </Link>
    </main>
  )
}
