'use client'

import {useAtom} from 'jotai'
import {sideMenuState, exhibitionModeState, persistExhibitionMode} from '@/stores/ui'
import IconMenuButton from '@/components/Button/IconMenuButton'
import BasicButton from '@/components/Button/BasicButton'
import Link from 'next/link'
import { lastUpdateStringState, connectedUserNamesState } from '@/stores/sync'
import {generateReadableId} from '@/utils/id-to-readable-string'

const menuItems = [
  { icon: '/images/icons/tip_block_make.svg', label: 'ブロック作成', href: '/dashboard' },
  { icon: '/images/icons/tip_tx_make.svg', label: '取引作成', href: '/tx/create' },
  { icon: '/images/icons/tip_tx_pool.svg', label: '未承認取引一覧', href: '/tx/pool' },
  { icon: '/images/icons/tip_shop.svg', label: 'ショップ', href: '/shop' },
  { icon: '/images/icons/tip_wallet.svg', label: 'ウォレット詳細', href: '/wallet' },
  { icon: '/images/icons/tip_tutorial.svg', label: 'チュートリアル', href: '/tutorial' },
]

const SideMenu = () => {
  const [sideMenu, setSideMenu] = useAtom(sideMenuState)
  const [exhibitionMode, setExhibitionMode] = useAtom(exhibitionModeState)
  const [lastUpdate] = useAtom(lastUpdateStringState)
  const [connectedUserNames] = useAtom(connectedUserNamesState)

  const handleToggleExhibitionMode = () => {
    const newMode = !exhibitionMode
    setExhibitionMode(newMode)
    persistExhibitionMode(newMode)
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#E0E0E0] text-xs transform ${
          sideMenu ? '-translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-10 flex flex-col overflow-y-scroll`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        {/* 上部ロゴ */}
        <div className="flex items-center justify-between px-4 pt-12 pb-8">
          <div className="flex flex-col font-black text-[22px] leading-5 text-[#3E3EFF]">
            <span>HANDMADE</span>
            <span className="tracking-wider">BLOCKCHAIN</span>
          </div>
        </div>
        {/* 展示モード切り替え */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl px-4 py-3 shadow border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${exhibitionMode ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span className="text-[13px] font-bold text-[#888]">展示モード</span>
              </div>
              <button
                onClick={handleToggleExhibitionMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  exhibitionMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    exhibitionMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 text-[11px] text-[#888]">
              {exhibitionMode ? '制限機能が有効です' : '全ての機能が利用可能です'}
            </div>
          </div>
        </div>
        {/* メニューグリッド */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-2 mb-4">
          {menuItems.map((item, i) => (
            <IconMenuButton key={item.label} iconSrc={item.icon} label={item.label} href={item.href} />
          ))}
        </div>
        {/* キャッシュ情報 */}
        <div className="px-4 mt-2 mb-2">
          <div className="flex items-center gap-1 text-[#888] text-[13px] font-bold mb-1">
            <img src="/images/icons/db.svg" className="w-4 h-4" alt="db" />
            <span>キャッシュ情報</span>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 shadow border border-[#E0E0E0]">
            <div className="flex justify-between text-[#888] text-[12px]">
              <span>キャッシュの最終更新</span>
              <span>{lastUpdate}</span>
            </div>
            <div className="flex gap-2 mt-1 text-[#888] text-[12px]">
              <span>接続ユーザー数:</span>
              <span>{connectedUserNames.length}人</span>
            </div>
            <div className="flex gap-2 mt-1 text-[#888] text-[12px]">
              <span>更新元:</span>
              <div className="flex flex-col gap-0.5">
                {connectedUserNames.length > 0 ? (
                  connectedUserNames.map((userName, i) => (
                    <span key={i}>{generateReadableId(userName)}</span>
                  ))
                ) : (
                  <span>接続中のユーザーなし</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* アクションボタン */}
        <div className="px-4 mt-3 mb-5 flex flex-col gap-2">
          {/*<BasicButton>*/}
          {/*  <span className="text-base">手動で更新を開始する</span>*/}
          {/*  <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="reload" />*/}
          {/*</BasicButton>*/}
          <button className="w-full py-3 rounded-xl bg-[#888] text-white font-bold text-[15px] shadow flex items-center justify-center gap-2">
            本アプリのキャッシュの取扱
            <img src="/images/icons/info.svg" className="w-4 h-4" alt="info" />
          </button>
        </div>
        {/* 下部説明文 */}
        <div className="mt-auto px-4 pb-4 pt-6 text-[12px] text-[#888] leading-relaxed bg-[#F4F4F4]">
          <div className="flex items-center gap-1 mb-1">
            <img src="/images/icons/book.svg" className="w-4 h-4" alt="book" />
            <span className="font-bold">ハンドメイドブロックチェーンについて</span>
          </div>
          <div>
            ハンドメイドのブロックチェーンを実際に動かし、開始から会期終了までの全ての取引データを各参加者の端末に保存します。これにより中央の管理者を持たずにデータを正しく追加していく体験ができます。併せてデジタル投票システムの作品も展示する予定です。ハンドメイドブロックチェーンという技術は2008年に誕生して以来、データの改ざんを防ぐ仕組みとして注目されています。
          </div>
        </div>
      </div>
    </>

  )
}

export default SideMenu
