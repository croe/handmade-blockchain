import {atom} from 'jotai'
import {atomWithStorage} from 'jotai/utils'
import {Transaction} from '@/models/transaction'

export const txsState = atomWithStorage<Transaction[]>('txs', [])

export const syncedTxsState = atom<Transaction[]>((get) => {
  const txs = get(txsState)
  return txs.sort((a, b) => b.timestamp - a.timestamp)
})
