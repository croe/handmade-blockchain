'use client'

import { type TxWithBlock } from '@/models/transaction'
import { useAtom} from 'jotai'
import { currentUserState } from '@/stores/users'
import BasicButton from '@/components/Button/BasicButton'
import { generateReadableId } from '@/utils/id-to-readable-string'

type Props = {
  tx: TxWithBlock
}

const WarnTx = () => (
  <p className='flex gap-1 items-center text-xs text-[#F4C11C]'>
    <img src='/images/icons/badge_warn.svg' alt=""/>
    <span>未承認の取引</span>
  </p>
)

const SuccessTx = () => (
  <p className='flex gap-1 items-center text-xs text-[#00CFFF]'>
    <img src='/images/icons/badge_success.svg' alt=""/>
    <span>承認された取引</span>
  </p>
)

const IncreaseBalance = ({amount}:{amount: number}) => (
  <p className='text-xl font-bold text-[#0DDA1E] flex gap-1 items-center'>
    <span>+{amount.toLocaleString()}</span>
    <img src='/images/icons/cnc.svg' alt="" className="h-4"/>
  </p>
)

const DecreaseBalance = ({amount}:{amount: number}) => (
  <p className='text-xl font-bold text-[#FF6631] flex gap-1 items-center'>
    <span>-{amount.toLocaleString()}</span>
    <img src='/images/icons/cnc.svg' alt="" className="h-4"/>
  </p>
)

const getTxUser = (userId: string, meId: string) => {
  if (userId === 'reward') return 'System'
  return userId === meId ? 'Me' : generateReadableId(userId)
}


const TxViewer = ({tx}:Props) => {
  const [currentUser] = useAtom(currentUserState)
  const isIncrease = (tx.block && tx.amount && tx.amount > 0) ? tx.to === currentUser?.id : false
  const isApproved = !!tx.block

  return (
    <div className="bg-white p-1 rounded-2xl shadow">
      <details className="relative group border border-[#E5E5E5] rounded-xl p-4">
        <summary
          className="list-none flex items-center justify-between h-5"
        >
          {isApproved ? <SuccessTx /> : <WarnTx />}
          {tx.amount && tx.amount > 0 && (
            <>
              {isIncrease ? <IncreaseBalance amount={tx.amount} /> : <DecreaseBalance amount={tx.amount} />}
            </>
          )}
          <img src="/images/icons/details_open.svg" alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 transform group-open:hidden"/>
        </summary>
        <div className="flex flex-col gap-2 text-xs text-[#666] mt-2 pb-2">
          <p className="flex gap-1 text-[#484848]">
            <span>from</span>
            <span className="text-[#3842FF]">{currentUser && getTxUser(tx.from, currentUser.id)}</span>
          </p>
          <p className="flex gap-1 text-[#484848]">
            <span>to</span>
            <span className="text-[#3842FF]">{currentUser && getTxUser(tx.to, currentUser.id)}</span>
          </p>
          <p>{tx.from === 'reward' ? 'ブロック作成報酬' : '手動で作成された取引'}</p>
          <p className="flex gap-1">
            <span>作成日時 :</span>
            <span>{new Date(tx.timestamp).toLocaleString()}</span>
          </p>
          {tx.block && (
            <p className="flex gap-1">
              <span>承認日時 :</span>
              <span>{new Date(tx.timestamp).toLocaleString()}</span>
            </p>
          )}
          {tx.block && (
            <BasicButton>
              <span>取引のブロックを確認する</span>
              <img src="/images/icons/double_arrow_white.svg" alt="" className="w-4 h-4"/>
            </BasicButton>
          )}
          <img src="/images/icons/details_close.svg" alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 transform"/>
        </div>
      </details>
    </div>
  )
}

export default TxViewer
