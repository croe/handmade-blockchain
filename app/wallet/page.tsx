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
  console.log(allMyTxs)

  return (
    <ExhibitionModeRestriction feature="wallet-management">
      <main>
        <TitleHeader
          title="ウォレットの詳細"
          help={<HelpButton />}
        />
        <MiniLayout>
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
