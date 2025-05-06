'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {db, storage, DB_TRANSACTION, PUBLIC_BUCKET, TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {ref, onValue, remove, off, DataSnapshot} from 'firebase/database'
import {ref as storageRef, getDownloadURL} from 'firebase/storage'
import {Button} from '@/components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import {Trash2} from 'lucide-react'
import CreateWalletView from '@/components/CreateWalletView'
import {convertTransaction, Transaction} from '@/models/transaction'
import {getBucketImage} from '@/utils/getBucketImage'

export default function Home() {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得と監視
  useEffect(() => {

    // db が初期化されていない場合は何もしない
    if (!db) {
      setError('Firebase is not configured correctly.')
      setLoading(false)
      return
    }

    const dataRef = ref(db, DB_TRANSACTION)

    // データ変更時のコールバック
    const handleValueChange = async (snapshot: DataSnapshot) => {
      const txs = convertTransaction(snapshot)
      // タイムスタンプで降順（新しい順）にソート
      txs.sort((a, b) => b.timestamp - a.timestamp)
      console.log(txs)
      setData(txs)
      setError(null) // エラーをクリア
      setLoading(false)
    }

    // エラー発生時のコールバック
    const handleError = (err: Error) => {
      console.error('Firebase read error:', err)
      setError('Failed to load data from Firebase.')
      setLoading(false)
    }

    // データの購読を開始
    const unsubscribe = onValue(dataRef, handleValueChange, handleError)

    // コンポーネントのアンマウント時に購読を解除
    return () => {
      // onValue によって返された unsubscribe 関数を使うか、
      // リスナー関数を特定して off を呼び出す
      // unsubscribe(); // これでも OK
      off(dataRef, 'value', handleValueChange)
    }
  }, []) // db の参照が変わることはないので、空の依存配列


  // データ削除処理
  const handleDeleteItem = async (id: string) => {
    if (!db) return

    const itemRef = ref(db, `${DB_TRANSACTION}/${id}`) // 削除対象のデータへの参照

    try {
      await remove(itemRef) // removeでデータを削除
      setError(null) // エラーをクリア
      // データは onValue で自動的に更新されるので、ここで setData を呼ぶ必要はないのだ
    } catch (err) {
      console.error('Firebase delete error:', err)
      setError('Failed to delete data from Firebase.')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 py-8">
      <Card>
        <CreateWalletView/>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* データ表示エリア */}
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && db && (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {data.length === 0 ? (
                <p className="text-gray-500">No data yet.</p>
              ) : (
                data.map((item) => (
                  <li key={item.id}
                      className="flex items-center justify-between p-2 border rounded bg-white dark:bg-gray-800">
                    <span className="flex-1 mr-2 break-words">
                      <span className="block text-xs text-gray-400">From: {item.from}</span>
                      <span className="block text-xs text-gray-400">To: {item.to}</span>
                      <span className="block text-xs text-gray-400">({new Date(item.timestamp).toLocaleString()})</span>
                      <img src={getBucketImage(TX_AMOUNT_BUCKET, item.id, 'png')} alt=""/>
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}
                            disabled={loading}> {/* handleDeleteItemを呼び出す */}
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </li>
                ))
              )}
            </ul>
          )}
          {!db && !loading && <p className="text-orange-500">Firebase is not configured correctly.</p>}
        </CardContent>
      </Card>
      <p><Link href={`/tx/create`}>CREATE TX</Link></p>
    </main>
  )
}
