'use client'

import { useAtom } from 'jotai'
import { selectedTxsState } from '@/stores/transactions'
import TxValidationCard from '@/components/TxValidationCard'
import { useEffect, useState } from 'react'
import TxValidationModal from '@/components/Modal/TxValidationModal'
import { TxWithValue } from '@/models/transaction'

const BlockCreationTxsValidation = () => {
  const [openValidation, setOpenValidation] = useState<boolean>(false)
  const [selectedTx, setSelectedTx] = useState<TxWithValue | null>(null)
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)

  useEffect(() => {
    console.log(selectedTxs)
  }, [selectedTxs])

  const handleOpenValidation = (tx: TxWithValue) => {
    setSelectedTx(tx);
    setOpenValidation(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {selectedTxs.map((tx, index) => (
        <div key={tx.id}>
          <div onClick={() => handleOpenValidation(tx)}>
            <TxValidationCard tx={tx} />
          </div>
        </div>
      ))}

      <TxValidationModal
        open={openValidation}
        requestClose={() => setOpenValidation(false)}
        tx={selectedTx}
        setSelectedTxs={setSelectedTxs}
      />
    </div>
  )
}

export default BlockCreationTxsValidation
