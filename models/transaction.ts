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

export const convertTransactions = (
  db: DataSnapshot
): Transaction[] => {
  const rawData = db.val();
  console.log(rawData)
  const dataArray: TransactionWithIdFromDB[] = Object.keys(rawData).map(key => ({
    id: key, // Firebaseのキーをidとして保持
    ...rawData[key] as TransactionFromDB
  }));
  return convertTransactionsFromDB(dataArray)
}

const convertTransactionsFromDB = (
  db: TransactionWithIdFromDB[]
): Transaction[] => {
  return db.map(key => ({
    id: key.id,
    from: key.f,
    to: key.t,
    timestamp: key.s,
  }))
}
