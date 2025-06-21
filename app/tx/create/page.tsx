'use client'

import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { storage } from '@/lib/firebase'
import { ref, uploadString } from 'firebase/storage'
import { getTxs, makeTx } from '@/api/transaction'
import { txsState } from '@/stores/transactions'
import { generateReadableId } from '@/utils/id-to-readable-string'
import { useRouter } from 'next/navigation'
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
  const [loading, setLoading] = useState<boolean>(false)
  const [openReceiverSelector, setOpenReceiverSelector] = useState<boolean>(false)
  const [receiverId, setReceiverId] = useState<string>('')
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const currentUser = useAtomValue(currentUserState)
  const setTxs = useSetAtom(txsState)
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false)

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
          title="取引の作成"
          help={<HelpButton onClick={() => setTutorialOpen(true)}/>}
        />
        <TxCreateTutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        <div className="mx-auto w-max px-5 max-w-[340px] flex flex-col gap-4 pb-40">
          <SupportAgentBlock>
            これより取引の作成を行います。<br />
            取引とは、ウォレット同士のお金のやり取りを記録した契約書のようなものです。<br />
            他者のウォレットへの送金を行いたい場合はこの取引を作成します。<br />
            <br />
            今シーズンには、特殊なウォレットが用意されています。特殊ウォレットへ規定額を送金することでガチャを引く権利が獲得でき、その結果次第でランダムな額のコインを獲得できるチャンスがあります。有効に活用しましょう。<br />
            <br />
            取引を作成するには<br />
            <ul className="list-decimal pl-5">
              <li>以下の手書きエリアに送金金額を手書き文字で記入(読みやすい字を心がけましょう)</li>
              <li>送金先ウォレットを指定</li>
            </ul>
            を行ってください。<br />
            「取引を作成」ボタンを押すと作成が完了します。
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
            <BasicButton onClick={handleOpenReceiverSelector}>
              <span>送る相手を指定</span>
              <img src="/images/icons/mini/white/profile.svg" className="w-5 h-5" alt="reload"/>
            </BasicButton>
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
                <span className="text-base">取引を作成する</span>
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
