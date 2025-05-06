import { db, DB_USER } from '@/lib/firebase'
import { get, push, ref, serverTimestamp, update } from 'firebase/database'
import { convertUser } from '@/models/user'

export const addNewUser = async () => {
  try {
    if (!db) return
    // ここでユーザーを追加
    // ユーザー名はあるとテンション上がるけど、ない方がコンセプトに合うかも
    const usersRef = ref(db, DB_USER)
    return await push(usersRef, {
      t: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding new user:', error)
  }
}

export const getUser = async (userId: string) => {
  try {
    if (!db) return null
    const userRef = ref(db, `${DB_USER}/${userId}`)
    const userSnapshot = await get(userRef)
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
  // 10秒に一度呼ばれる。最終タイムスタンプを更新する
  try {
    if (!db) return
    const userRef = ref(db, `${DB_USER}/${userId}`)
    const user = await update(userRef, {
      t: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

const getUsersStatus = async (userId: string) => {
  // いらないかも
}
