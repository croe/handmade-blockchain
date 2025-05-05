import { db } from '@/lib/firebase'
import { push, ref } from 'firebase/database'
import { getUnixTime } from 'date-fns'

export const makeTransaction = async (from: string, to: string, amount: number)=> {
  try {
    if (!db) return
    const transactionsRef = ref(db, 'transactions')
    return await push(transactionsRef, {
      f: from,
      t: to,
      m: amount,
      s: getUnixTime(new Date()),
    })
  } catch (error) {
    console.error('Error adding new transaction:', error)
  }
}
