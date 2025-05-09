import {atom} from 'jotai'
import {atomWithStorage} from 'jotai/utils'
import {Transaction} from '@/models/transaction'

export const txsState = atomWithStorage<Transaction[]>('txs', [])
