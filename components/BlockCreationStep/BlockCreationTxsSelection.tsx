'use client'

import { useAtom } from 'jotai'
import { syncedTxsState, selectedTxsState } from '@/stores/transactions'
import { differenceBy } from 'lodash'
import { Transaction } from '@/models/transaction'
import { chainState, selectedBlockState } from '@/stores/chain'
import { useEffect, useState } from 'react'
import { Block } from '@/models/block'
import TxCard from '@/components/TxCard'
import { toast } from 'react-toastify'
import SupportAgentBlock from '@/components/SupportAgentBlock'

export const BlockCreationTxsSelection = () => {
  const [confirmedTxs, setConfirmedTxs] = useState<Transaction[]>([])
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)
  const [txs] = useAtom(syncedTxsState)
  const [chain] = useAtom(chainState)
  const [selectedBlock] = useAtom(selectedBlockState)

  useEffect(() => {
    setSelectedTxs([]);
  }, [])

  useEffect(() => {
    const chainBlocks = () => {
      if (!selectedBlock) return []
      if (chain.length === 0) return []
      const result: Block[] = []
      const getBlocks = (blockId: string) => {
        const block = chain.find((block) => block.id === blockId)
        if (block) {
          result.push(block)
          if (block.prevId) {
            getBlocks(block.prevId)
          }
        }
      }
      getBlocks(selectedBlock.id)
      return result
    }
    const selectedBlocks = chainBlocks()
    const validatedTxs = selectedBlocks.flatMap((b) => b.txs)
    const fullValidatedTxs: Transaction[] = validatedTxs.flatMap((tx) => {
      const fullTx = txs.find(t => t.id === tx.i)
      return fullTx || []
    })
    setConfirmedTxs(fullValidatedTxs)
  }, [selectedBlock, chain])

  const handleSelectTx = (tx: Transaction) => {
    if (selectedTxs.length > 2) {
      toast.warn('選択できる取引は3つまでです。')
      return
    }
    setSelectedTxs(prev => [...prev, tx])
  }

  const handleDeselectTx = (tx: Transaction) => {
    setSelectedTxs(prev => differenceBy(prev, [tx], 'id'));
  }

  if (!selectedBlock) return <></>


  console.log(confirmedTxs, differenceBy(txs, selectedTxs, 'id'))
  const pendingTxs = differenceBy(txs, confirmedTxs, 'id')
    .filter((tx) => tx.from !== 'reward')
  console.log(pendingTxs)

  return (
    <div>

      <SupportAgentBlock>
        これよりブロックの作成を行います。<br/>
        ブロックとは取引を入れる箱であり、ブロックに格納されて初めて取引は承認され送金が実行されます。まずは以下の未承認取引一覧からあなたがブロックに格納する取引を選んでください。<br />
        このブロックは先ほど選んだチェーンの先端に接続、または選んだブロックから分岐されて接続されます。違う接続先を選び直したい場合は手前のステップに戻ってください。<br />
        次のステップで選んだ取引の検証作業を行っていただきます。
      </SupportAgentBlock>

      {/* 取引リスト */}
      <div className="grid grid-cols-2 gap-2.5">
        {pendingTxs.map((tx) => (
          <div className="relative" key={`tx-${tx.id}`}>
            <TxCard tx={tx} />
            {selectedTxs.includes(tx) ? (
              <button
                className="absolute -top-2 -right-2"
                onClick={() => handleDeselectTx(tx)}
              >
                <img src="/images/icons/circle_check.svg" alt=""/>
              </button>
            ) : (
              <button
                className="absolute -top-2 -right-2"
                onClick={() => handleSelectTx(tx)}
              >
                <img src="/images/icons/circle_none.svg" alt=""/>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


