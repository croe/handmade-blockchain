import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import WalletViewer from '@/components/WalletViewer'
import UserSignal from '@/components/UserSignal'
import RenderMounted from '@/components/ClientRender'

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className} suppressHydrationWarning>
        <RenderMounted>
          <Providers>
            <UserSignal />
            <WalletViewer />
            {children}
          </Providers>
        </RenderMounted>
      </body>
    </html>
  )
}
