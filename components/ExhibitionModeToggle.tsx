'use client'

import { useAtom } from 'jotai'
import { exhibitionModeState, persistExhibitionMode } from '@/stores/ui'
import { useState, useEffect } from 'react'

export default function ExhibitionModeToggle() {
  const [exhibitionMode, setExhibitionMode] = useAtom(exhibitionModeState)
  const [isVisible, setIsVisible] = useState(false)

  // 管理者モードの表示制御（Ctrl + Shift + E で表示）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleToggle = () => {
    const newMode = !exhibitionMode
    setExhibitionMode(newMode)
    persistExhibitionMode(newMode)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">展示モード</span>
          <span className="text-xs text-gray-500">
            {exhibitionMode ? 'ON' : 'OFF'}
          </span>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            exhibitionMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              exhibitionMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Ctrl + Shift + E で表示/非表示
      </div>
    </div>
  )
} 