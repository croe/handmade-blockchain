import {db, getMyUserPath} from '@/lib/firebase'
import {push, ref, serverTimestamp, set} from 'firebase/database'
import { getMyTxPath } from '@/lib/firebase'

export const makeTransaction = async (userId: string, from: string, to: string)=> {
  try {
    if (!db) return
    const transactionsRef = ref(db, getMyTxPath(userId))
    const meRef = ref(db, getMyUserPath(userId))
    // Usersを更新
    await set(meRef, {
      t: serverTimestamp()
    })
    // Txを作成
    return await push(transactionsRef, {
      f: from,
      t: to,
      s: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding new transaction:', error)
  }
}
