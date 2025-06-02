'use client'

import TitleHeader from '@/components/TitleHeader'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'

const TxPoolPage = () => {
  return (
    <main>
      <TitleHeader
        title="取引プール"
        help={<HelpButton />}
      />
      <MiniLayout>
      </MiniLayout>
    </main>
  )
}

export default TxPoolPage
