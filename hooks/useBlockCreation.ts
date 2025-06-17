import { useCallback } from 'react'

const BLOCK_CREATION_COOLDOWN = 10 * 60 * 1000 // 10分（ミリ秒）

export const useBlockCreation = () => {
  const saveBlockCreationTime = useCallback(() => {
    localStorage.setItem('lastBlockCreationTime', Date.now().toString())
  }, [])

  const canCreateBlock = useCallback(() => {
    const lastBlockCreationTime = localStorage.getItem('lastBlockCreationTime')
    if (!lastBlockCreationTime) return true

    const nextBlockTime = parseInt(lastBlockCreationTime) + BLOCK_CREATION_COOLDOWN
    return Date.now() >= nextBlockTime
  }, [])

  const getNextBlockTime = useCallback(() => {
    const lastBlockCreationTime = localStorage.getItem('lastBlockCreationTime')
    if (!lastBlockCreationTime) return Date.now()

    return parseInt(lastBlockCreationTime) + BLOCK_CREATION_COOLDOWN
  }, [])

  return {
    saveBlockCreationTime,
    canCreateBlock,
    getNextBlockTime,
  }
} 