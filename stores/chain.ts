import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/chain'

const options = {
  getOnInit: true,
}

export const chainsState = atomWithStorage<Block[]>('chains', [], undefined, options)
