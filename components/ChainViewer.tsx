'use client'

import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { chainState } from '@/stores/chain'
import { TxInBlock } from '@/models/block'
import { makeTx } from '@/api/transaction'
import { buildBlock } from '@/api/block'

const ChainViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [chain] = useAtom(chainState)

  /**
   * 分岐をどうロジックで出すかが大変そう
   * Heightで並び替えつつ、チェーンごとに配列化、つながる点で繋げる
   */

  // Genesis blockを作成する一時的な関数
  const handleTemporalMakeGenesisBlock = async () => {
    if (chain.length > 0) return
    if (!currentUser) return
    const txKey = await makeTx(currentUser.id, 'reward', currentUser.id)
    console.log(txKey, !txKey?.key)
    if (!txKey?.key) return
    const systemTx: TxInBlock = {
      i: txKey.key,
      m: 100,
    }
    // const blockKey = await buildBlock(currentUser.id, '', [systemTx])
    // console.log(blockKey)
  }

  return (
    <div className="w-4/5 mx-auto px-4 py-2 text-black border-2">
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {chain.map((block) => (
          <li key={block.id}
              className="flex item-center justify-between p-2 border rounded bg-white"
          >
            <span className="flex-1 mr-2 break-words">
              <span className="block text-xs text-gray-400">{block.prevId}</span>
              <span className="block text-xs text-gray-400">{block.id}</span>
              <span className="block text-xs text-gray-400">{new Date(block.timestamp).toLocaleString()}</span>
            </span>
          </li>
        ))}
      </ul>
      {/*<button onClick={handleTemporalMakeGenesisBlock}>GENESIS BLOCK</button>*/}
    </div>
  )
}

export default ChainViewer
