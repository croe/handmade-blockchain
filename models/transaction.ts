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
  image?: string;
}

export const convertTransaction = (
  db: DataSnapshot
): Transaction[] => {
  const rawData = db.val();
  const dataArray: TransactionWithIdFromDB[] = Object.keys(rawData).map(key => ({
    id: key, // Firebaseのキーをidとして保持
    ...rawData[key] as TransactionFromDB
  }));
  return convertTransactionFromDB(dataArray)
}

const convertTransactionFromDB = (
  db: TransactionWithIdFromDB[]
): Transaction[] => {
  return db.map(key => ({
    id: key.id,
    from: key.f,
    to: key.t,
    timestamp: key.s,
  }))
}
