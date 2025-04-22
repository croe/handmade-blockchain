import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "モバイルゲーム公式サイト",
  description: "最高のモバイルゲーム体験をお届けします。",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={inter.className}>
        <header>Header</header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  )
}
