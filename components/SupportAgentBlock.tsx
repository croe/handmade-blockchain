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
        <Image src="/images/icons/support_agent.png" alt="サポートエージェント" width={48} height={65}/>
      </div>
      <div>
        <h3 className="font-bold mb-1 text-xs">サポートエージェント</h3>
        <div className="bg-white border border-[#8C8C8C] rounded-xl p-4 text-gray-700 text-sm shadow-sm rounded-tl-none">
          {children}
        </div>
      </div>
    </div>

  )
}

export default SupportAgentBlock
