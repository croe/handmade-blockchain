import { atom  } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { User } from '@/models/user'

const options = {
  getOnInit: true,
}

export const usersState　= atomWithStorage<User[]>('users_v2', [])

export const currentUserState
  = atomWithStorage<User | null>('currentUser', null,undefined, options)
