'use client'

import Image from 'next/image'

type Props = {
  children?: React.ReactNode
}

// サポートエージェントの吹き出しコンポーネント
const SupportAgentBlock = ({children}: Props) => {
  return (
    <div className="flex items-start mb-8">
      <div className="min-w-[38px] mr-3">
        <Image src="/images/icons/agent.svg" alt="サポートエージェント" width={48} height={65}/>
      </div>
      <div className="bg-white border border-gray-300 rounded-xl p-4 text-gray-700 text-sm shadow-sm">
        {children}
      </div>
    </div>

  )
}

export default SupportAgentBlock
