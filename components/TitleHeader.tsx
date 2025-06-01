'use client'

import BackButton from '@/components/Button/BackButton'

type Props = {
  title?: string
  subtitle?: string
  help?: React.ReactNode
}

const TitleHeader = ({title, subtitle, help}: Props) => {
  return (
    <div className="flex h-32 items-center pl-20">
      <BackButton />
      <div className="flex flex-col px-3 w-full font-bold text-[#484848]">
        {subtitle && <span className="text-xs text-[#8C8C8C] font-bold">{subtitle}</span>}
        <span>{title}</span>
      </div>
      <div className="flex items-center justify-center w-20">
        {help}
      </div>
    </div>
  )
}

export default TitleHeader
