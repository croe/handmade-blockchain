'use client'

import { useState } from 'react'
import TitleHeader from '@/components/TitleHeader'
import BottomBar from '@/components/BottomBar'
import BasicButton from '@/components/Button/BasicButton'
import BackCircleButton from '@/components/Button/BackCircleButton'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'
import { useAtom, useSetAtom } from 'jotai/index'
import { txsState, selectedTxsState } from '@/stores/transactions'
import { chainState, selectedBlockState } from '@/stores/chain'
import { currentUserState } from '@/stores/users'
import { toast } from 'react-toastify'
import { TxInBlock } from '@/models/block'
import { getTx, makeTx } from '@/api/transaction'
import BlockCreationTxsSelection from '@/components/BlockCreationStep/BlockCreationTxsSelection'
import BlockCreationTxsValidation from '@/components/BlockCreationStep/BlockCreationTxsValidation'
import BlockCreationCheck from '@/components/BlockCreationStep/BlockCreationCheck'
import BlockCreationComplete from '@/components/BlockCreationStep/BlockCreationComplete'
import BlockCreationError from '@/components/BlockCreationStep/BlockCreationError'
import { concat } from 'lodash'
import {buildBlock, getBlock} from '@/api/block'
import { Loader } from 'lucide-react'
import { useBlockCreation } from '@/hooks/useBlockCreation'

type Step = 'chain-selected' | 'tx-selected' | 'tx-validated' | 'complete' | 'error'

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
  },
  'error': {
    title: 'エラーが発生しました',
    subtitle: 'ブロックの作成',
    stepNumber: 0,
    totalSteps: 4,
    buttonText: '最初からやり直す',
    canGoBack: false
  }
}

const BlockCreatePage = () => {
  const { saveBlockCreationTime,canCreateBlock } = useBlockCreation()
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<Step>('chain-selected')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const setTxs = useSetAtom(txsState)
  const setChain = useSetAtom(chainState)
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)
  const [currentUser] = useAtom(currentUserState)
  const [selectedBlock, setSelectedBlock] = useAtom(selectedBlockState)

  /**
   * どのブロックに繋げるか選ぶ
   * どのTxを入れるか選ぶ→一覧からクリックで選択？(最大数3）
   * → 数値を入れる（Txを完成）
   * 報酬Txは自動的に入る
   * ブロックを追加する
   */

  const handleCreateBlock = async () => {
    try {
      if (!currentUser) throw new Error('ユーザー情報が取得できません')
      if (!selectedBlock) throw new Error('ブロックが選択されていません')
      if (!selectedTxs) throw new Error('取引が選択されていません')
      if (!canCreateBlock()) throw new Error('ブロック作成可能時間ではありません')
      setLoading(true)
      // ブロック作成のためのデータを準備
      const txs = selectedTxs.map(tx => ({
        i: tx.id,
        m: tx.amount || 0, // amountが未設定の場合は0を使用
      }))
      // FIXME: 同期タイミングを考える必要がありそう
      const txKey = await makeTx(currentUser.id, 'reward', currentUser.id);
      if (!txKey?.key) throw new Error('報酬取引の作成に失敗しました')
      const systemTx: TxInBlock = {
        i: txKey.key,
        m: 100,
      }
      const systemTxFromDB = await getTx(currentUser.id, txKey.key)
      if (systemTxFromDB) {
        setTxs(prev => concat(prev, [systemTxFromDB]).flatMap(e => e != null ? e : []))
      }
      const blockKey = await buildBlock(
        currentUser.id,
        selectedBlock.id,
        concat(txs, [systemTx]),
        selectedBlock.blockHeight + 1
      )
      if (!blockKey?.key) throw new Error('ブロックの作成に失敗しました')
      // FIXME: ここがなんか変
      saveBlockCreationTime()
      const newBlockFromDB = await getBlock(currentUser.id, blockKey.key)
      console.log(newBlockFromDB)
      if (newBlockFromDB) {
        setChain(prev => concat(prev, [newBlockFromDB]).flatMap(e => e != null ? e : []))
      }

      /**
       * Reset
       */
      setSelectedBlock(null)
      setSelectedTxs([])
      setLoading(false)

    } catch (error) {
      console.error('Error in handleCreateBlock:', error)
      setErrorMessage(error instanceof Error ? error.message : 'ブロックの作成に失敗しました')
      setStep('error')
      setLoading(false)
      return
    }
  }

  const handleNextStep = async () => {
    if (loading) {
      toast.info('処理中です。しばらくお待ちください。')
      return
    }
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
        await handleCreateBlock()
        setStep('complete')
        break
      case 'error':
        setStep('chain-selected')
        setErrorMessage('')
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
    <main className="w-full min-h-screen pb-36">
      <TitleHeader
        title={currentStepInfo.title}
        subtitle={currentStepInfo.subtitle}
        help={<HelpButton />}
      />
      <MiniLayout>
        {step === 'chain-selected' && <BlockCreationTxsSelection />}
        {step === 'tx-selected' && <BlockCreationTxsValidation />}
        {step === 'tx-validated' && <BlockCreationCheck />}
        {step === 'complete' && <BlockCreationComplete/>}
        {step === 'error' && <BlockCreationError error={errorMessage} />}
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
            {currentStepInfo.canGoBack && <BackCircleButton onClick={handleBackStep} />}
            {step !== 'complete' && (
              <BasicButton onClick={handleNextStep}>
                {loading ? (
                  <div className="animate-spin">
                    <Loader />
                  </div>
                ):(
                  <>
                    <span className="text-base">{currentStepInfo.buttonText}</span>
                    <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="next"/>
                  </>
                )}
              </BasicButton>
            )}
          </div>
        </div>
      </BottomBar>
    </main>
  )
}

export default BlockCreatePage
