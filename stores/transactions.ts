import {atom} from 'jotai'
import {atomWithStorage} from 'jotai/utils'
import {Transaction} from '@/models/transaction'

export const txsState = atomWithStorage<Transaction[]>('txs', [])

export const syncedTimestampState = atomWithStorage<number>('syncedTimestamp', 1746636000000)

export const syncedTxsState = atom<Transaction[]>(
  (get) => {
    const txs = get(txsState)
    const syncedTimestamp = get(syncedTimestampState)
    return txs.filter((tx) => tx.timestamp <= syncedTimestamp)
  }
)
