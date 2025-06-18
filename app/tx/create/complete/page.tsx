'use client'

import { useAtom } from 'jotai'
import { TX_AMOUNT_BUCKET } from '@/lib/firebase'
import { txsState } from '@/stores/transactions'
import { generateReadableId } from '@/utils/id-to-readable-string'
import BottomBar from '@/components/BottomBar'
import BasicButton from '@/components/Button/BasicButton'
import TitleHeader from '@/components/TitleHeader'
import HelpButton from '@/components/Button/HelpButton'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBucketImage } from '@/utils/getBucketImage'

const TxCreateCompletePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const txId = searchParams.get('tx')

  const [txs] = useAtom(txsState)
  const tx = txs.find(t => t.id === txId)

  const handleBackToDashboard = () => router.push('/dashboard')
  const handleCheckTxPool = () => router.push('/tx/pool')

  return (
    <main className="w-full h-screen text-black">
      <TitleHeader
        title="取引作成が完了しました。"
        help={<HelpButton />}
      />
      <div className="mx-auto w-max px-5 max-w-[340px] flex flex-col gap-4">
        {txId && (
          <div className="bg-[#DEDEDE] rounded-2xl p-1 shadow w-full">
            <div className="rounded-xl border border-[#8C8C8C] px-4 py-8 w-full">
              <h2 className="flex gap-1.5 items-center font-bold pb-1.5 border-b border-[#484848] text-[#484848] mb-3">
                <img src="/images/icons/scroll.svg" alt="" className="w-6 h-6"/>
                <span>取引詳細</span>
              </h2>
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="flex gap-1.5 items-center font-bold text-xs text-[#484848]">
                    <img src="/images/icons/coin.svg" alt="" className="w-5 h-5"/>
                    <span>取引内容</span>
                  </h3>
                  <div className="pl-8 mt-1.5">
                    <img className="w-[300px] border border-[#8C8C8C] rounded-lg" src={getBucketImage(TX_AMOUNT_BUCKET, txId, 'png')} alt=""/>
                  </div>
                </div>
                <div>
                  <p className="flex gap-1 items-center font-bold text-xs text-[#484848] mb-1.5">
                    <img src="/images/icons/hand_arrow_up.svg" alt="pen" className="w-5 h-5"/>
                    <span>送金元</span>
                  </p>
                  <div className="pl-8 mt-1.5">
                    <input
                      className="w-full px-2 py-1 border rounded-xl border-[#E5E5E5] bg-[#EEE] text-[#484848] max-w-[300px]"
                      type="text"
                      disabled
                      value={tx ? generateReadableId(tx.from) : ""}
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
                      className="w-full px-2 py-1 border rounded-xl border-[#E5E5E5] bg-[#EEE] text-[#484848] max-w-[300px]"
                      type="text"
                      disabled
                      value={tx ? generateReadableId(tx.to) : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <p className="text-xs text-[#484848] mb-1">作成した取引は現在ブロックへの格納を待機しています</p>
          <BasicButton onClick={handleCheckTxPool}>
            <span className="pr-10">未承認取引一覧を確認する</span>
            <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="reload" />
          </BasicButton>
        </div>
      </div>

      <BottomBar>
        <div className="flex items-center gap-8 justify-center">
          <div className="w-full flex justify-center gap-5 mb-8">
            <div className="relative w-[35px] h-[77px]">
              <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tip_check_tx.svg" alt=""/>
              <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_tx.svg" alt=""/>
            </div>
          </div>
          <BasicButton onClick={handleBackToDashboard}>
            <span className="text-base">トップに戻る</span>
            <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="reload" />
          </BasicButton>
        </div>
      </BottomBar>
    </main>
  )
}

export default TxCreateCompletePage
