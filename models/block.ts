import {DataSnapshot} from 'firebase/database'

export type TxInBlock = {
  i: string;
  m: number;
}

interface BlockFromDB {
  s: number;
  x: TxInBlock[];
  p: string;
  l: number;
}

interface BlockWithIdFromDB extends BlockFromDB {
  id: string;
}

export type Block = {
  id: string;
  txs: TxInBlock[];
  prevId: string;
  blockHeight: number;
  timestamp: number;
}

export const convertBlocks = (
  snapshot: DataSnapshot
): Block[] => {
  if (!snapshot.exists()) return []
  const rawData = snapshot.val()
  const dataArray: BlockWithIdFromDB[] = Object.keys(rawData).map(key => ({
    id: key,
    ...rawData[key] as BlockFromDB
  }))
  return convertBlocksFromDB(dataArray)
}

const convertBlocksFromDB = (
  db: BlockWithIdFromDB[]
): Block[] => {
  return db.map(key => ({
    id: key.id,
    txs: key.x,
    prevId: key.p,
    blockHeight: key.l,
    timestamp: key.s,
  }))
}

export const convertBlockFromDB = (
  db: BlockWithIdFromDB
): Block => {
  return {
    id: db.id,
    txs: db.x,
    prevId: db.p,
    blockHeight: db.l,
    timestamp: db.s,
  }
}

export const convertBlockToDB = (
  block: Block
): BlockFromDB => {
  return {
    s: block.timestamp,
    x: block.txs,
    l: block.blockHeight,
    p: block.prevId,
  }
}
