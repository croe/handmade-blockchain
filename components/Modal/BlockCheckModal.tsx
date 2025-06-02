'use client'

import BasicModal from '@/components/Modal/BasicModal'
import {useAtom} from 'jotai'
import {usersState} from '@/stores/users'
import {generateReadableId, getAvatarForId} from '@/utils/id-to-readable-string'

type Props = {
  open?: boolean
  requestClose?: () => void
}

const BlockCheckModal = ({open, requestClose}:Props) => {
  const [users] = useAtom(usersState)

  const handleSelectReceiver = (id: string) => {
    if (requestClose) {
      requestClose()
    }
  }

  return (
    <BasicModal
      title="送り先の指定"
      icon={<img src="/images/icons/mini/gray/profile.svg" alt="" className="w-6 h-6"/>}
      open={open}
      requestClose={requestClose}
    >
      {users.map((user) => (
        <div key={user.id}
             className="flex items-center gap-2 py-2 hover:bg-[#F0F0F0] cursor-pointer border-b border-[#E5E5E5]"
             onClick={() => handleSelectReceiver(user.id)}
        >
          <img className="w-8 h-8 rounded-full" src={getAvatarForId(user.id)} alt=""/>
          <span className="text-[#484848] text-sm">{generateReadableId(user.id)}</span>
        </div>))}
    </BasicModal>
  )
}

export default BlockCheckModal
