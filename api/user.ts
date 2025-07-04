import {db, DB_USER, getMyUserPath} from '@/lib/firebase'
import { get, push, ref, serverTimestamp, update } from 'firebase/database'
import { convertUser } from '@/models/user'
import { makeTx } from './transaction'

export const addNewUser = async () => {
  try {
    if (!db) return
    // ここでユーザーを追加
    // ユーザー名はあるとテンション上がるけど、ない方がコンセプトに合うかも
    const usersRef = ref(db, DB_USER)
    const userRef = await push(usersRef, {
      t: serverTimestamp(),
    })

    if (userRef?.key) {
      try {
        await makeTx(userRef.key, 'reward', userRef.key)
      } catch (txError) {
        console.error('Error creating welcome transaction:', txError)
      }
    }
    
    return userRef
  } catch (error) {
    console.error('Error adding new user:', error)
  }
}

export const getUser = async (userId: string) => {
  try {
    if (!db) return null
    const meRef = ref(db, getMyUserPath(userId))
    const userSnapshot = await get(meRef)
    if (userSnapshot.exists()) {
      return convertUser(userSnapshot)
    } else {
      return null
    }
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

export const updateUserOnline = async (userId: string) => {
  try {
    if (!db) return
    const meRef = ref(db, getMyUserPath(userId))
    await update(meRef, { t: serverTimestamp(), s: 1 })
    return true
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}
