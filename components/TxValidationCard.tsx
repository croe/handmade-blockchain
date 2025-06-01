'use client'

import { getBucketImage } from '@/utils/getBucketImage'
import { TX_AMOUNT_BUCKET } from '@/lib/firebase'
import { Transaction } from '@/models/transaction'
import { generateReadableId } from '@/utils/id-to-readable-string'

type Props = {
  tx: Transaction
}

const TxValidationCard = ({tx}:Props) => {
  return (
    <div className="bg-[#DEDEDE] p-1 rounded-2xl shadow w-full text-[#484848]">
      <div className="flex flex-col gap-1.5 border border-[#8C8C8C] p-3 rounded-xl">
        <div className="bg-white rounded border border-[#8C8C8C] overflow-hidden">
          <img className="w-[300px]" src={getBucketImage(TX_AMOUNT_BUCKET, tx.id, 'png')} alt=""/>
        </div>
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
  )
}

export default TxValidationCard
