'use client'

import { useAtom } from 'jotai'
import { exhibitionModeState, initializeExhibitionMode } from '@/stores/ui'
import { currentUserState } from '@/stores/users'
import { GACHA_WALLET_ID } from '@/lib/const'
import { useEffect, useState } from 'react'
import {getUnixTime} from 'date-fns'

export default function ExhibitionModeInitializer() {
  const [, setExhibitionMode] = useAtom(exhibitionModeState)
  const [, setCurrentUser] = useAtom(currentUserState)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      // ローカルストレージから展示モードの状態を読み込み
      const savedMode = initializeExhibitionMode()
      setExhibitionMode(savedMode)

      // 展示モード時は専用のユーザーIDを設定
      if (savedMode) {
        setCurrentUser({
          id: GACHA_WALLET_ID,
          timestamp: getUnixTime(new Date()),
          status: true,
        })
      }

      setIsInitialized(true)
    }
  }, [setExhibitionMode, setCurrentUser, isInitialized])

  return null // このコンポーネントは表示されない
}
