'use client'

import { db, getUserTxPath, TX_AMOUNT_BUCKET } from '@/lib/firebase'
import { useAtom } from 'jotai'
import { txsState } from '@/stores/transactions'
import { ref, remove } from 'firebase/database'
import { getBucketImage } from '@/utils/getBucketImage'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { currentUserState } from '@/stores/users'

const TxsViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [txs] = useAtom(txsState)

  // useEffect(() => {
  //   if (!db) return
  //   if (!currentUser) return
  //   const txRef = ref(db, getUserTxPath(currentUser.id))
  //
  //   const handleValueChange = (snapshot: DataSnapshot) => {
  //     const txs = convertTxs(snapshot)
  //     txs.sort((a, b) => b.timestamp - a.timestamp)
  //     // setTxs(txs)
  //   }
  //
  //   const unsubscribe = onValue(txRef, handleValueChange)
  //
  //   return () => {
  //     off(txRef, 'value', handleValueChange)
  //   }
  // }, [])

  // データ削除処理
  const handleDeleteItem = async (id: string) => {
    if (!db) return
    if (!currentUser) return

    const itemRef = ref(db, `${getUserTxPath(currentUser.id)}/${id}`) // 削除対象のデータへの参照

    try {
      await remove(itemRef) // removeでデータを削除
      // データは onValue で自動的に更新されるので、ここで setData を呼ぶ必要はないのだ
    } catch (err) {
      console.error('Firebase delete error:', err)
    }
  }

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
                    <img src={getBucketImage(TX_AMOUNT_BUCKET, item.id, 'png')} alt=""/>
                  </span>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
              <Trash2 className="h-4 w-4"/>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TxsViewer
