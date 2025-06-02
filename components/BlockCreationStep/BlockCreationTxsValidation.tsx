'use client'

import { useAtom } from 'jotai'
import { selectedTxsState } from '@/stores/transactions'
import TxValidationCard from '@/components/TxValidationCard'
import { useEffect, useState } from 'react'
import TxValidationModal from '@/components/Modal/TxValidationModal'
import WalletCheckModal from '@/components/Modal/WalletCheckModal'
import { TxWithValue } from '@/models/transaction'

const BlockCreationTxsValidation = () => {
  const [openValidation, setOpenValidation] = useState<boolean>(false)
  const [openWalletCheck, setOpenWalletCheck] = useState<boolean>(false)
  const [selectedTx, setSelectedTx] = useState<TxWithValue | null>(null)
  const [walletCheckUserId, setWalletCheckUserId] = useState<string | null>(null)
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)

  useEffect(() => {
    console.log(selectedTxs)
  }, [selectedTxs])

  const handleOpenValidation = (tx: TxWithValue) => {
    setSelectedTx(tx);
    setOpenValidation(true);
  }

  const handleWalletCheck = (userId: string) => {
    setWalletCheckUserId(userId)
    setOpenWalletCheck(true)
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
        onWalletCheck={handleWalletCheck}
      />

      <WalletCheckModal
        open={openWalletCheck}
        requestClose={() => setOpenWalletCheck(false)}
        userId={walletCheckUserId || undefined}
      />
    </div>
  )
}

export default BlockCreationTxsValidation
