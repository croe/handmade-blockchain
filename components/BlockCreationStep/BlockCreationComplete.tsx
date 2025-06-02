import BasicButton from '@/components/Button/BasicButton'
import { useRouter } from 'next/navigation'

const BlockCreationComplete = () => {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-[#484848]">
      <img src="/images/icons/block_1.svg" alt="Block Complete" className="w-12 h-12 mb-4"/>
      <h2 className="text-lg font-bold">ブロックの作成が完了しました！</h2>
      <p className="text-sm mt-2 leading-relaxed max-w-[270px] tracking-wide">
        作成したブロックは選択したチェーンの先端に接続されました。<br/>ブロックに格納した取引は成立し取引内容に応じた送金が実行されたことになります。<br/>
        ただし、このブロックが接続されたチェーンが最長のチェーンでない場合はこのブロック及びブロック内の取引は正史としては扱われません。</p>
      <div className="flex flex-col gap-3 mt-3">
        {/*<BasicButton>*/}
        {/*  <span>ブロックを確認する</span>*/}
        {/*  <img src="/images/icons/mini/white/block.svg" className="w-6 h-6" alt="home"/>*/}
        {/*</BasicButton>*/}
        <BasicButton onClick={handleBackToDashboard}>
          <span>ダッシュボードへ戻る</span>
          <img src="/images/icons/mini/white/menu_opened.svg" className="w-5 h-5" alt="home"/>
        </BasicButton>
      </div>
    </div>
  )
}

export default BlockCreationComplete
