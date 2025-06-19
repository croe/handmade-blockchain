import { useAtom } from 'jotai'
import { exhibitionModeState } from '@/stores/ui'

export const useExhibitionMode = () => {
  const [exhibitionMode] = useAtom(exhibitionModeState)

  // 展示モード時の制限機能
  const isRestricted = (feature: string): boolean => {
    if (!exhibitionMode) return false

    // 展示モードで制限する機能のリスト
    const restrictedFeatures = [
      'block-creation',
      'transaction-creation',
      'wallet-management',
      'admin-panel'
    ]

    return restrictedFeatures.includes(feature)
  }

  // 展示モード時のメッセージ
  const getRestrictionMessage = (feature: string): string => {
    const messages: Record<string, string> = {
      'block-creation': '展示モードではブロック作成はできません',
      'transaction-creation': '展示モードではトランザクション作成はできません',
      'wallet-management': '展示モードではウォレット管理はできません',
      'admin-panel': '展示モードでは管理画面にアクセスできません'
    }

    return messages[feature] || 'この機能は展示モードでは利用できません'
  }

  return {
    exhibitionMode,
    isRestricted,
    getRestrictionMessage
  }
} 