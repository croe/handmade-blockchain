'use client'

import {type TxWithBlock} from '@/models/transaction'
import {useAtom} from 'jotai'
import {currentUserState} from '@/stores/users'
import BasicButton from '@/components/Button/BasicButton'

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


const TxViewer = ({tx}:Props) => {
  const [currentUser] = useAtom(currentUserState)
  const isIncrease = (tx.block && tx.amount > 0) ? tx.to === currentUser?.id : false
  const isApproved = !!tx.block

  return (
    <div className="bg-white p-1 rounded-2xl shadow">
      <details className="relative group border border-[#E5E5E5] rounded-xl p-4">
        <summary
          className="list-none flex items-center justify-between h-5"
        >
          {isApproved ? <SuccessTx /> : <WarnTx />}
          {tx.amount > 0 && (
            <>
              {isIncrease ? <IncreaseBalance amount={tx.amount} /> : <DecreaseBalance amount={tx.amount} />}
            </>
          )}
          <img src="/images/icons/details_open.svg" alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 transform group-open:hidden"/>
        </summary>
        <div>
          <p>from ~~~</p>
          <p>作成日時</p>
          <p>承認日時</p>
          <BasicButton></BasicButton>
          <img src="/images/icons/details_close.svg" alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 transform"/>
        </div>
      </details>
    </div>
  )
}

export default TxViewer
