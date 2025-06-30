import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Block } from '@/models/block'
import { uniq } from 'lodash'
import {formatTimeDelta} from 'react-countdown'

export const chainState = atomWithStorage<Block[]>('chains_v2', [])

export const syncedBlocksState = atom<Block[]>(
  (get) => {
    const chain = get(chainState)
    return chain.sort((a, b) => a.timestamp - b.timestamp)
  }
)

// チェーンの型定義
export type Chain = {
  blocks: Block[];
  length: number;
}

// チェーンごとにブロックを整理する関数
const organizeChains = (blocks: Block[]): Chain[] => {
  if (blocks.length === 0) return []

  const chains: Chain[] = []
  const processedBlocks = new Set<string>()

  // リーフブロック（子を持たないブロック）を見つける
  const leafBlocks = blocks.filter(block => {
    return !blocks.some(b => b.prevId === block.id)
  })

  // 各リーフブロックから始まって、ジェネシスまで遡る
  for (const leafBlock of leafBlocks) {
    if (processedBlocks.has(leafBlock.id)) continue

    // リーフからジェネシスまでの完全なチェーンを構築
    const chainBlocks = buildChainToGenesis(leafBlock, blocks)

    if (chainBlocks.length > 0) {
      const chain: Chain = {
        blocks: chainBlocks,
        length: chainBlocks.length
      }

      chains.push(chain)

      // このチェーンのブロックをすべて処理済みにマーク
      chainBlocks.forEach(block => processedBlocks.add(block.id))
    }
  }

  // チェーンの長さで降順ソート
  return chains.sort((a, b) => b.length - a.length)
}

// リーフブロックからジェネシスブロックまで遡る
const buildChainToGenesis = (leafBlock: Block, allBlocks: Block[]): Block[] => {
  const chain: Block[] = []
  let currentBlock: Block | undefined = leafBlock

  while (currentBlock) {
    chain.unshift(currentBlock) // 配列の先頭に追加（ジェネシス→リーフの順になる）
    if (currentBlock.prevId === '') break // ジェネシスブロックに到達

    currentBlock = allBlocks.find(b => b.id === currentBlock!.prevId)
  }

  return chain
}

// チェーンを取得するatomを作成
export const chainsState = atom<Chain[]>(
  (get) => {
    const blocks = get(chainState)
    return organizeChains(blocks)
  }
)

/**
 * 最長のチェーン
 */
export const currentChainState = atom<Block[]>((get) => {
  const chain = get(chainState)
  if (chain.length === 0) return []

  // 1. 起点となるブロック (startBlock) を見つける
  // blockHeightの最大値を取得
  const maxHeight = Math.max(...chain.map((block) => block.blockHeight))

  // 最大のblockHeightを持つブロックをフィルタリング
  const blocksWithMaxHeight = chain.filter(
    (block) => block.blockHeight === maxHeight,
  )

  // timestampが最も古いブロックを選択
  // blocksWithMaxHeight が空の場合はありえないが、念のためチェック
  if (blocksWithMaxHeight.length === 0) return []

  const startBlock = blocksWithMaxHeight.reduce((oldest, current) =>
    current.timestamp < oldest.timestamp ? current : oldest,
  )

  // 2. startBlock から prevId をたどってチェーンを構築
  const resultChain: Block[] = []
  let currentBlock: Block | undefined = startBlock

  while (currentBlock) {
    resultChain.push(currentBlock)
    if (currentBlock.prevId === '') {
      // ジェネシスブロックに到達
      break
    }
    currentBlock = chain.find((block) => block.id === currentBlock!.prevId)
  }

  // 3. 配列を返す (現在は startBlock からジェネシスブロックの順)
  // もしジェネシスブロックから startBlock の順にしたければ、最後に reverse() する
  return resultChain.reverse() // ジェネシスから最新の順にするのだ
})

