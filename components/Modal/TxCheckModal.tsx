'use client'

import BasicModal from '@/components/Modal/BasicModal'
import {useAtom} from 'jotai'
import {usersState} from '@/stores/users'
import {generateReadableId, getAvatarForId} from '@/utils/id-to-readable-string'
import {Block, TxInBlock} from '@/models/block'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {txsState} from '@/stores/transactions'

type Props = {
  open?: boolean
  requestClose?: () => void
  tx?: TxInBlock | null
}

const TxCheckModal = ({open, requestClose, tx }:Props) => {
  const [txs] = useAtom(txsState)
  const fullTx = txs.find(t => t.id === tx?.i) || null;

  return (
    <BasicModal
      title="取引詳細"
      icon={<img src="/images/icons/open_block.svg" alt="" className="w-6 h-6"/>}
      open={open}
      requestClose={requestClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="flex gap-1.5 items-center font-bold text-xs text-[#484848]">
            <img src="/images/icons/coin.svg" alt="" className="w-5 h-5"/>
            <span>取引内容</span>
          </h3>
          {tx && (
            <>
              <div className="pl-8 mt-1.5">
                <img className="w-[300px] border border-[#8C8C8C] rounded-lg" src={
                  fullTx ? fullTx.from === 'reward'
                    ? getBucketImage(TX_AMOUNT_BUCKET, 'reward', 'png')
                    : getBucketImage(TX_AMOUNT_BUCKET, fullTx.id, 'png') : ""
                } alt=""/>
                <p className="flex mt-3 font-bold text-lg items-center justify-between px-3 py-2 border border-[#8C8C8C] rounded-xl">
                  <img src="/images/icons/cnc.svg" alt="" className="w-5 h-5"/>
                  <span>{tx.m.toLocaleString()}</span>
                </p>
              </div>
            </>
          )}
        </div>
        <div>
          <p className="flex gap-1 items-center font-bold text-xs text-[#484848] mb-1.5">
            <img src="/images/icons/hand_arrow_up.svg" alt="pen" className="w-5 h-5"/>
            <span>送金元</span>
          </p>
          <div className="pl-8 mt-1.5">
            <input
              className="w-full bg-white px-2 py-1 border rounded-xl text-sm border-[#E5E5E5]  text-[#484848] max-w-[300px]"
              type="text"
              disabled
              value={fullTx ? generateReadableId(fullTx.from) : ""}
            />
          </div>
        </div>
        <div>
          <p className="flex gap-1 items-center font-bold text-xs text-[#484848] mb-1.5">
            <img src="/images/icons/hand_arrow_down.svg" alt="pen" className="w-5 h-5"/>
            <span>送金先</span>
          </p>
          <div className="pl-8 mt-1.5">
            <input
              className="w-full bg-white px-2 py-1 border rounded-xl border-[#E5E5E5] text-sm text-[#484848] max-w-[300px]"
              type="text"
              disabled
              value={fullTx ? generateReadableId(fullTx.to) : ""}
            />
          </div>
        </div>
      </div>
    </BasicModal>
  )
}

export default TxCheckModal
