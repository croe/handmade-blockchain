'use client'

import BasicModal from '@/components/Modal/BasicModal'
import { useAtom } from 'jotai'
import {
  selectedChainUserBalanceState,
  selectedChainUserTxsState,
  walletCheckUserIdState
} from '@/stores/transactions'
import { generateReadableId, getAvatarForId } from '@/utils/id-to-readable-string'
import { useEffect } from 'react'
import TxViewer from '@/components/TxViewer'

type Props = {
  open?: boolean
  requestClose?: () => void
  userId?: string // 確認したいユーザーのID
}

const WalletCheckModal = ({open, requestClose, userId}:Props) => {
  const [, setWalletCheckUserId] = useAtom(walletCheckUserIdState)
  const [userBalance] = useAtom(selectedChainUserBalanceState)
  const [userTxs] = useAtom(selectedChainUserTxsState)

  // userIdが変更されたときにストアを更新
  useEffect(() => {
    setWalletCheckUserId(userId || null)
  }, [userId, setWalletCheckUserId])

  // モーダルが閉じられるときにユーザーIDをクリア
  useEffect(() => {
    if (!open) {
      setWalletCheckUserId(null)
    }
  }, [open, setWalletCheckUserId])

  if (!userId) {
    return (
      <BasicModal
        title="ウォレットチェック"
        icon={<img src="/images/icons/wallet.svg" alt="" className="w-6 h-6"/>}
        open={open}
        requestClose={requestClose}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#484848]">
            ユーザーが選択されていません。
          </p>
        </div>
      </BasicModal>
    )
  }

  return (
    <BasicModal
      title="ウォレットチェック"
      icon={<img src="/images/icons/mini/gray/bank.svg" alt="" className="w-6 h-6"/>}
      open={open}
      requestClose={requestClose}
    >
      <div className="flex flex-col gap-4">
        {/* ユーザープロフィール */}
        <div className="flex gap-2.5 pb-4 border-b border-[#E5E5E5]">
          <div className="flex flex-col items-center justify-center">
            <img className="w-8 h-8" src={getAvatarForId(userId)} alt=""/>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-bold">{generateReadableId(userId)}</h2>
            <p className="text-xs text-[#73683A]">ComoNeCoin</p>
          </div>
        </div>

        {/* バランス表示 */}
        <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-3xl bg-white px-4 py-3 justify-between">
          <img className="h-6" src="/images/icons/cnc.svg" alt=""/>
          <span className="text-2xl text-[#3d3d3d] font-black">{userBalance.toLocaleString()}</span>
        </div>

        {/* 取引履歴 */}
        <div>
          <h3 className="text-sm font-bold text-[#484848] mb-2">
            選択中のチェーンでの取引履歴
          </h3>
          <div className="max-h-64 overflow-y-auto">
            {userTxs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {userTxs.map((tx, i) => (
                  <TxViewer key={i} tx={tx} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#999] text-center py-4">
                選択中のチェーンで取引履歴がありません。
              </p>
            )}
          </div>
        </div>
      </div>
    </BasicModal>
  )
}

export default WalletCheckModal
