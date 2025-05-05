import { db } from '@/lib/firebase'
import { push, ref, serverTimestamp } from 'firebase/database'
import { getUnixTime } from 'date-fns'
import { DB_TRANSACTION } from '@/lib/firebase'

export const makeTransaction = async (from: string, to: string)=> {
  try {
    if (!db) return
    const transactionsRef = ref(db, DB_TRANSACTION)
    return await push(transactionsRef, {
      f: from,
      t: to,
      s: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding new transaction:', error)
  }
}
