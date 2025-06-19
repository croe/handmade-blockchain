'use client'

import { useExhibitionMode } from '@/hooks/useExhibitionMode'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ExhibitionModeRestrictionProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ExhibitionModeRestriction({
  feature,
  children,
  fallback
}: ExhibitionModeRestrictionProps) {
  const { isRestricted, getRestrictionMessage } = useExhibitionMode()
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  useEffect(() => {
    if (isRestricted(feature)) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/dashboard')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isRestricted(feature), feature, router])

  if (isRestricted(feature)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          展示モード
        </h3>
        <p className="text-gray-600 mb-4">
          {getRestrictionMessage(feature)}
        </p>
        <div className="text-sm text-blue-600 font-medium">
          {countdown}秒後にダッシュボードに戻ります...
        </div>
      </div>
    )
  }

  return <>{children}</>
} 