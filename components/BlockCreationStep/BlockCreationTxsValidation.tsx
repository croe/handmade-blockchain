'use client'

import { useAtom } from 'jotai'
import { selectedTxsState } from '@/stores/transactions'
import TxValidationCard from '@/components/TxValidationCard'
import { useEffect, useState } from 'react'
import TxValidationModal from '@/components/Modal/TxValidationModal'
import WalletCheckModal from '@/components/Modal/WalletCheckModal'
import { TxWithValue } from '@/models/transaction'
import SupportAgentBlock from '@/components/SupportAgentBlock'

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
      <SupportAgentBlock>
        ここでは先ほど選んだ未承認取引の内容を検証します。<br />
        未検証と表示されている取引をタップして詳細を表示してください。<br />
        手書きで書かれた送金金額をもとに正しい数値を入力してください。<br />
        もしこの取引に不備があると判断した場合は検証を実行せず手前のステップに戻り不備のある取引の選択を取りやめることも可能です。<br />
        一度ブロックに格納され承認された取引を、未承認に差し戻すことはできません。慎重に判断しましょう。<br />
        次のステップでは、ブロック作成を確定し報酬の受け取り手続きを行っていただきます。
      </SupportAgentBlock>
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
