'use client'

import {useAtom} from 'jotai'
import {sideMenuState} from '@/stores/ui'
import IconMenuButton from '@/components/IconMenuButton'
import BasicButton from '@/components/BasicButton'
import Link from 'next/link'

const menuItems = [
  { icon: '/images/icons/tip_block_make.svg', label: 'ブロック作成', href: '/block/create' },
  { icon: '/images/icons/tip_tx_make.svg', label: '取引作成', href: '/tx/create' },
  { icon: '/images/icons/tip_tx_pool.svg', label: '取引プール', href: '/tx' },
  { icon: '/images/icons/tip_shop.svg', label: 'ショップ', href: '/shop' },
  { icon: '/images/icons/tip_wallet.svg', label: 'ウォレット詳細', href: '/wallet' },
  { icon: '/images/icons/tip_tutorial.svg', label: 'チュートリアル', href: '/tutorial' },
]

const SideMenu = () => {
  const [sideMenu, setSideMenu] = useAtom(sideMenuState)

  // 仮データ
  const cacheInfo = {
    lastUpdate: '2025年05月05日13:33.17',
    walletNames: ['walletname001', 'walletname001', 'walletname001', 'walletname001'],
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#E0E0E0] text-xs transform ${
          sideMenu ? '-translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-10 flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        {/* 上部ロゴ・閉じるボタン */}
        <div className="flex items-center justify-between px-4 h-[118px]">
          <div className="flex flex-col font-black text-[22px] leading-5 text-[#3E3EFF]">
            <span>HANDMADE</span>
            <span className="tracking-wider">BLOCKCHAIN</span>
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
              <span>{cacheInfo.lastUpdate}</span>
            </div>
            <div className="flex gap-2 mt-1 text-[#888] text-[12px]">
              <span>日時:</span>
              <span>{cacheInfo.walletNames[0]}</span>
            </div>
            <div className="flex gap-2 mt-1 text-[#888] text-[12px]">
              <span>更新時期元:</span>
              <div className="flex flex-col gap-0.5">
                {cacheInfo.walletNames.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* アクションボタン */}
        <div className="px-4 mt-3 flex flex-col gap-2">
          <button className="w-full py-3 rounded-xl bg-cyan-400 text-white font-bold text-[15px] shadow flex items-center justify-center gap-2">
            手動で更新を開始する
            <img src="/images/icons/arrow_clockwise.svg" className="w-4 h-4" alt="reload" />
          </button>
          <button className="w-full py-3 rounded-xl bg-[#888] text-white font-bold text-[15px] shadow flex items-center justify-center gap-2">
            本アプリのキャッシュの取扱
            <img src="/images/icons/info.svg" className="w-4 h-4" alt="info" />
          </button>
        </div>
        {/* 下部説明文 */}
        <div className="mt-auto px-4 pb-4 pt-6 text-[12px] text-[#888] leading-relaxed bg-[#F4F4F4] overflow-y-scroll">
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
