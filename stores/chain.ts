import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/block'

export const chainState = atomWithStorage<Block[]>('chains', [])
