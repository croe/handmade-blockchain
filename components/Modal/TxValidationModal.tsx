'use client'

import BasicModal from '@/components/Modal/BasicModal'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {generateReadableId} from '@/utils/id-to-readable-string'
import {TxWithValue} from '@/models/transaction'
import BasicButton from '@/components/Button/BasicButton'
import { useState, useEffect } from 'react'
import { WritableAtom } from 'jotai'

type Props = {
  open?: boolean
  requestClose?: () => void
  tx: TxWithValue | null
  setSelectedTxs: (update: TxWithValue[] | ((prev: TxWithValue[]) => TxWithValue[])) => void
  onWalletCheck?: (userId: string) => void
}

const TxValidationModal = ({open, requestClose, tx, setSelectedTxs, onWalletCheck}:Props) => {
  const [amount, setAmount] = useState<number>(0)
  const [displayValue, setDisplayValue] = useState<string>('0')

  useEffect(() => {
    // txが変更されたときにamountとdisplayValueを更新
    const newAmount = tx?.amount || 0
    setAmount(newAmount)
    setDisplayValue(newAmount.toString())
  }, [tx])

  // 数値のみの入力を許可するバリデーション関数
  const validateAndParseNumber = (value: string): { parsedValue: number; displayValue: string } => {
    // 数値以外の文字を除去（空文字、数字のみ許可）
    const numericOnly = value.replace(/[^0-9]/g, '')
    
    // 空文字の場合は0として扱う
    if (numericOnly === '') {
      return { parsedValue: 0, displayValue: '0' }
    }
    
    // 先頭の0を除去（ただし'0'単体は除く）
    const cleanedValue = numericOnly.replace(/^0+/, '') || '0'
    
    // 数値にパース
    const parsedValue = parseInt(cleanedValue, 10)
    
    // NaNの場合は0として扱う（念のため）
    if (isNaN(parsedValue)) {
      return { parsedValue: 0, displayValue: '0' }
    }
    
    return { parsedValue, displayValue: cleanedValue }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const { parsedValue, displayValue } = validateAndParseNumber(inputValue)
    
    setAmount(parsedValue)
    setDisplayValue(displayValue)
  }

  const handleCompleteValidation = () => {
    if (tx) {
      setSelectedTxs(prevTxs =>
        prevTxs.map(prevTx =>
          prevTx.id === tx.id
            ? { ...prevTx, amount }
            : prevTx
        )
      )
    }

    if (requestClose) {
      requestClose()
    }
  }

  return (
    <BasicModal
      title="取引内容の検証"
      icon={<img src="/images/icons/coin.svg" alt="" className="w-6 h-6"/>}
      open={open}
      requestClose={requestClose}
      buttons={
        <BasicButton onClick={handleCompleteValidation}>
          <span>検証を完了する</span>
          <img src="/images/icons/mini/white/check.svg" className="w-5 h-5" alt="check" />
        </BasicButton>
      }
    >
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="flex gap-1.5 items-center font-bold text-xs text-[#484848]">
            <img src="/images/icons/coin.svg" alt="" className="w-5 h-5"/>
            <span>取引内容</span>
          </h3>
          {tx && (
            <div className="pl-8 mt-1.5">
              <img className="w-[300px] border border-[#8C8C8C] rounded-lg" src={getBucketImage(TX_AMOUNT_BUCKET, tx.id, 'png')} alt=""/>
            </div>
          )}
          <div className="relative pl-8 mt-1.5">
            <input
              placeholder="ここに取引する数値を入力"
              type="text"
              value={displayValue}
              onChange={handleAmountChange}
              className="w-full py-2 px-2.5 pr-10 border border-[#8C8C8C] rounded-2xl placeholder:text-xs"
            />
            <img
              src="/images/icons/mini/gray/pen.svg" alt="edit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="flex gap-1 items-center font-bold text-xs text-[#484848] mb-1.5">
            <img src="/images/icons/hand_arrow_up.svg" alt="pen" className="w-5 h-5"/>
            <span>送金元</span>
          </p>
          <div className="pl-8 mt-1.5 flex flex-col gap-1 items-start">
            <input
              className="w-full px-2 py-1 border rounded-xl border-[#E5E5E5] bg-[#EEE] text-[#484848] max-w-[300px]"
              type="text"
              disabled
              value={tx ? generateReadableId(tx.from) : ""}
            />
            {tx && (
              <button
                onClick={() => {
                  if (onWalletCheck && tx.from) {
                    onWalletCheck(tx.from)
                  }
                }}
                className="w-full px-2 py-2 bg-[#4CAF50] text-white text-sm rounded-xl flex items-center justify-center"
              >
                <img src="/images/icons/mini/white/book.svg" alt="wallet" className="w-5 h-5"/>
                <span>ウォレットの内容を確認する</span>
              </button>
            )}
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
    </BasicModal>
  )
}

export default TxValidationModal
