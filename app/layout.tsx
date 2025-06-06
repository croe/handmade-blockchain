import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins, Zen_Kaku_Gothic_New } from "next/font/google"
import { Providers } from "@/components/Provider/providers"
import UserSignal from '@/components/UserSignal'
import RenderMounted from '@/components/ClientRender'
import { ToastContainer } from 'react-toastify';

const poppins = Poppins({ weight: ["400", "900"], subsets: ['latin'] })
const zenKakuGothicNew = Zen_Kaku_Gothic_New({ weight: ["400", "900"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "HANDMADE BLOCKCHAIN",
  description: "手作りでブロックチェーンを作る",
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
      <link rel="apple-touch-icon" href="/icon.png"></link>
    </head>
      <body id="root" suppressHydrationWarning>
        <RenderMounted>
          <Providers>
            <UserSignal />
            <ToastContainer />
            {children}
          </Providers>
        </RenderMounted>
      </body>
    </html>
  )
}
