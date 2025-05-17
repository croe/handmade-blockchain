import {DataSnapshot} from 'firebase/database'

interface TransactionFromDB {
  f: string;
  t: string;
  s: number;
}

interface TransactionWithIdFromDB extends TransactionFromDB {
  id: string;
}

export type Transaction = {
  id: string;
  from: string;
  to: string;
  timestamp: number;
}

export type TxWithValue = Transaction & {
  amount: number;
}

export const convertTxs = (
  snapshot: DataSnapshot
): Transaction[] => {
  if (!snapshot.exists()) return []
  const rawData = snapshot.val();
  const dataArray: TransactionWithIdFromDB[] = Object.keys(rawData).map(key => ({
    id: key, // Firebaseのキーをidとして保持
    ...rawData[key] as TransactionFromDB
  }));
  return convertTxsFromDB(dataArray)
}

const convertTxsFromDB = (
  db: TransactionWithIdFromDB[]
): Transaction[] => {
  return db.map(key => ({
    id: key.id,
    from: key.f,
    to: key.t,
    timestamp: key.s,
  }))
}

export const convertTxFromDB = (
  db: TransactionWithIdFromDB
): Transaction => {
  return {
    id: db.id,
    from: db.f,
    to: db.t,
    timestamp: db.s,
  }
}

export const convertTxToDB = (
  tx: Transaction
): TransactionFromDB => {
  return {
    f: tx.from,
    t: tx.to,
    s: tx.timestamp,
  }
}
