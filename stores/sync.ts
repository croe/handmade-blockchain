import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { User } from '@/models/user'

// 同期情報の型定義
export type SyncInfo = {
  lastUpdate: number; // 最終更新のタイムスタンプ
  connectedUsers: User[]; // 接続中のユーザー一覧
}

// 同期情報のストア
export const syncInfoState = atomWithStorage<SyncInfo>('syncInfo', {
  lastUpdate: 0,
  connectedUsers: []
})

// 最終更新日時を文字列で取得するatom
export const lastUpdateStringState = atom((get) => {
  const syncInfo = get(syncInfoState)
  if (syncInfo.lastUpdate === 0) return '未同期'
  
  const date = new Date(syncInfo.lastUpdate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}年${month}月${day}日${hours}:${minutes}.${seconds}`
})

// 接続ユーザー名のリストを取得するatom
export const connectedUserNamesState = atom((get) => {
  const syncInfo = get(syncInfoState)
  return syncInfo.connectedUsers.map(user => user.id)
}) 