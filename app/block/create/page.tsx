'use client'

import { useEffect, useRef, useState } from 'react'
import {useAtomValue, useSetAtom} from 'jotai'
import { currentUserState } from '@/stores/users'
import * as fabric from 'fabric'
import { Eraser, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { storage } from '@/lib/firebase'
import { ref, uploadString } from 'firebase/storage'
import {getTxs, makeTx} from '@/api/transaction'
import {txsState} from '@/stores/transactions'
import { Transaction } from '@/models/transaction'
import TxsSelector from '@/components/TxsSelector'
import BlockSelector from '@/components/BlockSelector'
import TxsValidateAndBuildBlock from '@/components/TxsValidateAndBuildBlock'

type Step = 'ready' | 'chain-selected' | 'tx-selected' | 'tx-validated' | 'complete'

const BlockCreatePage = () => {
  const [step, setStep] = useState<Step>('ready')

  /**
   * どのブロックに繋げるか選ぶ
   * どのTxを入れるか選ぶ→一覧からクリックで選択？(最大数3）
   * → 数値を入れる（Txを完成）
   * 報酬Txは自動的に入る
   * ブロックを追加する
   */

  const handleStepChainSelected = () => setStep('chain-selected')
  const handleStepTxSelected = () => setStep('tx-selected')
  const handleStepTxValidated = () => setStep('tx-validated')
  const handleStepCompleted = () => setStep('complete')

  return (
    <div className="w-full h-screen text-black">
      <div className="max-w-screen-sm px-4 mx-auto mb-4">
        <h2>STEP:
          <span className="font-bold"> {step}</span>
        </h2>
      </div>
      {step === 'ready' && (
        <div className="max-w-screen-sm px-4 mx-auto">
          <BlockSelector />
          <button className="mt-10 px-2 py-1 rounded bg-gray-200" onClick={handleStepChainSelected}>Next</button>
        </div>
      )}
      {step === 'chain-selected' && (
        <div className="max-w-screen-sm px-4 mx-auto">
          <TxsSelector />
          <button className="mt-10 px-2 py-1 rounded bg-gray-200" onClick={handleStepTxSelected}>Next</button>
        </div>
      )}
      {step === 'tx-selected' && (
        <div className="max-w-screen-sm px-4 mx-auto">
          <TxsValidateAndBuildBlock />
          <button className="mt-10 px-2 py-1 rounded bg-gray-200" onClick={handleStepTxValidated}>Next</button>
        </div>
      )}
      <p className="mt-10 px-2 py-1 rounded bg-gray-200 text-center w-max mx-auto">
        <Link href={`/`}>HOME</Link>
      </p>
    </div>
  )
}

export default BlockCreatePage
