'use client'

import {useAtom} from 'jotai'
import {sideMenuState} from '@/stores/ui'
import BasicButton from '@/components/BasicButton'
import Link from 'next/link'

const SideMenu = () => {
  const [sideMenu] = useAtom(sideMenuState)

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#E0E0E0] md:text-sm text-xs transform ${
          sideMenu ? '-translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-10 flex flex-col items-center justify-between`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        <div className="w-full flex flex-col items-center overflow-y-scroll pt-[190px] px-5 pb-10 gap-7">
          <div className="w-full border-t border-[#999] pt-3">
            <h2 className="flex gap-1 items-center text-[#999]">
              <img className="w-5" src="/images/icons/db.svg" alt=""/>
              <span>キャッシュ情報</span>
            </h2>
            <div className="pl-5 mt-2 flex flex-col gap-2">
              <p>
                「Handmade Blockchain」は、ブロックチェーンの仕組みを自分の手で擬似的に体験することができるアプリです。参加者は自身のスマートフォンでハンドメイドのブロックチェーンを実際に動かし、会期開始から終了までのすべての取引とブロックを各自の端末に保存します。
                取引データを参加者自身の手で検証し、追加していくことで、このブロックチェーンの正しさが保たれていきます。ブロックチェーンは大きなイノベーションである一方で、ブラックボックス＝よくわからないものと捉えられてしまうと、活用の可能性を想像しにくい存在にもなり得ます。
                この作品では、実際のブロックチェーンに近い体験を通して、その仕組みをより直感的に理解し、その構造や概念の美しさを感じ取ることを目指しています。
              </p>
              <Link href={'/block/create'}>ブロック作成</Link>
              <BasicButton>チュートリアルをすべて見る</BasicButton>
            </div>
          </div>
          <div className="w-full border-t border-[#999] pt-3">
            <h2 className="flex gap-1 items-center text-[#999]">
              <img className="w-5" src="/images/icons/book.svg" alt=""/>
              <span>ハンドメイドブロックチェーンの使い方</span>
            </h2>
            <div className="pl-5 mt-2 flex flex-col gap-2">
              <p>
                「Handmade Blockchain」は、ブロックチェーンの仕組みを自分の手で擬似的に体験することができるアプリです。参加者は自身のスマートフォンでハンドメイドのブロックチェーンを実際に動かし、会期開始から終了までのすべての取引とブロックを各自の端末に保存します。
                取引データを参加者自身の手で検証し、追加していくことで、このブロックチェーンの正しさが保たれていきます。ブロックチェーンは大きなイノベーションである一方で、ブラックボックス＝よくわからないものと捉えられてしまうと、活用の可能性を想像しにくい存在にもなり得ます。
                この作品では、実際のブロックチェーンに近い体験を通して、その仕組みをより直感的に理解し、その構造や概念の美しさを感じ取ることを目指しています。
              </p>
              <BasicButton>チュートリアルをすべて見る</BasicButton>
            </div>
          </div>
          <div className="w-full border-t border-[#999] flex flex-col gap-2 pt-3">
            <h2 className="text-3xl font-black text-[#999]">
              HANDMAKE<br/>
              BLOCKCHAIN
            </h2>
            <div className="pl-5">
              <p>Artist: Akihiro Kato</p>
              <p>Design: Shingo Kurita</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
