const BlockCreationComplete = () => {

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <img src="/images/icons/block_complete.svg" alt="Block Complete" className="w-24 h-24 mb-4"/>
        <h2 className="text-2xl font-bold">ブロックの作成が完了しました！</h2>
        <p className="text-gray-600 mt-2">新しいブロックがチェーンに追加されました。</p>
      </div>
    </div>
  )
}

export default BlockCreationComplete
