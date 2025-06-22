import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins, Zen_Kaku_Gothic_New } from "next/font/google"
import { Providers } from "@/components/Provider/providers"
import UserSignal from '@/components/UserSignal'
import RenderMounted from '@/components/ClientRender'
import { ToastContainer } from 'react-toastify';
import ExhibitionModeInitializer from '@/components/ExhibitionModeInitializer'
import ExhibitionModeToggle from '@/components/ExhibitionModeToggle'

const poppins = Poppins({ weight: ["400", "900"], subsets: ['latin'] })
const zenKakuGothicNew = Zen_Kaku_Gothic_New({ weight: ["400", "900"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "HANDMADE BLOCKCHAIN",
  description: "手作りでブロックチェーンを作る",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon512_rounded.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth" suppressHydrationWarning>
    <head>
      <title>HANDMADE BLOCKCHAIN</title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </head>
      <body id="root" suppressHydrationWarning>
        <RenderMounted>
          <Providers>
            <ExhibitionModeInitializer />
            <ExhibitionModeToggle />
            <UserSignal />
            <ToastContainer />
            {children}
          </Providers>
        </RenderMounted>
      </body>
    </html>
  )
}
