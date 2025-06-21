'use client'

import TitleHeader from '@/components/TitleHeader'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'
import { generateReadableId, getAvatarForId } from '@/utils/id-to-readable-string'
import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import {allMyTxsState, myBalanceState} from '@/stores/transactions'
import TxViewer from '@/components/TxViewer'
import ExhibitionModeRestriction from '@/components/ExhibitionModeRestriction'
import SupportAgentBlock from '@/components/SupportAgentBlock'
import { WalletTutorialModal } from '@/components/Modal/Tutorial/WalletTutorialModal'
import { useState } from 'react'

const WalletProfile = () => {
  const [currentUser] = useAtom(currentUserState)

  return (
    <div className="flex gap-2.5">
      <div className="flex flex-col items-center justify-center">
        {currentUser ? (
          <img className="w-8 h-8" src={getAvatarForId(currentUser.id)} alt=""/>
        ):(
          <div className="w-8 h-8 bg-gray-400 rounded-full" />
        )}
      </div>
      <div className="flex flex-col items-start">
        <h2>{currentUser ? generateReadableId(currentUser.id) : '-'}</h2>
        <p className="text-xs text-[#73683A]">ComoNeCoin</p>
      </div>
    </div>
  )
}

const MyBalance = () => {
  const [myBalance] = useAtom(myBalanceState)

  return (
    <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-3xl bg-white px-4 py-3 justify-between">
      <img className="h-8" src="/images/icons/cnc.svg" alt=""/>
      <span className="text-4xl text-[#3d3d3d] font-black">{myBalance.toLocaleString()}</span>
    </div>
  )
}

const WalletPage = () => {
  const [allMyTxs] = useAtom(allMyTxsState)
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false)
  console.log(allMyTxs)

  return (
    <ExhibitionModeRestriction feature="wallet-management">
      <main>
        <TitleHeader
          title="ウォレットの詳細"
          help={<HelpButton onClick={() => setTutorialOpen(true)} />}
        />
        <WalletTutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        <MiniLayout>
          <SupportAgentBlock>
            ここではあなたのウォレットの詳細を確認できます。<br />
            ウォレットとはコインを入れておく場所であり、このウォレット同士でコインのやり取りが可能です。<br />
            電子マネーサービスのアカウントをイメージするとわかりやすいでしょう。<br />
            このページでは現在所持しているコイン総額や、取引の履歴が表示されます。<br />
            <br />
            取引は、<br />
            <ul className="list-disc pl-5">
              <li>成立している取引</li>
              <li>承認された取引</li>
              <li>未承認の取引</li>
            </ul>
            の３種類に分類され、この内成立している取引による送金内容を足し合わせたものがウォレット所持するコイン総額として表示されます。
          </SupportAgentBlock>
          <div className="flex flex-col gap-2.5 pb-6 border-b border-[#E5E5E5]">
            <WalletProfile />
            <MyBalance />
          </div>
          <div>
            <div className="flex flex-col gap-2.5 pb-10">
              {allMyTxs.map((x, i) => (
                <TxViewer key={i} tx={x} />
              ))}
            </div>
          </div>
        </MiniLayout>
      </main>
    </ExhibitionModeRestriction>
  )
}

export default WalletPage
