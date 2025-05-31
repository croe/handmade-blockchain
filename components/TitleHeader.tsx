'use client'

import BackButton from '@/components/Button/BackButton'

type Props = {
  title?: string
  help?: React.ReactNode
}

const TitleHeader = ({title, help}: Props) => {
  return (
    <div className="flex h-32 items-center pl-20">
      <BackButton />
      <div className="px-3 w-full font-bold text-[#484848]">
        {title}
      </div>
      <div className="flex items-center justify-center w-20">
        {help}
      </div>
    </div>
  )
}

export default TitleHeader
