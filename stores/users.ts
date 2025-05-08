import { atom  } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { User } from '@/models/user'

const options = {
  getOnInit: false,
}

export const usersState　= atomWithStorage<User[]>('users', [])

export const currentUserState
  = atomWithStorage<User | null>('currentUser', null,undefined, options)

// 同期する最新のタイムスタンプの基準になるユーザー
// これと自分の持っている最新のチェーンのタイムスタンプと比較する
export const latestTimestampUserState = atom<User | null>(
  (get) => {
    const users = get(usersState)
    const currentUser = get(currentUserState)
    if (!currentUser) return null
    // 自分以外のユーザーの中で最新のタイムスタンプを持つユーザーを取得する
    const filteredUsers = users
      .filter((user) => user.id !== currentUser.id)
      .sort((a, b) => b.timestamp - a.timestamp)
    return filteredUsers[0]
})

// export const syncedUserState = atom()
