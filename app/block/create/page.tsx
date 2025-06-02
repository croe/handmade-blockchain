'use client'

import { useState } from 'react'
import TxsSelector from '@/components/TxsSelector'
import TxsValidateAndBuildBlock from '@/components/TxsValidateAndBuildBlock'
import TitleHeader from '@/components/TitleHeader'
import BottomBar from '@/components/BottomBar'
import BasicButton from '@/components/Button/BasicButton'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'
import { useAtom } from 'jotai/index'
import { selectedTxsState } from '@/stores/transactions'
import { toast } from 'react-toastify'
import TxValidationCard from '@/components/TxValidationCard'
import {selectedBlockState} from '@/stores/chain'

type Step = 'chain-selected' | 'tx-selected' | 'tx-validated' | 'complete'

type StepInfo = {
  title: string
  subtitle: string
  stepNumber: number
  totalSteps: number
  buttonText: string
  canGoBack: boolean
}

const STEP_INFO: Record<Step, StepInfo> = {
  'chain-selected': {
    title: 'ブロックに入れる取引の選択',
    subtitle: 'ブロックの作成 STEP 1/4',
    stepNumber: 1,
    totalSteps: 4,
    buttonText: '取引内容の検証へ',
    canGoBack: false
  },
  'tx-selected': {
    title: '取引内容の検証',
    subtitle: 'ブロックの作成 STEP 2/4',
    stepNumber: 2,
    totalSteps: 4,
    buttonText: '内容確認へ',
    canGoBack: true
  },
  'tx-validated': {
    title: '内容確認',
    subtitle: 'ブロックの作成 STEP 3/4',
    stepNumber: 3,
    totalSteps: 4,
    buttonText: 'ブロックを作成する',
    canGoBack: true
  },
  'complete': {
    title: 'ブロック作成が完了しました',
    subtitle: 'ブロックの作成 STEP 4/4',
    stepNumber: 4,
    totalSteps: 4,
    buttonText: 'トップに戻る',
    canGoBack: false
  }
}

const REWARD_TX = {
  id: 'reward',
  from: 'system',
  to: 'me',
  amount: 100, // 報酬の金額
  timestamp: Date.now(),
  status: 'completed', // 完了した取引
}

const BlockCreatePage = () => {
  const [step, setStep] = useState<Step>('chain-selected')
  const [selectedTxs] = useAtom(selectedTxsState)
  const [selectedBlock] = useAtom(selectedBlockState)

  /**
   * どのブロックに繋げるか選ぶ
   * どのTxを入れるか選ぶ→一覧からクリックで選択？(最大数3）
   * → 数値を入れる（Txを完成）
   * 報酬Txは自動的に入る
   * ブロックを追加する
   */

  const handleNextStep = () => {
    switch (step) {
      case 'chain-selected':
        if (selectedTxs.length === 0) {
          toast.error('ブロックに入れる取引は1つ以上選択してください')
          return
        }
        setStep('tx-selected')
        break
      case 'tx-selected':
        const hasAllAmounts = selectedTxs.every(tx => typeof tx.amount === 'number' && tx.amount > 0)
        if (!hasAllAmounts) {
          toast.error('すべての取引の検証を完了してください')
          return
        }
        setStep('tx-validated')
        break
      case 'tx-validated':
        setStep('complete')
        break
      default:
        break
    }
  }

  const handleBackStep = () => {
    switch (step) {
      case 'tx-selected':
        setStep('chain-selected')
        break
      case 'tx-validated':
        setStep('tx-selected')
        break
      default:
        break
    }
  }

  const currentStepInfo = STEP_INFO[step]

  return (
    <main className="w-full min-h-screen">
      <TitleHeader
        title={currentStepInfo.title}
        subtitle={currentStepInfo.subtitle}
        help={<HelpButton />}
      />
      <MiniLayout>
        {step === 'chain-selected' && (
          <div className="pb-36">
            <TxsSelector />
          </div>
        )}
        {step === 'tx-selected' && (
          <div>
            <TxsValidateAndBuildBlock />
          </div>
        )}
        {step === 'tx-validated' && (
          <div>
            <h2 className="text-[#999] font-bold flex items-center gap-1 pt-2 pb-2.5 text-xs border-t border-[#E5E5E5]">
              <img src="/images/icons/mini/gray/transaction.svg" className="w-5" alt=""/>
              <span>選択した取引一覧</span>
            </h2>
            <div className="flex flex-col gap-4">
              {selectedTxs.map(tx => (
                <TxValidationCard tx={tx} showValidation={false} />
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
        )}
        {step === 'complete' && (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/images/icons/block_complete.svg" alt="Block Complete" className="w-24 h-24 mb-4"/>
            <h2 className="text-2xl font-bold">ブロックの作成が完了しました！</h2>
            <p className="text-gray-600 mt-2">新しいブロックがチェーンに追加されました。</p>
          </div>
        )}
      </MiniLayout>

      <BottomBar>
        <div className="flex items-center gap-8 justify-center">
          {step === 'chain-selected' && (
            <div className="w-full flex justify-center gap-5 mb-8">
              <div className="relative w-[45px] h-[77px]">
                <img className="absolute bottom-0 left-0 w-[45px]" src="/images/icons/openblock_1.svg" alt=""/>
                <img className="absolute top-0 left-1.5 w-[34px] h-[40px]" src="/images/icons/tip_draft_block.svg" alt=""/>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            {currentStepInfo.canGoBack && (
              <BasicButton onClick={handleBackStep} className="bg-gray-500 min-w-5">
                <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5 rotate-180" alt="back"/>
              </BasicButton>
            )}
            {step !== 'complete' && (
              <BasicButton onClick={handleNextStep}>
                <span className="text-base">{currentStepInfo.buttonText}</span>
                <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="next"/>
              </BasicButton>
            )}
          </div>
        </div>
      </BottomBar>
    </main>
  )
}

export default BlockCreatePage
