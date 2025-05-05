interface TransactionFromDB {
  f: string;
  t: string;
  m: number;
  s: number;
}

interface TransactionWithIdFromDB extends TransactionFromDB {
  id: string;
}

export type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

const convertTransactionFromDB = (
  db: TransactionWithIdFromDB
): TransactionWithIdFromDB => {
  // const dataArray: TestDataItem[] = Object.keys(rawData).map(key => ({
  //   id: key, // Firebaseのキーをidとして保持
  //   ...rawData[key] as TestDataItemFromDB
  // }));
  return {
    // id: db.id,
    ...db,
  }
}

const convertTransaction = (
  db: TransactionWithIdFromDB
): Transaction => {
  return {
    id: db.id,
    from: db.f,
    to: db.t,
    amount: db.m,
    timestamp: db.s,
  }
}
