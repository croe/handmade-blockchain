'use client'

import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { sideMenuState } from '@/stores/ui'
import { currentUserState } from '@/stores/users'
import MenuButton from '@/components/Button/MenuButton'
import SideMenu from '@/components/SideMenu'
import TitleHeader from '@/components/TitleHeader'
import BasicButton from '@/components/Button/BasicButton'
import { useExhibitionMode } from '@/hooks/useExhibitionMode'

const tutorialSlides = [
  {
    id: 1,
    title: "ハンドメイド・ブロックチェーンへようこそ！",
    content: "このアプリでは、実際にブロックチェーンを手作業で作りながら、その仕組みを学ぶことができます。",
    image: "/images/icons/tip_tutorial.svg",
    color: "bg-blue-50"
  },
  {
    id: 2,
    title: "ブロックチェーンとは？",
    content: "ブロックチェーンは、取引データをブロックにまとめて、鎖のように繋げて保存する技術です。一度記録されたデータは改ざんが困難で、信頼性の高いシステムを構築できます。",
    image: "/images/icons/block_1.svg",
    color: "bg-green-50"
  },
  {
    id: 3,
    title: "取引（Transaction）",
    content: "取引は、誰かから誰かに何かを送る記録です。このアプリでは、コインの送金取引を作成できます。",
    image: "/images/icons/tip_tx_make.svg",
    color: "bg-purple-50"
  },
  {
    id: 4,
    title: "ブロック（Block）",
    content: "ブロックは複数の取引をまとめた箱のようなものです。新しいブロックは前のブロックの情報を含むため、鎖のように繋がります。",
    image: "/images/icons/tip_block_make.svg",
    color: "bg-yellow-50"
  },
  {
    id: 5,
    title: "チェーン（Chain）",
    content: "ブロックが連続して繋がったものがチェーンです。最長のチェーンが正しい履歴として認められます。",
    image: "/images/icons/branch.svg",
    color: "bg-red-50"
  },
  {
    id: 6,
    title: "ウォレット（Wallet）",
    content: "ウォレットはあなたのコインを管理する場所です。取引の送信や受信に使用します。",
    image: "/images/icons/tip_wallet.svg",
    color: "bg-indigo-50"
  },
  {
    id: 7,
    title: "実際に体験してみよう！",
    content: "それでは実際に取引を作成して、ブロックを作成してみましょう。まずは取引作成から始めます。",
    image: "/images/icons/tip_tx_make.svg",
    color: "bg-orange-50"
  }
]

const Tutorial = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentUser] = useAtom(currentUserState)
  const [sideMenu, setSideMenu] = useAtom(sideMenuState)
  const { exhibitionMode } = useExhibitionMode()
  const router = useRouter()

  useEffect(() => {
    setSideMenu(false)
  }, [])

  const nextSlide = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToTransaction = () => {
    router.push('/tx/create')
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  const currentSlideData = tutorialSlides[currentSlide]

  return (
    <main className={`flex min-h-screen flex-col items-center overflow-x-hidden ${
      sideMenu ? 'overflow-hidden h-screen' : 'overflow-x-hidden'
    }`}>
      <MenuButton />
      <SideMenu />

      {/* ヘッダー */}
      <TitleHeader title="チュートリアル" />

      {/* スライドコンテンツ */}
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-8">
        <div className={`rounded-2xl p-6 ${currentSlideData.color} min-h-[400px] flex flex-col`}>
          {/* スライド番号 */}
          <div className="text-right mb-4">
            <span className="text-sm text-gray-500">
              {currentSlide + 1} / {tutorialSlides.length}
            </span>
          </div>

          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* タイトル */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {currentSlideData.title}
          </h2>

          {/* コンテンツ */}
          <p className="text-gray-600 leading-relaxed flex-1">
            {currentSlideData.content}
          </p>

          {/* 最後のスライドの場合のアクションボタン */}
          {currentSlide === tutorialSlides.length - 1 && (
            <div className="mt-6 space-y-3">
              <BasicButton onClick={goToTransaction}>
                <span>取引作成を始める</span>
                <img src="/images/icons/tip_tx_make.svg" className="w-5 h-5" alt="transaction" />
              </BasicButton>
              <button
                onClick={goToDashboard}
                className="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-[15px] shadow flex items-center justify-center gap-2"
              >
                ダッシュボードに戻る
                <img src="/images/icons/tip_block_make.svg" className="w-4 h-4" alt="dashboard" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="w-full max-w-md mx-auto px-4 pb-8">
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-3 rounded-xl font-bold text-[15px] shadow flex items-center gap-2 ${
              currentSlide === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <img src="/images/icons/circle_back.svg" className="w-4 h-4" alt="back" />
            前へ
          </button>

          {/* プログレスバー */}
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / tutorialSlides.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === tutorialSlides.length - 1}
            className={`px-6 py-3 rounded-xl font-bold text-[15px] shadow flex items-center gap-2 ${
              currentSlide === tutorialSlides.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            次へ
            <img src="/images/icons/circle_pen.svg" className="w-4 h-4" alt="next" />
          </button>
        </div>
      </div>

      {/* 展示モード表示 */}
      {exhibitionMode && (
        <div className="fixed top-4 left-4 z-40 bg-yellow-100 border border-yellow-400 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-yellow-800">展示モード</span>
          </div>
        </div>
      )}
    </main>
  )
}

export default Tutorial
