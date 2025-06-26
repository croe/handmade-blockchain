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
    title: "ようこそハンドメイドブロックチェーンへ",
    content: "ハンドメイドブロックチェーンは、\n" +
      "ブロックチェーンの構造を模したオンライン対戦型のコイン争奪ゲームです。プレイヤーは、実際にブロックチェーンを利用するのと同等の行動を取ることができ、その行動によってコインの獲得を目指します。\n" +
      "\n" +
      "ハンドメイドブロックチェーンでは一定期間がシーズンとして区切られます。\n" +
      "そのシーズンで獲得したコインを使って実際の景品と交換することが可能です。\n" +
      "\n" +
      "できるだけたくさんのコインを貯めて、景品獲得目指すことがプレイヤーの目的となります。",
    image: "/images/tutorial_1.png",
    color: "bg-blue-50"
  },
  {
    id: 2,
    title: "あなた専用のウォレットが自動作成されました",
    content: "アプリをはじめて起動したときに、起動時に自動的にあなた専用のウォレットが作られます。\n" +
      "ウォレットは、コインを受け取ったり送ったりするための入れ物のようなもので、あなたのコインの保有状況を確認する場所でもあります。\n" +
      "今持っているコインの枚数や、コインの受取・送金の履歴が確認できます。\n" +
      "あなたはこのウォレットを通じたコインのやり取りによってゲームに参加することになります。また、本アプリではブラウザキャッシュを用いてウォレットと端末を紐づけています。キャッシュを削除した場合、紐づけは解除され、そのウォレットにアクセスする手段は失われます。\n",
      // "以下で詳細を確認できます。ホーム＞メニュー＞「本アプリにおけるブラウザキャッシュの取り扱いについて」",
    image: "/images/tutorial_2.png",
    color: "bg-green-50"
  },
  {
    id: 3,
    title: "取引を作成しよう",
    content: "プレイヤーがアプリ内で最初に取るべき行動はコインの送金です。\n" +
      "プレイヤーは自身のウォレットから、他プレイヤーのウォレットまたは後述する特殊ウォレットに対して自由に送金を行うことができます。\n" +
      "しかしブロックチェーンの世界では送金を成立させるために複数のハードルをクリアする必要があります。最初のステップは「取引」を作成することです。取引は「誰に」「いくら送金する」かを宣言する契約書のようなものです。取引を作成して初めて送金を行うチャンスが生まれるため、まずは取引を作成してみましょう。",
    image: "/images/tutorial_3.png",
    color: "bg-purple-50"
  },
  {
    id: 4,
    title: "ブロックを作成しよう",
    content: "「ブロック」は、いくつかの取引を入れるための箱のようなものです。\n" +
      "ブロックに格納されることで取引の内容が確定し、正式な記録として残されます。\n" +
      "またブロック同士は必ずつながっており、そのつながりを「チェーン」といいます。どのブロックに接続するかはプレイヤーは選択できます。つながりの先端のブロック作成ボタン、または任意のブロックを選択して「このブロックから分岐させる」ボタンを押すことでブロックを作成できます。ブロックの作成にはクールタイムが存在し、残り時間が画面左下のタイマーで確認できます。",
    image: "/images/tutorial_4.png",
    color: "bg-yellow-50"
  },
  {
    id: 5,
    title: "さあ始めましょう",
    content: "以上が大まかな本アプリの導入になります。各工程の詳しい説明はそれぞれのページにて確認できます。\n" +
      "\n" +
      "また、このチュートリアルは、トップ＞メニュー＞チュートリアルからいつでも確認することができます。",
    color: "bg-red-50"
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
      <div className="flex-1 w-full max-w-md mx-auto px-4 pb-4">
        {/* スライド番号 */}
        <div className="text-right mb-4">
            <span className="text-sm text-gray-500">
              {currentSlide + 1} / {tutorialSlides.length}
            </span>
        </div>
        {/* タイトル */}
        <h2 className="font-bold text-[#484848] mb-4 text-center pb-1 border-b border-[#484848]">
          {currentSlideData.title}
        </h2>
        <div className="flex flex-col">
          {/* アイコン */}
          {currentSlideData.image && (
            <div className="flex justify-center mb-6">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full object-contain"
              />
            </div>
          )}

          {/* コンテンツ */}
          <p className="text-gray-600 leading-relaxed flex-1">
            {currentSlideData.content}
          </p>

          {/* 最後のスライドの場合のアクションボタン */}
          {currentSlide === tutorialSlides.length - 1 && (
            <div className="mt-6 space-y-3">
              <BasicButton onClick={goToTransaction}>
                <span>取引作成を始める</span>
              </BasicButton>
              <BasicButton onClick={goToDashboard}>
                <span>ダッシュボードに戻る</span>
              </BasicButton>
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
