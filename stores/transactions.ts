import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {Transaction, TxWithBlock, TxWithValue} from '@/models/transaction'
import { currentChainState, selectedBlockState, chainState } from '@/stores/chain'
import { currentUserState } from '@/stores/users'
import { differenceBy } from 'lodash'

export const txsState = atomWithStorage<Transaction[]>('txs_v2', [])

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

/**
 * 最長チェーンに取り込まれていないペンディング中のトランザクション一覧
 * 報酬トランザクションも除外
 */
export const pendingTxsState = atom<Transaction[]>((get) => {
  const allTxs = get(syncedTxsState)
  const currentTxs = get(currentTxsState)

  // 全トランザクションから現在のチェーンに取り込まれているトランザクションを除外し、報酬トランザクションも除外
  return differenceBy(allTxs, currentTxs, 'id')
    .filter((tx) => tx.from !== 'reward')
})

/**
 * 選択中のブロックを基準としたウォレットチェック用のユーザーID
 */
export const walletCheckUserIdState = atom<string | null>(null)

/**
 * 選択中のブロックを基準とした特定ユーザーのバランスを計算するストア
 * ブロック作成時のウォレット確認で使用
 */
export const selectedChainUserBalanceState = atom((get) => {
  const userId = get(walletCheckUserIdState)
  const selectedBlock = get(selectedBlockState)
  const chain = get(chainState)
  const allTxs = get(txsState)

  if (!userId || !selectedBlock || chain.length === 0) {
    return 0
  }

  // selectedBlockから遡ってチェーンを構築
  const selectedChainBlocks: typeof chain = []
  const getBlockChain = (blockId: string) => {
    const block = chain.find((block) => block.id === blockId)
    if (block) {
      selectedChainBlocks.push(block)
      if (block.prevId) {
        getBlockChain(block.prevId)
      }
    }
  }

  getBlockChain(selectedBlock.id)

  // バランス計算
  let balance = 0
  for (const block of selectedChainBlocks) {
    for (const txInBlock of block.txs) {
      const transaction = allTxs.find(tx => tx.id === txInBlock.i)
      if (transaction) {
        if (transaction.from === userId) {
          balance -= txInBlock.m // 送金した場合
        }
        if (transaction.to === userId) {
          balance += txInBlock.m // 着金した場合
        }
      }
    }
  }

  return balance
})

/**
 * 選択中のブロックを基準とした特定ユーザーの取引履歴を取得するストア
 */
export const selectedChainUserTxsState = atom((get) => {
  const userId = get(walletCheckUserIdState)
  const selectedBlock = get(selectedBlockState)
  const chain = get(chainState)
  const allTxs = get(txsState)

  if (!userId || !selectedBlock || chain.length === 0) {
    return []
  }

  // selectedBlockから遡ってチェーンを構築
  const selectedChainBlocks: typeof chain = []
  const getBlockChain = (blockId: string) => {
    const block = chain.find((block) => block.id === blockId)
    if (block) {
      selectedChainBlocks.push(block)
      if (block.prevId) {
        getBlockChain(block.prevId)
      }
    }
  }

  getBlockChain(selectedBlock.id)

  // ユーザーに関連する取引を取得
  const userTxs: TxWithBlock[] = []
  for (const block of selectedChainBlocks) {
    for (const txInBlock of block.txs) {
      const transaction = allTxs.find(tx => tx.id === txInBlock.i)
      if (transaction && (transaction.from === userId || transaction.to === userId)) {
        userTxs.push({
          ...transaction,
          amount: txInBlock.m,
          block: block
        })
      }
    }
  }

  return userTxs.reverse() // 新しい順
})
