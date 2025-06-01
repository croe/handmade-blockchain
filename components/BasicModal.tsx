'use client'

import BasicButton from '@/components/Button/BasicButton'

type Props = {
  open?: boolean
  requestClose?: () => void
  children?: React.ReactNode
  title: string
  icon?: React.ReactNode
}

const BasicModal = ({open, requestClose, children, title, icon}:Props) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full flex flex-col bg-black bg-opacity-60
     items-center justify-center transform ${open ? '-translate-y-0' : 'translate-y-full'}
     transition-transform duration-300 ease-in-out z-20 flex flex-col overflow-y-scroll`}>
      <div className="w-[330px] flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-1 max-h-[450px]">
          <div className="border border-[#E5E5E5] py-8 px-4 h-full overflow-hidden rounded-xl">
            <h2 className="flex gap-1 items-center pb-2 border-b border-[#484848]">
              {icon && (icon)}
              <span>{title}</span>
            </h2>
            <div className="overflow-y-scroll mt-3 h-full pb-5">
              {children}
            </div>
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

export default BasicModal
