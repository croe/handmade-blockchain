import { db, getMyUserPath } from '@/lib/firebase'
import { child, get, push, ref, serverTimestamp, set } from 'firebase/database'
import { getUserTxPath } from '@/lib/firebase'
import { convertTxs, convertTxToDB, Transaction } from '@/models/transaction'
import { differenceBy } from 'lodash'

export const makeTx = async (userId: string, from: string, to: string)=> {
  try {
    if (!db) return
    const txRef = ref(db, getUserTxPath(userId))
    const meRef = ref(db, getMyUserPath(userId))
    // Usersを更新
    await set(meRef, {
      t: serverTimestamp()
    })
    // Txを作成
    return await push(txRef, {
      f: from,
      t: to,
      s: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding new transaction:', error)
  }
}

export const getTxs = async (userId: string) => {
  try {
    if (!db) return null
    const txRef = ref(db, getUserTxPath(userId))
    const txSnapshot = await get(txRef)
    if (txSnapshot.exists()) {
      return convertTxs(txSnapshot)
    }
    return null
  } catch (error) {
    console.error('Error updating user txs', error)
  }
}

export const syncTx = async (userId: string, tx: Transaction) => {
  try {
    if (!db) return null
    const txRef = child(ref(db, getUserTxPath(userId)), tx.id)
    await set(txRef, convertTxToDB(tx))
  } catch (error) {
    console.error('Error sync user tx', error)
  }
}

export const syncTxs = async (
  userId: string,
  txs: Transaction[],
  excludeTxs: Transaction[]
) => {
  try {
    const promises = differenceBy(txs, excludeTxs).map(async (tx) => await syncTx(userId, tx))
    await Promise.all(promises)
    return true
  } catch (error) {
    console.error('Error sync user txs', error)
  }
}
