import { atom } from 'jotai'

export const sideMenuState = atom<boolean>(false)

// 展示モードの状態管理
export const exhibitionModeState = atom<boolean>(false)

// 展示モードの設定を永続化するためのキー
const EXHIBITION_MODE_KEY = 'exhibition_mode'

// 展示モードの初期化（ローカルストレージから読み込み）
export const initializeExhibitionMode = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(EXHIBITION_MODE_KEY)
    return saved === 'true'
  }
  return false
}

// 展示モードの永続化
export const persistExhibitionMode = (mode: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXHIBITION_MODE_KEY, mode.toString())
  }
}