type ForkedPoints = {
  root: number,
  fromRoot: number,
  forkBlockHeight: number,
  branchIndex: number // 同じ分岐点グループ内でのインデックス
  hasNextBranch: boolean // さらに後続のブランチがあるか
  indexInArray: number   // branchedChainsState 配列での位置（メインチェーンを含む）
  chainLength: number    // そのチェーンの長さ
}

export const forkedPointsState = atom<ForkedPoints[]>((get) => {
  const chains = get(branchedChainsState)
  if (chains.length <= 1) return [] // 分岐がない場合は空配列を返す

  const mainChain = chains[0] // メインチェーン
  const branchChains = chains.slice(1) // 分岐チェーン

  const initialForks: Omit<ForkedPoints, "branchIndex" | "hasNextBranch">[] = branchChains.map((branchChain, i) => {
    // 分岐チェーンの最初のブロックの親IDを取得
    const forkBlockId = branchChain.blocks[0].prevId

    // メインチェーンで分岐点のブロックを探す
    const forkBlockIndex = mainChain.blocks.findIndex(
      (block) => block.id === forkBlockId
    )

    if (forkBlockIndex === -1) {
      // 分岐点が見つからない場合は、他の分岐チェーンを探す
      for (let j = 0; j < chains.length; j++) {
        const chain = chains[j]
        const index = chain.blocks.findIndex((block) => block.id === forkBlockId)
        if (index !== -1) {
          // 分岐チェーンの最初のブロックから見た相対位置を計算
          const relativePosition = branchChain.blocks[0].blockHeight - chain.blocks[index].blockHeight
          return {
            root: j,
            fromRoot: chain.blocks[index].blockHeight,
            forkBlockHeight: chain.blocks[index].blockHeight,
            indexInArray: i + 1,
            chainLength: branchChain.length
          }
        }
      }
      // 分岐点が見つからない場合はデフォルト値を返す
      return {
        root: 0,
        fromRoot: 0,
        forkBlockHeight: 0,
        indexInArray: i + 1,
        chainLength: branchChain.length
      }
    }

    return {
      root: 0, // メインチェーンからの分岐
      fromRoot: mainChain.blocks[forkBlockIndex].blockHeight,
      forkBlockHeight: mainChain.blocks[forkBlockIndex].blockHeight,
      indexInArray: i + 1,
      chainLength: branchChain.length
    }
  })

  // まずグループごとの総数をカウント
  const totalMap = new Map<string, number>()
  for (const f of initialForks) {
    const key = `${f.root}-${f.fromRoot}`
    totalMap.set(key, (totalMap.get(key) ?? 0) + 1)
  }

  // 同じグループ内でのインデックスと hasNextBranch を付与
  const counterMap = new Map<string, number>()
  const forksWithIndex: ForkedPoints[] = initialForks.map((f) => {
    const key = `${f.root}-${f.fromRoot}`
    const idx = counterMap.get(key) ?? 0
    counterMap.set(key, idx + 1)
    const total = totalMap.get(key) ?? 1
    return { ...f, branchIndex: idx, hasNextBranch: idx < total - 1 }
  })

  return forksWithIndex
})

/**
 * 接続するブロック
 */
export const selectedBlockState = atom<Block | null>(null)

// 分岐チェーンを含む配列を取得するatomを作成
// [最長のチェーン, 分岐したところからのチェーン, 分岐したところからのチェーン, ...]
export const branchedChainsState = atom<Chain[]>(
  (get) => {
    const blocks = get(chainState)
    return organizeBranchedChains(blocks)
  }
)

