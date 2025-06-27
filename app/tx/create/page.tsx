'use client'

import { useState, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { storage } from '@/lib/firebase'
import { ref, uploadString } from 'firebase/storage'
import { getTxs, makeTx } from '@/api/transaction'
import { txsState } from '@/stores/transactions'
import { generateReadableId } from '@/utils/id-to-readable-string'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'
import * as fabric from 'fabric'
import BottomBar from '@/components/BottomBar'
import BasicButton from '@/components/Button/BasicButton'
import TitleHeader from '@/components/TitleHeader'
import HelpButton from '@/components/Button/HelpButton'
import CheckSignMaker from '@/components/CheckSignMaker'
import ReceiverSelectionModal from '@/components/Modal/ReceiverSelectionModal'
import ExhibitionModeRestriction from '@/components/ExhibitionModeRestriction'
import { TxCreateTutorialModal } from '@/components/Modal/Tutorial/TxCreateTutorialModal'
import SupportAgentBlock from '@/components/SupportAgentBlock'

const TxCreatePage = () => {
  // FIXME: 手数料を入れないと無限に作られてしまう問題？（ミスったら入れられないからいいか）
  // 意外と👆の問題が根深そう、っていうか作るもの多いな...
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [openReceiverSelector, setOpenReceiverSelector] = useState<boolean>(false)
  const [receiverId, setReceiverId] = useState<string>('')
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const currentUser = useAtomValue(currentUserState)
  const setTxs = useSetAtom(txsState)
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false)

  // Check if this is a gacha transaction
  const isGachaMode = searchParams.get('gacha') === 'true'

  // Fixed gacha wallet ID
  const GACHA_WALLET_ID = 'gacha_wallet_special_2024'

  useEffect(() => {
    if (isGachaMode) {
      setReceiverId(GACHA_WALLET_ID)
    }
  }, [isGachaMode])

  const handleOpenReceiverSelector = () => setOpenReceiverSelector(true)

  const handleSave = async () => {
    try {
      if (loading) {
        toast.info('処理中です。しばらくお待ちください。')
        throw new Error('処理中です。しばらくお待ちください。')
      }
      if (receiverId === '') {
        toast.error('送金先を指定してください')
        throw new Error('送金先を指定してください')
      }
      if (!currentUser) {
        toast.error('ユーザー情報が取得できません')
        throw new Error('ユーザー情報が取得できません')
      }
      if (!canvas) {
        toast.error('キャンバスが初期化されていません')
        throw new Error('キャンバスが初期化されていません')
      }
      // 取引の作成中はローディング状態にする
      setLoading(true)
      // 取引の作成
      const tx = await makeTx(currentUser.id, currentUser.id, receiverId)
      if (!tx) {
        toast.error('取引の作成に失敗しました')
        throw new Error('取引の作成に失敗しました')
      }
      // 取引の画像をアップロード
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.5,
        multiplier: 2,
      })
      const storageRef = ref(storage, `tx_amounts/${tx.key}.png`)
      uploadString(storageRef, dataUrl, 'data_url').then((snapshot) => {
        console.log('Uploaded a base64 string!')
      }).catch((error) => {
        console.error(error)
        setLoading(false)
        return
      })
      // 取引の更新
      const myTxs = await getTxs(currentUser.id)
      if (myTxs) {
        setTxs(myTxs.flatMap(e => e != null ? e : []))
      }
      setLoading(false)
      // 取引完了画面へ遷移
      router.push(`/tx/create/complete?tx=${tx.key}`)
    } catch (error) {
      console.error('Error in handleSave:', error)
      setLoading(false)
      return
    }
  }

  return (
    <ExhibitionModeRestriction feature="transaction-creation">
      <main className="w-full h-screen text-black">
        <TitleHeader
          title={isGachaMode ? "ガチャ取引の作成" : "取引の作成"}
          help={<HelpButton onClick={() => setTutorialOpen(true)}/>}
        />
        <TxCreateTutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        <div className="mx-auto w-max px-5 max-w-[340px] flex flex-col gap-4 pb-40">
          <SupportAgentBlock>
            {isGachaMode ? (
              <>
                🎲 ガチャ取引の作成を行います！<br />
                送金先は特殊ガチャウォレットに自動設定されています。<br />
                <br />
                ガチャシステムの説明：<br />
                • 送金の取引を作成するとガチャが実行されます（何コインでも可）<br />
                • ガチャシステムからの取引が発行されるまでには<b>最大1時間程度</b>かかります<br />
                • 送金額に応じてガチャの当選確率が変動します<br />
                • 当選すると送金額の<b>2～10倍のコイン取引</b>がランダムで返ってきます<br />
                <br />
                ガチャを実行するには：<br />
                <ul className="list-decimal pl-5">
                  <li>以下の手書きエリアに送金したい金額を記入</li>
                  <li>「取引を作成」ボタンを押してガチャを実行</li>
                </ul>
                運試しをお楽しみください！🍀
              </>
            ) : (
              <>
                これより取引の作成を行います。<br />
                取引とは、ウォレット同士のお金のやり取りを記録した契約書のようなものです。<br />
                他者のウォレットへの送金を行いたい場合はこの取引を作成します。<br />
                <br />
                取引を作成するには<br />
                <ul className="list-decimal pl-5">
                  <li>以下の手書きエリアに送金金額を手書き文字で記入(読みやすい字を心がけましょう)</li>
                  <li>送金先ウォレットを指定</li>
                </ul>
                を行ってください。<br />
                「取引を作成」ボタンを押すと作成が完了します。
              </>
            )}
          </SupportAgentBlock>
          <CheckSignMaker canvas={canvas} setCanvas={setCanvas}/>
          <div>
            <p className="flex gap-1 text-[#999] items-center text-xs mb-1.5">
              <img src="/images/icons/mini/gray/send.svg" alt="pen" className="w-5 h-5"/>
              <span>送金元（自動入力）</span>
            </p>
            <input
              className="w-full px-2 py-1 border rounded-xl border-[#E5E5E5] bg-[#EEE] text-[#484848] max-w-[300px]"
              type="text"
              disabled
              value={currentUser ? generateReadableId(currentUser.id) : ''}
            />
          </div>
          <div>
            <p className="flex gap-1 text-[#999] items-center text-xs mb-1.5">
              <img src="/images/icons/mini/gray/receive.svg" alt="pen" className="w-5 h-5"/>
              <span>送金先</span>
            </p>
            <input
              className="w-full px-2 py-1 border rounded-xl border-[#E5E5E5] bg-[#EEE] text-[#484848] mb-2 max-w-[300px]"
              type="text"
              disabled
              value={receiverId ? generateReadableId(receiverId) : ''}
            />
            {!isGachaMode && (
              <BasicButton onClick={handleOpenReceiverSelector}>
                <span>送る相手を指定</span>
                <img src="/images/icons/mini/white/profile.svg" className="w-5 h-5" alt="reload"/>
              </BasicButton>
            )}
            {isGachaMode && (
              <div className="text-xs text-[#999] mt-1">
                ガチャモードでは送金先が自動設定されています
              </div>
            )}
          </div>
        </div>

        <ReceiverSelectionModal
          open={openReceiverSelector}
          requestClose={() => setOpenReceiverSelector(false)}
          setReceiverId={setReceiverId}
        />

        <BottomBar>
          <div className="flex items-center gap-8 justify-center">
            <div className="w-full flex justify-center gap-5 mb-8">
              <div className="relative w-[35px] h-[77px]">
                <img className="absolute top-0 left-0 w-[34px] h-[40px]" src="/images/icons/tip_draft_tx.svg" alt=""/>
                <img className="absolute bottom-0 left-0 w-[35px] h-[40px]" src="/images/icons/box_tx.svg" alt=""/>
              </div>
            </div>
            <BasicButton onClick={handleSave}>
              {loading ? (
                <Loader className="animate-spin"/>
              ) : (
                <span className="text-base">
                  {isGachaMode ? "ガチャを実行する" : "取引を作成する"}
                </span>
              )}
              <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="reload"/>
            </BasicButton>
          </div>
        </BottomBar>
      </main>
    </ExhibitionModeRestriction>
  )
}

export default TxCreatePage
