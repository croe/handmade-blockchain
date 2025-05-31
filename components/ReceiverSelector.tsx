'use client'

import BasicButton from '@/components/Button/BasicButton'
import {useAtom} from 'jotai'
import {usersState} from '@/stores/users'
import {generateReadableId, getAvatarForId} from '@/utils/id-to-readable-string'

type Props = {
  open?: boolean
  requestClose?: () => void
  setReceiverId?: (id: string) => void
}

const ReceiverSelector = ({open, requestClose, setReceiverId}:Props) => {
  const [users] = useAtom(usersState)

  const handleSelectReceiver = (id: string) => {
    if (setReceiverId) {
      setReceiverId(id)
    }
    if (requestClose) {
      requestClose()
    }
  }

  return (
    <div className={`fixed top-0 right-0 h-full w-full flex flex-col bg-black bg-opacity-60
     items-center justify-center transform ${open ? '-translate-y-0' : 'translate-y-full'}
     transition-transform duration-300 ease-in-out z-20 flex flex-col overflow-y-scroll`}>
      <div className="w-[330px] flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-1 max-h-[400px]">
          <div className="border border-[#E5E5E5] py-8 px-4 h-full overflow-hidden rounded-xl">
            <h2 className="flex gap-1 items-center pb-2 border-b border-[#484848]">
              <img src="/images/icons/mini/gray/profile.svg" alt="" className="w-6 h-6"/>
              <span>送り先の指定</span>
            </h2>
            <ul className="overflow-y-scroll mt-3 h-full pb-5">
              {users.map((user) => (
              <li key={user.id}
                  className="flex items-center gap-2 py-2 hover:bg-[#F0F0F0] cursor-pointer border-b border-[#E5E5E5]"
                  onClick={() => handleSelectReceiver(user.id)}
              >
                <img className="w-8 h-8 rounded-full" src={getAvatarForId(user.id)} alt=""/>
                <span className="text-[#484848] text-sm">{generateReadableId(user.id)}</span>
              </li>))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center">
          <BasicButton variant="error" onClick={requestClose}>
            <span>閉じる</span>
            <img src="/images/icons/mini/white/close.svg" className="w-5 h-5" alt="close" />
          </BasicButton>
        </div>
      </div>
    </div>
  )
}

export default ReceiverSelector