// 分岐チェーンを整理する関数
const organizeBranchedChains = (blocks: Block[]): Chain[] => {
  if (blocks.length === 0) return []

  // まず現在のアルゴリズムで最長チェーンを取得
  const allChains = organizeChains(blocks)
  if (allChains.length === 0) return []

  // 最長チェーン
  const longestChain = allChains[0]
  const result: Chain[] = [longestChain]

  // 最長チェーンに含まれるブロックIDのセット
  const longestChainBlockIds = new Set(longestChain.blocks.map(b => b.id))

  // 最長チェーンに含まれないブロックを探す
  const remainingBlocks = blocks.filter(block => !longestChainBlockIds.has(block.id))

  // 分岐チェーンを構築
  const processedBlocks = new Set<string>()

  // 分岐チェーンを反復的に検出
  let foundNewBranch = true
  while (foundNewBranch) {
    foundNewBranch = false

    for (const block of remainingBlocks) {
      if (processedBlocks.has(block.id)) continue

      // このブロックの親が最長チェーンまたは既に処理した分岐チェーンに含まれているかチェック
      const parentInLongestChain = longestChainBlockIds.has(block.prevId)
      const parentInProcessed = processedBlocks.has(block.prevId)

      if (parentInLongestChain || parentInProcessed) {
        // 分岐点から始まるチェーンを構築
        const branchChain = buildBranchFromBlock(block, blocks)
        result.push(branchChain)

        // 処理済みに追加
        branchChain.blocks.forEach(b => processedBlocks.add(b.id))
        foundNewBranch = true
      }
    }
  }

  // ---- ここから順序付けを再構築 ----
  // チェーン間の親子関係と分岐高さを計算する
  type BranchMeta = {
    chain: Chain
    index: number            // result 配列内でのインデックス
    parentIndex: number      // 親チェーンのインデックス（result 基準）
    forkHeight: number       // 親チェーン上の分岐ブロック高さ
  }

  const metas: BranchMeta[] = result.map((chain, idx) => {
    if (idx === 0) {
      // 最長チェーン（ジェネシス）
      return { chain, index: idx, parentIndex: -1, forkHeight: -1 }
    }

    const forkBlockId = chain.blocks[0].prevId

    // 親チェーンを探す（現在までに result に入っているチェーンを対象）
    for (let p = 0; p < result.length; p++) {
      const parentCandidate = result[p]
      const forkBlock = parentCandidate.blocks.find(b => b.id === forkBlockId)
      if (forkBlock) {
        return {
          chain,
          index: idx,
          parentIndex: p,
          forkHeight: forkBlock.blockHeight,
        }
      }
    }

    // 親が見つからない場合はメインチェーン直下扱い
    return { chain, index: idx, parentIndex: 0, forkHeight: 0 }
  })

  // 親チェーン -> 子チェーン一覧のマップ
  const childrenMap = new Map<number, BranchMeta[]>()
  for (const meta of metas) {
    if (meta.parentIndex === -1) continue // ルート
    const arr = childrenMap.get(meta.parentIndex) ?? []
    arr.push(meta)
    childrenMap.set(meta.parentIndex, arr)
  }

  // 親ごとに子をフォーク高さで降順ソート
  for (const [key, arr] of childrenMap.entries()) {
    arr.sort((a, b) => b.forkHeight - a.forkHeight || b.chain.length - a.chain.length)
  }

  // 深さ優先でチェーンを並べ替える
  const ordered: Chain[] = []
  const visit = (idx: number) => {
    const chain = metas[idx].chain
    ordered.push(chain)
    const children = childrenMap.get(idx) ?? []
    for (const child of children) {
      visit(child.index)
    }
  }

  visit(0) // ルート（最長チェーン）から開始

  return ordered
  // ---- ここまで順序付けを再構築 ----
}

// 分岐点から始まるチェーンを構築するヘルパー関数
const buildBranchFromBlock = (startBlock: Block, allBlocks: Block[]): Chain => {
  const chainBlocks: Block[] = [startBlock]
  let currentBlock = startBlock

  // 子ブロックを探して追加
  while (true) {
    const nextBlock = allBlocks.find(b => b.prevId === currentBlock.id)
    if (!nextBlock) break

    chainBlocks.push(nextBlock)
    currentBlock = nextBlock
  }

  return {
    blocks: chainBlocks,
    // lastBlock: currentBlock,
    length: chainBlocks.length
  }
}
