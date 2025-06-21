'use client'

import TitleHeader from '@/components/TitleHeader'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'
import {useAtom} from 'jotai'
import {pendingTxsState} from '@/stores/transactions'
import TxCard from '@/components/TxCard'
import SupportAgentBlock from '@/components/SupportAgentBlock'
import { TxPoolTutorialModal } from '@/components/Modal/Tutorial/TxPoolTutorialModal'
import { useState } from 'react'

const TxPoolPage = () => {
  const [pendingTxs, setPendingTxs] = useAtom(pendingTxsState)
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false)

  console.log(pendingTxs)

  return (
    <main>
      <TitleHeader
        title="未承認取引一覧"
        subtitle="現在の最長チェーンの未検証取引を表示しています。"
        help={<HelpButton onClick={() => setTutorialOpen(true)} />}
      />
      <TxPoolTutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <MiniLayout>
        <SupportAgentBlock>
          ここには、すべての作成された取引のうち、ブロックに格納されていないため検証がおこなわれていないものが表示されています。<br />
          ここに表示されている取引はまだ成立しておらず、ブロックへの格納を待機している状態になります。
        </SupportAgentBlock>
        {pendingTxs.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {pendingTxs.map(tx => <TxCard key={tx.id} tx={tx} />)}
          </div>
        ): (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/images/icons/scroll.svg" alt="No Pending Transactions" className="w-10 h-10 mb-4"/>
            <p className="text-gray-500">現在、保留中の取引はありません。</p>
          </div>
        )}
      </MiniLayout>
    </main>
  )
}

export default TxPoolPage
