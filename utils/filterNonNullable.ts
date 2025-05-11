import {Transaction} from '@/models/transaction'
import {Block} from '@/models/block'

export const filterNonNullableTxs = (
  arr: (Transaction[] | undefined | null)[]
) => arr.flatMap(e => e != null ? e : [])

export const filterNonNullableBlocks = (
  arr: (Block[] | undefined | null)[]
) => arr.flatMap(e => e != null ? e : [])
