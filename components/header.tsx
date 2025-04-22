"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          ゲームタイトル
        </Link>

        {/* モバイルメニューボタン */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-purple-400 transition">
            ホーム
          </Link>
          <Link href="#features" className="hover:text-purple-400 transition">
            特徴
          </Link>
          <Link href="#screenshots" className="hover:text-purple-400 transition">
            スクリーンショット
          </Link>
          <Link href="#leaderboard" className="hover:text-purple-400 transition">
            ランキング
          </Link>
          <Link href="#download" className="hover:text-purple-400 transition">
            ダウンロード
          </Link>
        </nav>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/" className="hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>
              ホーム
            </Link>
            <Link href="#features" className="hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>
              特徴
            </Link>
            <Link href="#screenshots" className="hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>
              スクリーンショット
            </Link>
            <Link href="#leaderboard" className="hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>
              ランキング
            </Link>
            <Link href="#download" className="hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>
              ダウンロード
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
