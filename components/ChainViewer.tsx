'use client'

import {useAtom} from 'jotai'
import {currentUserState} from '@/stores/users'
import {chainState} from '@/stores/chain'
import {makeTx} from '@/api/transaction'
import React, {useState, useCallback} from 'react'
import Konva from 'konva'
import {Layer, Stage, Image, Group} from 'react-konva'
import useImage from 'use-image'

type Pos = {
  x: number;
  y: number;
}

const ChainViewer = () => {
  const [currentUser] = useAtom(currentUserState)
  const [chain] = useAtom(chainState)

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
      // we need to restore dragging, if it was cancelled by multi-touch
      if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag()
        setDragStopped(false)
      }

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
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

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stagePos.x) / stageScale.x,
          y: (newCenter.y - stagePos.y) / stageScale.x,
        }

        const scale = stageScale.x * (dist / lastDist)

        setStageScale({x: scale, y: scale})

        // calculate new position of the stage
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

  return (
    <div>
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          draggable
          x={stagePos.x}
          y={stagePos.y}
          scaleX={stageScale.x}
          scaleY={stageScale.y}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            {chain.map((block, i) => (
              <Group
                key={`${block.id}-${i}`}
                x={150 + i * 33}
                y={150 + i * 19.5}
              >
                <Image
                  image={beltLineImage}
                  x={0}
                  y={0}
                  width={66}
                  height={48}
                />
                <Image
                  image={blockImage}
                  x={15.5}
                  y={-10}
                  width={35}
                  height={40}
                  onClick={() => console.log(block)}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default ChainViewer
