'use client'

import { useAtom } from 'jotai'
import { syncedChainState, selectedBlockState } from '@/stores/chain'
import {Block} from '@/models/block'

const BlockSelector = () => {
  const [selectedBlock, setSelectedBlock] = useAtom(selectedBlockState)
  const [chain] = useAtom(syncedChainState)

  const handleSelectBlock = (block: Block) => {
    setSelectedBlock(block)
  }

  return (
    <div className="max-w-screen-sm mx-auto">
      <div>
        <h2 className="font-bold mb-2">List</h2>
        <div className="flex flex-col">
          {chain.map((block) => (
            <div key={block.id}
                 className="w-10 flex flex-col items-center justify-center mx-auto"
                 onClick={() => handleSelectBlock(block)}
            >
              {block.prevId !== '' && (
                <div className="w-[1px] h-3 bg-gray-400" />
              )}
              <div className="w-10 h-10 bg-gray-400 flex items-center">
                <p className="truncate text-[7px] text-white">{block.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <h2 className="font-bold mb-2">Selected</h2>
        {selectedBlock && (
          <div className="text-sm text-gray-500">
            <p>ID: {selectedBlock.id}</p>
            <p>Prev: {selectedBlock.prevId}</p>
            <p>{new Date(selectedBlock.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlockSelector
