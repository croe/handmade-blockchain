'use client'

import { useAtom } from 'jotai'
import { syncedTxsState, selectedTxsState } from '@/stores/transactions'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {differenceBy} from 'lodash'
import {Transaction} from '@/models/transaction'
import {chainState, selectedBlockState} from '@/stores/chain'
import {useEffect, useState} from 'react'
import {Block} from '@/models/block'

const TxsSelector = () => {
  const [confirmedTxs, setConfirmedTxs] = useState<Transaction[]>([])
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)
  const [txs] = useAtom(syncedTxsState)
  const [chain] = useAtom(chainState)
  const [selectedBlock] = useAtom(selectedBlockState)

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
    if (selectedTxs.length > 2) return
    setSelectedTxs(prev => [...prev, tx])
  }

  const handleDeselectTx = (tx: Transaction) => {
    setSelectedTxs(prev => differenceBy(prev, [tx], 'id'));
  }

  if (!selectedBlock) return <></>


  console.log(confirmedTxs, differenceBy(txs, selectedTxs, 'id'))
  const pendingTxs = differenceBy(differenceBy(txs, selectedTxs, 'id'), confirmedTxs, 'id')
  console.log(pendingTxs)

  return (
    <div className="max-w-screen-sm mx-auto">
      <div>
        <h2 className="font-bold mb-2">Pending Transactions</h2>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto mx-auto p-2 border">
          {pendingTxs.map((tx) => (
            <div key={tx.id} className="border border-black cursor-pointer" onClick={() => handleSelectTx(tx)}>
              <p>{tx.id}</p>
              <img className="w-[200px]" src={getBucketImage(TX_AMOUNT_BUCKET, tx.id, 'png')} alt=""/>
              <p>{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <h2 className="font-bold mb-2">Selected</h2>
        {selectedTxs.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto mx-auto p-2 border">
            {selectedTxs.map((tx) => (
              <div key={tx.id} className="border border-black" onClick={() => handleDeselectTx(tx)}>
                <p>{tx.id}</p>
                <p>{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TxsSelector
