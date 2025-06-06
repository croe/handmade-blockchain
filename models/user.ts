import {DataSnapshot} from 'firebase/database'

interface UserFromDB {
  t: number;
  s: number;
}

interface UserWithIdFromDB extends UserFromDB {
  id: string;
}

export type User = {
  id: string;
  timestamp: number;
  status: boolean;
}

export const convertUsers = (
  db: DataSnapshot
): User[] => {
  const rawData = db.val();
  const dataArray: UserWithIdFromDB[] = Object.keys(rawData).map(key => ({
    id: key, // Firebaseのキーをidとして保持
    ...rawData[key] as UserFromDB
  }));
  return convertUsersFromDB(dataArray)
}

export const convertUsersFromDB = (
  db: UserWithIdFromDB[]
): User[] => {
  return db.map(key => ({
    id: key.id,
    timestamp: key.t,
    status: !!key.s
  }))
}

export const convertUser = (
  db: DataSnapshot
): User => {
  const rawData = db.val()
  return {
    id: db.key || '',
    timestamp: rawData.t,
    status: !!rawData.s,
  }
}
