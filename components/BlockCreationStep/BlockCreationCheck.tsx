'use client'

import TxValidationCard from '@/components/TxValidationCard'
import {useAtom} from 'jotai/index'
import {selectedBlockState} from '@/stores/chain'
import {selectedTxsState} from '@/stores/transactions'

const REWARD_TX = {
  id: 'reward',
  from: 'system',
  to: 'me',
  amount: 100, // 報酬の金額
  timestamp: Date.now(),
  status: 'completed', // 完了した取引
}

const BlockCreationCheck = () => {
  const [selectedTxs] = useAtom(selectedTxsState)
  const [selectedBlock] = useAtom(selectedBlockState)

  return (
    <div>
      <h2 className="text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs border-t border-[#E5E5E5]">
        <img src="/images/icons/mini/gray/transaction.svg" className="w-5" alt=""/>
        <span>選択した取引一覧</span>
      </h2>
      <div className="flex flex-col gap-4">
        {selectedTxs.map(tx => (
          <TxValidationCard key={tx.id} tx={tx} showValidation={false} />
        ))}
      </div>
      <h2 className="mt-6 text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs border-t border-[#E5E5E5]">
        <img src="/images/icons/mini/gray/transaction.svg" className="w-5" alt=""/>
        <span>ブロック作成報酬取引</span>
      </h2>
      <div className="flex flex-col gap-4">
        <TxValidationCard tx={REWARD_TX} showValidation={false} />
      </div>
      <h2 className="mt-6 text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs border-t border-[#E5E5E5]">
        <img src="/images/icons/mini/gray/info.svg" className="w-5" alt=""/>
        <span>接続ブロック情報</span>
      </h2>
      {selectedBlock && (
        <div className="flex flex-col gap-2 px-1">
          <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
            <span>ID :</span>
            <span>{selectedBlock?.id}</span>
          </p>
          <p className="border-b border-[#E5E5E5] pb-2 text-xs text-[#999] flex items-start gap-1">
            <span>作成日 :</span>
            <span>{new Date(selectedBlock?.timestamp).toLocaleString()}</span>
          </p>
          <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
            <span>ブロック高 :</span>
            <span>{selectedBlock?.blockHeight}</span>
          </p>
          <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
            <span>接続しているブロックID :</span>
            <span>{selectedBlock?.prevId}</span>
          </p>
          <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
            <span>格納されている取引数 :</span>
            <span>{selectedBlock?.txs.length}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default BlockCreationCheck
