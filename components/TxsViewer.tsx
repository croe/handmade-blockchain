'use client'

import { TX_AMOUNT_BUCKET } from '@/lib/firebase'
import { useAtom } from 'jotai'
import { syncedTxsState } from '@/stores/transactions'
import { getBucketImage } from '@/utils/getBucketImage'
import { currentUserState } from '@/stores/users'

const TxsViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [txs] = useAtom(syncedTxsState)

  return (
    <div className="w-4/5 mx-auto px-4 py-2 text-black border-2" >
      <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {txs.map((item) => (
          <li key={item.id}
              className="flex items-center justify-between p-2 border rounded bg-white dark:bg-gray-800">
                  <span className="flex-1 mr-2 break-words">
                    <span className="block text-xs text-gray-400">From: {item.from}</span>
                    <span className="block text-xs text-gray-400">To: {item.to}</span>
                    <span className="block text-xs text-gray-400">({new Date(item.timestamp).toLocaleString()})</span>
                    <img className="w-[300px]" src={
                      item.from === 'reward'
                        ? getBucketImage(TX_AMOUNT_BUCKET, 'reward', 'png')
                        : getBucketImage(TX_AMOUNT_BUCKET, item.id, 'png')
                    } alt=""/>
                  </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TxsViewer
