'use client'

import {useAtom} from 'jotai'
import {sideMenuState} from '@/stores/ui'
import IconMenuButton from '@/components/Button/IconMenuButton'
import BasicButton from '@/components/Button/BasicButton'
import Link from 'next/link'
import { lastUpdateStringState, connectedUserNamesState } from '@/stores/sync'
import {generateReadableId} from '@/utils/id-to-readable-string'

const menuItems = [
  // { icon: '/images/icons/tip_block_make.svg', label: 'ブロック作成', href: '/dashboard' },
  { icon: '/images/icons/tip_tx_make.svg', label: '取引作成', href: '/tx/create' },
  { icon: '/images/icons/tip_tx_pool.svg', label: '未承認取引一覧', href: '/tx/pool' },
  { icon: '/images/icons/tip_shop.svg', label: 'ショップ', href: '/shop' },
  { icon: '/images/icons/tip_wallet.svg', label: 'ウォレット詳細', href: '/wallet' },
  { icon: '/images/icons/tip_tutorial.svg', label: 'チュートリアル', href: '/tutorial' },
]

const SideMenu = () => {
  const [sideMenu] = useAtom(sideMenuState)
  const [lastUpdate] = useAtom(lastUpdateStringState)
  const [connectedUserNames] = useAtom(connectedUserNamesState)

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
        {/* メニューグリッド */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-2 mb-4">
          {menuItems.map((item, i) => (
            <IconMenuButton
              key={item.label}
              iconSrc={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </div>
        {/* キャッシュ情報 */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl px-4 py-3 shadow border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold text-[#888]">最終更新</span>
              <span className="text-[11px] text-[#888]">{lastUpdate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#888]">接続ユーザー</span>
              <span className="text-[11px] text-[#888]">{connectedUserNames.length}人</span>
            </div>
          </div>
        </div>
        {/* 接続ユーザー一覧 */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl px-4 py-3 shadow border border-[#E0E0E0]">
            <div className="text-[13px] font-bold text-[#888] mb-2">接続ユーザー一覧</div>
            <div className="space-y-1">
              {connectedUserNames.map((name, i) => (
                <div key={i} className="text-[11px] text-[#888]">
                  {generateReadableId(name)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 管理者ページリンク */}
        <div className="px-4 mb-4">
          <Link href="/admin">
            <BasicButton className="w-full">
              <span className="text-[13px]">管理者ページ</span>
            </BasicButton>
          </Link>
        </div>
      </div>
    </>
  )
}

export default SideMenu
