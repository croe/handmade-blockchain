import BasicButton from '@/components/Button/BasicButton'
import { useRouter } from 'next/navigation'
import SupportAgentBlock from '@/components/SupportAgentBlock'

const BlockCreationComplete = () => {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-[#484848]">
      <img src="/images/icons/block_1.svg" alt="Block Complete" className="w-12 h-12 mb-4"/>
      <h2 className="text-lg font-bold mb-8">ブロックの作成が完了しました！</h2>
      <SupportAgentBlock>
        ブロックの作成が完了しました！<br />
        作成したブロックははじめに選択したチェーンの先端に接続されました。<br />
        ブロックに格納した取引は成立し、取引内容に応じた送金が実行されたことになります。 ウォレットを確認してみましょう。<br />
        ただし、このブロックが接続されたチェーンが最長のチェーンでない場合、またはこの先最長でなった場合は、このブロック及びブロック内の取引は正史としては扱われません。<br />
        ブロックチェーンはプレイヤーがブロックをどこに接続したかによって絶えずその形を変容させます。<br />
        定期的にチェックし、自身に有効な戦略を考えましょう。
      </SupportAgentBlock>
      <div className="flex flex-col gap-3 mt-3">
        <BasicButton onClick={handleBackToDashboard}>
          <span>ダッシュボードへ戻る</span>
          <img src="/images/icons/mini/white/menu_opened.svg" className="w-5 h-5" alt="home"/>
        </BasicButton>
      </div>
    </div>
  )
}

export default BlockCreationComplete
