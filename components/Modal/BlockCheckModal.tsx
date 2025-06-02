'use client'

import BasicModal from '@/components/Modal/BasicModal'
import {Block, TxInBlock} from '@/models/block'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import BasicButton from '@/components/Button/BasicButton'
import {txsState} from '@/stores/transactions'
import {useAtom} from 'jotai'
import {selectedBlockState} from '@/stores/chain'
import { useRouter } from 'next/navigation'

type Props = {
  open?: boolean
  requestClose?: () => void
  block: Block | null
  setSelectedTx: (tx: TxInBlock | null) => void
  requestTxCheckModalOpen: () => void
}

const BlockCheckModal = ({
  open, requestClose, block, setSelectedTx, requestTxCheckModalOpen
}:Props) => {
  const router = useRouter()
  const [txs] = useAtom(txsState)
  const [_, setSelectedBlock] = useAtom(selectedBlockState)

  const handleSelectTx = (tx: TxInBlock) => {
    setSelectedTx(tx);
    requestTxCheckModalOpen();
  }

  const handleSelectBlock = () => {
    if (!block) return;
    setSelectedBlock(block);
    router.push(`/block/create/`);
    requestClose?.();
  }

  return (
    <BasicModal
      title="ブロック詳細"
      icon={<img src="/images/icons/open_block.svg" alt="" className="w-6 h-6"/>}
      open={open}
      requestClose={requestClose}
      buttons={
        <BasicButton onClick={handleSelectBlock}>
          <span>ここから分岐させる</span>
          <img src="/images/icons/mini/white/branch.svg" className="w-5 h-5" alt="check" />
        </BasicButton>
      }
    >
      <div>
        <h2 className="text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs">
          <img src="/images/icons/mini/gray/transaction.svg" className="w-5" alt=""/>
          <span>取引一覧</span>
        </h2>
        {block && (
          <div className="pl-6 pr-1 grid grid-cols-2 gap-1.5">
            {block.txs.map((tx) => (
              <div
                className="relative border border-[#E5E5E5] rounded-lg bg-white"
                key={tx.i}
                onClick={() => handleSelectTx(tx)}
              >
                <div className="overflow-hidden rounded-lg">
                  <img src={txs.find((t) => t.id === tx.i)
                    ? txs.find((t) => t.id === tx.i)?.from === 'reward'
                      ? getBucketImage(TX_AMOUNT_BUCKET, 'reward', 'png')
                      : getBucketImage(TX_AMOUNT_BUCKET, tx.i, 'png')
                    : ""} alt=""/>
                </div>
                <div className="absolute -top-1.5 -right-1.5">
                  <img src="/images/icons/circle_search.svg" alt="" className="w-6 h-6"/>
                </div>
              </div>
            ))}
          </div>
        )}
        <h2 className="mt-6 text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs">
          <img src="/images/icons/mini/gray/info.svg" className="w-5" alt=""/>
          <span>ブロック情報</span>
        </h2>
        {block && (
          <div className="flex flex-col gap-2 px-1 pl-6 pr-1">
            <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
              <span>ID :</span>
              <span>{block?.id}</span>
            </p>
            <p className="border-b border-[#E5E5E5] pb-2 text-xs text-[#999] flex items-start gap-1">
              <span>作成日 :</span>
              <span>{new Date(block?.timestamp).toLocaleString()}</span>
            </p>
            <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
              <span>ブロック高 :</span>
              <span>{block?.blockHeight}</span>
            </p>
            <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
              <span>接続ブロック :</span>
              <span>{block?.prevId}</span>
            </p>
            <p className="border-b border-[#E5E5E5] pt-1 pb-2 text-xs text-[#999] flex items-start gap-1">
              <span>格納されている取引数 :</span>
              <span>{block?.txs.length}</span>
            </p>
          </div>
        )}
      </div>
    </BasicModal>
  )
}

export default BlockCheckModal
