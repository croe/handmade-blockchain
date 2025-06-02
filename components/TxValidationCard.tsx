'use client'

import { getBucketImage } from '@/utils/getBucketImage'
import { TX_AMOUNT_BUCKET } from '@/lib/firebase'
import { TxWithValue } from '@/models/transaction'
import { generateReadableId } from '@/utils/id-to-readable-string'

type Props = {
  tx: TxWithValue
  setTxs?: (txs: TxWithValue[]) => void
}

const TxValidationCard = ({tx, setTxs}:Props) => {
  return (
    <div className="bg-[#DEDEDE] p-1 rounded-2xl shadow w-full text-[#484848]">
      <div className="flex gap-3 border border-[#8C8C8C] p-3 rounded-xl justify-between items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="min-w-[130px] bg-white rounded border border-[#8C8C8C] overflow-hidden">
            <img className="w-[130px]" src={getBucketImage(TX_AMOUNT_BUCKET, tx.id, 'png')} alt=""/>
          </div>
          <div className="flex flex-col justify-center gap-1.5 w-24">
            <p className="flex text-xs items-center gap-1">
              <img src="/images/icons/hand_arrow_up.svg" alt="" className="w-4 h-4"/>
              <span className="truncate">{generateReadableId(tx.from)}</span>
            </p>
            <p className="flex text-xs items-center gap-1">
              <img src="/images/icons/hand_arrow_down.svg" alt="" className="w-4 h-4"/>
              <span className="truncate">{generateReadableId(tx.to)}</span>
            </p>
          </div>
        </div>
        <div className="text-sm min-w-12 h-full">
          {tx.amount ? (
            <div className="flex flex-col items-center justify-center gap-1">
              <img src="/images/icons/badge_success.svg" alt=""/>
              <p className="text-[#00CFFF] whitespace-pre">完了</p>
            </div>
          ):(
            <div className="flex flex-col items-center justify-center gap-1">
              <img src="/images/icons/badge_error.svg" alt=""/>
              <p className="text-[#FF6631] whitespace-pre">未検証</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TxValidationCard
