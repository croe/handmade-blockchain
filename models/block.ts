import {DataSnapshot} from 'firebase/database'

export type TxInBlock = {
  i: string;
  m: number;
}

interface BlockFromDB {
  s: number;
  x: TxInBlock[];
  p: string;
}

interface BlockWithIdFromDB extends BlockFromDB {
  id: string;
}

export type Block = {
  id: string;
  txs: TxInBlock[];
  prevId: string;
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
    timestamp: key.s,
  }))
}

export const convertBlockToDB = (
  block: Block
): BlockFromDB => {
  return {
    s: block.timestamp,
    x: block.txs,
    p: block.prevId,
  }
}
