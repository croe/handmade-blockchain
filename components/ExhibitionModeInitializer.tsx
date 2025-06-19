'use client'

import { useAtom } from 'jotai'
import { exhibitionModeState, initializeExhibitionMode } from '@/stores/ui'
import { useEffect, useState } from 'react'

export default function ExhibitionModeInitializer() {
  const [, setExhibitionMode] = useAtom(exhibitionModeState)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      // ローカルストレージから展示モードの状態を読み込み
      const savedMode = initializeExhibitionMode()
      setExhibitionMode(savedMode)
      setIsInitialized(true)
    }
  }, [setExhibitionMode, isInitialized])

  return null // このコンポーネントは表示されない
} 