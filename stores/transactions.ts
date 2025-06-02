import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {Transaction, TxWithBlock, TxWithValue} from '@/models/transaction'
import { currentChainState } from '@/stores/chain'
import { currentUserState } from '@/stores/users'

export const txsState = atomWithStorage<Transaction[]>('txs', [])

export const syncedTxsState = atom<Transaction[]>((get) => {
  const txs = get(txsState)
  return txs.sort((a, b) => b.timestamp - a.timestamp)
})

/**
 * 現在のChainに格納されているTx一覧
 */
export const currentTxsState = atom<Transaction[]>(
  (get) => {
    const currentChain = get(currentChainState)
    const allTxs = get(txsState) // すべてのトランザクションを取得

    const txsInChain = currentChain.flatMap((block) => block.txs)

    // TxInBlock から完全な Transaction を検索してマッピング
    const resolvedTxs = txsInChain.map(txInBlock => {
      return allTxs.find(tx => tx.id === txInBlock.i)
    }).filter((tx): tx is Transaction => tx !== undefined) // undefined を除去し型ガード

    return resolvedTxs
  }
)

/**
 * すべてのTxから自分に関連するTxsのみを取り出すストア
 */
export const allMyTxsState = atom<TxWithBlock[]>((get) => {
  const allTxs = get(txsState)
  const currentUser = get(currentUserState)
  const currentChain = get(currentChainState)

  if (!currentUser) {
    return [] // ユーザーがいない場合は空配列
  }

  return allTxs
    .filter(tx => tx.from === currentUser.id || tx.to === currentUser.id)
    .map(tx => {
      // トランザクションの金額とブロック情報を探す
      const block = currentChain.find(block =>
        block.txs.some(txInBlock => txInBlock.i === tx.id)
      )
      const txInChain = block?.txs.find(txInBlock => txInBlock.i === tx.id)

      return {
        ...tx,
        amount: txInChain?.m ?? 0,
        block: block
      }
    })
    .reverse()
})

/**
 * 現在のChainで自分のウォレットに関連するTxsのみを取り出すストア
 */
export const myTxsState = atom<Transaction[]>(
  (get) => {
    const currentTxs = get(currentTxsState)
    const currentUser = get(currentUserState)

    if (!currentUser) {
      return [] // ユーザーがいない場合は空配列
    }

    return currentTxs.filter(tx =>
      tx.from === currentUser.id || tx.to === currentUser.id
    )
  }
)

/**
 * 自分に送金されたTx一覧
 */
export const myReceivedTxsState = atom<Transaction[]>((get) => {
  const myTxs = get(myTxsState)
  const currentUser = get(currentUserState)
  if (!currentUser) return []
  return myTxs.filter(tx => tx.to === currentUser.id)
})

/**
 * 自分が送金したTx一覧
 */
export const mySentTxsState = atom<Transaction[]>((get) => {
  const myTxs = get(myTxsState)
  const currentUser = get(currentUserState)
  if (!currentUser) return []
  return myTxs.filter(tx => tx.from === currentUser.id)
})

/**
 * 現在のユーザーの残高
 */
export const myBalanceState = atom<number>((get) => {
  const currentUser = get(currentUserState)
  if (!currentUser) return 0

  const currentChain = get(currentChainState)
  const allTxs = get(txsState) // すべてのトランザクション情報を取得
  let balance = 0

  for (const block of currentChain) {
    for (const txInBlock of block.txs) {
      // txInBlock.i (ID) を使って、allTxs から対応する Transaction を検索
      const transaction = allTxs.find(tx => tx.id === txInBlock.i)
      if (transaction) {
        if (transaction.from === currentUser.id) {
          balance -= txInBlock.m // 送金した場合
        }
        if (transaction.to === currentUser.id) {
          balance += txInBlock.m // 着金した場合
        }
      }
    }
  }

  return balance
})

/**
 * ブロックに取り込むTxを選択するストア
 */
export const selectedTxsState = atom<TxWithValue[]>([])
