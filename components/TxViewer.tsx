'use client'

import {type TxWithBlock} from '@/models/transaction'
import {useAtom} from 'jotai'
import {currentUserState} from '@/stores/users'
import BasicButton from '@/components/Button/BasicButton'

type Props = {
  tx: TxWithBlock
}

const TxViewer = ({tx}:Props) => {
  const [currentUser] = useAtom(currentUserState)
  const isIncrease = (tx.block && tx.amount > 0) ? tx.to === currentUser?.id : false

  return (
    <div className="bg-white p-1 rounded-2xl shadow">
      <details className="relative group border border-[#E5E5E5] rounded-xl p-4">
        <summary
          className="list-none flex justify-between"
        >
          <p></p>
          {tx.amount > 0 && (
            <p className={
              `text-xl font-bold ${
                isIncrease ? 'text-[#0DDA1E]' : 'text-[#FF6631]'
              } flex gap-1 items-center`
            }>
              <span>{`${isIncrease ? '+':'-'}${tx.amount.toLocaleString()}`}</span>
              <img src="/images/icons/cnc.svg" alt="" className="h-4"/>
            </p>
          )}
          <img src="/images/icons/details_open.svg" alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 transform group-open:hidden"/>
          {/*{tx.id} - {new Date(tx.timestamp).toLocaleString()}*/}
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
