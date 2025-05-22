'use client'

import {useAtom} from 'jotai'
import {currentUserState} from '@/stores/users'
import {chainState, chainsState} from '@/stores/chain'
import {makeTx} from '@/api/transaction'
import React, {useState, useCallback} from 'react'
import Konva from 'konva'
import {Layer, Stage, Image, Group} from 'react-konva'
import useImage from 'use-image'

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

type Pos = {
  x: number;
  y: number;
}

window.Konva.hitOnDragEnabled = true;

const BLOCK_SPACING_X = 66 // ブロック間の水平方向の間隔
const BLOCK_SPACING_Y = 48 // チェーン間の垂直方向の間隔
const BLOCK_WIDTH = 35
const BLOCK_HEIGHT = 40
const BELT_WIDTH = 66
const BELT_HEIGHT = 48

const ChainViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [chain] = useAtom(chainState)
  const [chains] = useAtom(chainsState)

  const [stagePos, setStagePos] = useState<Pos>({x: 0, y: 0})
  const [stageScale, setStageScale] = useState<Pos>({x: 1, y: 1})
  const [lastCenter, setLastCenter] = useState<Pos | null>(null)
  const [lastDist, setLastDist] = useState(0)
  const [dragStopped, setDragStopped] = useState(false)

  const [blockImage] = useImage('/images/icons/block_1.svg')
  const [beltLineImage] = useImage('/images/icons/belt_line_1.svg')

  const getDistance = (p1: Pos, p2: Pos) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  const getCenter = (p1: Pos, p2: Pos): Pos => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    }
  }

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      e.evt.preventDefault()
      const touch1 = e.evt.touches[0]
      const touch2 = e.evt.touches[1]
      const stage = e.target.getStage()

      if (!stage) return
      if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag()
        setDragStopped(false)
      }

      if (touch1 && touch2) {
        if (stage.isDragging()) {
          stage.stopDrag()
          setDragStopped(true)
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        } as Pos
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        } as Pos

        if (!lastCenter) {
          setLastCenter(getCenter(p1, p2))
          return
        }
        const newCenter = getCenter(p1, p2)

        const dist = getDistance(p1, p2)

        if (!lastDist) {
          setLastDist(dist)
          return
        }

        const pointTo = {
          x: (newCenter.x - stagePos.x) / stageScale.x,
          y: (newCenter.y - stagePos.y) / stageScale.x,
        }

        const scale = stageScale.x * (dist / lastDist)

        setStageScale({x: scale, y: scale})

        const dx = newCenter.x - lastCenter.x
        const dy = newCenter.y - lastCenter.y

        setStagePos({
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        })

        setLastDist(dist)
        setLastCenter(newCenter)
      }
    }, [dragStopped, lastCenter, lastDist, stagePos, stageScale])

  const handleTouchEnd = () => {
    setLastDist(0)
    setLastCenter(null)
  }

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
      // const systemTx: TxInBlock = {
      //   i: txKey.key,
      //   m: 100,
      // }
    }

  console.log(chains)

  return (
    <div>
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 10}
          draggable
          x={stagePos.x}
          y={stagePos.y}
          scaleX={stageScale.x}
          scaleY={stageScale.y}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            {chains.map((chain, chainIndex) => (
              <Group key={`chain-${chainIndex}`}>
                {chain.blocks.map((block, blockIndex) => (
                  <Group
                    key={`${block.id}-${blockIndex}`}
                    x={150 + blockIndex * BLOCK_SPACING_X}
                    y={150 + chainIndex * BLOCK_SPACING_Y}
                  >
                    <Image
                      image={beltLineImage}
                      x={0}
                      y={0}
                      width={BELT_WIDTH}
                      height={BELT_HEIGHT}
                    />
                    <Image
                      image={blockImage}
                      x={15.5}
                      y={-10}
                      width={BLOCK_WIDTH}
                      height={BLOCK_HEIGHT}
                      onClick={() => console.log(block)}
                    />
                  </Group>
                ))}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default ChainViewer
