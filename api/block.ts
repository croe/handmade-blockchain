// blockにしたときにバリデーションするtransaction idとamountをセットで持っておく
// そのチェーンでの正史で結果が変わる。→チェーンを切り替えた時の残高が見えるといいかも
import {db, getMyUserPath, getUserBlockPath} from '@/lib/firebase'
import {child, get, push, ref, serverTimestamp, set} from 'firebase/database'
import {Block, convertBlockFromDB, convertBlocks, convertBlockToDB, TxInBlock} from '@/models/block'

export const buildBlock = async (
  userId: string,
  prevId: string,
  txs: TxInBlock[],
  blockHeight: number,
) => {
  try {
    if (!db) return
    const blockRef = ref(db, getUserBlockPath(userId))
    const meRef = ref(db, getMyUserPath(userId))
    // Usersを更新
    await set(meRef, {
      t: serverTimestamp()
    })
    // Blockを作成
    return await push(blockRef, {
      x: txs,
      p: prevId,
      s: serverTimestamp(),
      l: blockHeight
    })
  } catch (error) {
    console.error('Error adding new block', error)
  }
}

// DB -> Store
export const getBlocks = async (userId: string) => {
  try {
    if (!db) return null
    const blockRef = ref(db, getUserBlockPath(userId))
    const blockSnapshot = await get(blockRef)
    if (blockSnapshot.exists()) {
      return convertBlocks(blockSnapshot)
    }
    return null
  } catch (error) {
    console.error('Error get user blocks', error)
  }
}

export const getBlock = async (userId: string, path: string) => {
  try {
    if (!db) return
    const blockRef = child(ref(db, getUserBlockPath(userId)), path)
    const blockSnapshot = await get(blockRef)
    if (blockSnapshot.exists()) {
      const rawData = blockSnapshot.val()
      const rawDataKey = Object.keys(rawData)[0]
      const blockData = {
        id: rawDataKey,
        ...rawData[rawDataKey],
      }
      return convertBlockFromDB(blockData)
    }
    return
  } catch (error) {
    console.error('Error get user block', error)
  }
}

// Store -> DB
export const syncBlock = async (userId: string, block: Block) => {
  try {
    if (!db) return null
    const blockRef = child(ref(db, getUserBlockPath(userId)), block.id)
    await set(blockRef, convertBlockToDB(block))
  } catch (error) {
    console.error('Error sync user block', error)
  }
}

// Store -> DB
export const syncBlocks = async (
  userId: string,
  blocks: Block[]
) => {
  try {
    const promises = blocks.map(async (block) => await syncBlock(userId, block))
    await Promise.all(promises)
    return true
  } catch (error) {
    console.error('Error sync user blocks', error)
  }
}
