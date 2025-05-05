interface UserFromDB {
  t: number;
}

interface UserWithIdFromDB extends UserFromDB {
  id: string;
}

export type User = {
  id: string;
  timestamp: number;
}

export const convertUserFromDB = (
  db: UserWithIdFromDB
): UserWithIdFromDB => {
  return {
    ...db,
  }
}

export const convertUser = (
  db: UserWithIdFromDB
): User => {
  return {
    id: db.id,
    timestamp: db.t,
  }
}
