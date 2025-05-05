import {db} from '@/lib/firebase'
import {push, ref} from 'firebase/database'

export const addNewUser = async (timestamp: number) => {
  try {
    if (!db) return
    // ここでユーザーを追加
    // ユーザー名はあるとテンション上がるけど、ない方がコンセプトに合うかも
    const usersRef = ref(db, 'users')
    return await push(usersRef, {
      t: timestamp,
    })
  } catch (error) {
    console.error('Error adding new user:', error)
  }
}

const getUsers = async () => {
  // いらないかも
}

const updateOnlineStatus = async (userId: string, online: boolean) => {
  // オフラインになったことはどうやって伝える？（10秒に1回タイムスタンプを送る？）
  // userIDとtimestampの管理
}

const getUsersStatus = async (userId: string) => {
  // いらないかも
}
