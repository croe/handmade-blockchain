import { atomWithStorage } from 'jotai/utils'
import { User } from '@/models/user'

const options = {
  getOnInit: true,
}

export const usersState = atomWithStorage<User[]>('users', [])

export const currentUserState = atomWithStorage<User | null>('currentUser', null,undefined, options)
