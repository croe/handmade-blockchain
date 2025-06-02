'use client'

import { useAtom} from 'jotai'
import {branchedChainsState, forkedPointsState, selectedBlockState} from '@/stores/chain'
import { useState, useCallback } from 'react'
import Konva from 'konva'
import { Layer, Stage, Image, Group } from 'react-konva'
import useImage from 'use-image'
import { Block } from '@/models/block'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

type Pos = {
  x: number;
  y: number;
}

window.Konva.hitOnDragEnabled = true

const BLOCK_SPACING_X = 66 // ブロック間の水平方向の間隔
const BLOCK_SPACING_Y = 38.6 // チェーン間の垂直方向の間隔
const BLOCK_WIDTH = 35
const BLOCK_HEIGHT = 40
const BELT_WIDTH = 66
const BELT_HEIGHT = 48
const TIP_WIDTH = 35
const TIP_HEIGHT = 40

const ChainViewer = () => {
  const router = useRouter()
  const [chains] = useAtom(branchedChainsState)
  const [forkedPoints] = useAtom(forkedPointsState)
  const [_, setSelectedBlock] = useAtom(selectedBlockState)

  const [stagePos, setStagePos] = useState<Pos>({x: 0, y: 0})
  const [stageScale, setStageScale] = useState<Pos>({x: 1, y: 1})
  const [lastCenter, setLastCenter] = useState<Pos | null>(null)
  const [lastDist, setLastDist] = useState(0)
  const [dragStopped, setDragStopped] = useState(false)

  const [blockImage] = useImage('/images/icons/block_1.svg')
  const [unblockImage] = useImage('/images/icons/unblock.svg')

  const [beltLine1Image] = useImage('/images/icons/belt_l1.svg')
  const [beltLine2Image] = useImage('/images/icons/belt_l2.svg')
  const [beltSplit1Image] = useImage('/images/icons/belt_s1.svg')
  const [beltSplit2Image] = useImage('/images/icons/belt_s2.svg')
  const [beltCorner1Image] = useImage('/images/icons/belt_c1.svg')

  const [tipMakeImage] = useImage('/images/icons/tip_block_make.svg')

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

  const handleSelectBlock = useCallback((block: Block) => {
    console.log(`Selected block ID: ${block.id}`)
    // ここでブロックの詳細情報を表示する
    // 例えば、モーダルを開くなどの処理を追加できます
  }, [])

  const handleMakeNewBlock = useCallback((block: Block) => {
    console.log(block)
    setSelectedBlock(block)
    router.push('/block/create')
  }, [])

  // Genesis blockを作成する一時的な関数
  // const handleTemporalMakeGenesisBlock = async () => {
  //     if (chain.length > 0) return
  //     if (!currentUser) return
  //     const txKey = await makeTx(currentUser.id, 'reward', currentUser.id)
  //     console.log(txKey, !txKey?.key)
  //     if (!txKey?.key) return
  //     // const systemTx: TxInBlock = {
  //     //   i: txKey.key,
  //     //   m: 100,
  //     // }
  //   }

  console.log(chains)
  console.log(forkedPoints)

  return (
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
          <Group key={`chain-${chainIndex}`}
                 x={chainIndex !== 0
                   ? chains[chainIndex - 1]?.blocks[0]?.blockHeight === chain.blocks[0].blockHeight
                     ? (chain.blocks[0].blockHeight * BLOCK_SPACING_X) - BLOCK_SPACING_X
                     : (chain.blocks[0].blockHeight * BLOCK_SPACING_X) - BLOCK_SPACING_X
                   : 0}
                 y={chainIndex !== 0
                   ? chains[chainIndex - 1]?.blocks[0]?.blockHeight === chain.blocks[0].blockHeight
                     ? (chain.blocks[0].blockHeight * BLOCK_SPACING_Y) + BLOCK_SPACING_Y
                     : (chain.blocks[0].blockHeight * BLOCK_SPACING_Y) + BLOCK_SPACING_Y
                   : 0}
          >
            {chain.blocks.map((block, blockIndex) => {
                if (chainIndex === 0) {
                  return (
                    <Group
                      key={`${block.id}-${blockIndex}`}
                      x={blockIndex * BLOCK_SPACING_X}
                      y={blockIndex * BLOCK_SPACING_Y}
                    >
                      <Image
                        image={forkedPoints.includes(blockIndex) ? beltSplit1Image : beltLine1Image}
                        x={0}
                        y={0}
                        width={BELT_WIDTH}
                        height={BELT_HEIGHT}
                      />
                      <Image
                        image={beltLine1Image}
                        x={BLOCK_SPACING_X / 2}
                        y={BLOCK_SPACING_Y / 2}
                        width={BELT_WIDTH}
                        height={BELT_HEIGHT}
                      />
                      <Image
                        image={blockImage}
                        x={15.5 + BLOCK_SPACING_X / 2}
                        y={-10 + BLOCK_SPACING_Y / 2}
                        width={BLOCK_WIDTH}
                        height={BLOCK_HEIGHT}
                        onClick={() => handleSelectBlock(block)}
                        onTouchEnd={() => handleSelectBlock(block)}
                      />
                    </Group>
                  )
                }
                if (chainIndex > 0) {
                  if (blockIndex === 0) {
                    // 最長チェーン以外で複数の分岐が同じブロックから起こる場合
                    if (block.blockHeight === chains[chainIndex + 1]?.blocks[0]?.blockHeight) {
                      console.log('同一ブロック複数分岐')
                      // chains[chainIndex - 1]?.blocks[0]?.blockHeight === block.blockHeightがない場合、分岐の最初のチェーンなので、遠くする＆そこまでつなげる
                      return (
                        <Group
                          key={`${block.id}-${blockIndex}`}
                          x={blockIndex * BLOCK_SPACING_X}
                          y={blockIndex * BLOCK_SPACING_Y}
                        >
                          <Image
                            image={beltLine2Image}
                            x={BLOCK_SPACING_X / 2}
                            y={BLOCK_SPACING_Y / -2}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={beltSplit2Image}
                            x={0}
                            y={0}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={beltLine1Image}
                            x={BLOCK_SPACING_X / 2}
                            y={BLOCK_SPACING_Y / 2}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={blockImage}
                            x={15.5 + BLOCK_SPACING_X / 2}
                            y={-10 + BLOCK_SPACING_Y / 2}
                            width={BLOCK_WIDTH}
                            height={BLOCK_HEIGHT}
                            onClick={() => handleSelectBlock(block)}
                            onTouchEnd={() => handleSelectBlock(block)}
                          />
                        </Group>
                      )
                    } else {
                      // 分岐する最初のブロック
                      return (
                        <Group
                          key={`${block.id}-${blockIndex}`}
                          x={blockIndex * BLOCK_SPACING_X}
                          y={blockIndex * BLOCK_SPACING_Y}
                        >
                          <Image
                            image={beltLine2Image}
                            x={BLOCK_SPACING_X / 2}
                            y={BLOCK_SPACING_Y / -2}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={beltCorner1Image}
                            x={0}
                            y={0}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={beltLine1Image}
                            x={BLOCK_SPACING_X / 2}
                            y={BLOCK_SPACING_Y / 2}
                            width={BELT_WIDTH}
                            height={BELT_HEIGHT}
                          />
                          <Image
                            image={blockImage}
                            x={15.5 + BLOCK_SPACING_X / 2}
                            y={-10 + BLOCK_SPACING_Y / 2}
                            width={BLOCK_WIDTH}
                            height={BLOCK_HEIGHT}
                            onClick={() => handleSelectBlock(block)}
                            onTouchEnd={() => handleSelectBlock(block)}
                          />
                        </Group>
                      )
                    }
                  }
                }
                return (
                  <Group
                    key={`${block.id}-${blockIndex}`}
                    x={blockIndex * BLOCK_SPACING_X}
                    y={blockIndex * BLOCK_SPACING_Y}
                  >
                    <Image
                      image={beltLine1Image}
                      x={0}
                      y={0}
                      width={BELT_WIDTH}
                      height={BELT_HEIGHT}
                    />
                    <Image
                      image={beltLine1Image}
                      x={BLOCK_SPACING_X / 2}
                      y={BLOCK_SPACING_Y / 2}
                      width={BELT_WIDTH}
                      height={BELT_HEIGHT}
                    />
                    <Image
                      image={blockImage}
                      x={15.5 + BLOCK_SPACING_X / 2}
                      y={-10 + BLOCK_SPACING_Y / 2}
                      width={BLOCK_WIDTH}
                      height={BLOCK_HEIGHT}
                      onClick={() => handleSelectBlock(block)}
                      onTouchEnd={() => handleSelectBlock(block)}
                    />
                  </Group>
                )
              },
            )}
            {/* 最新ブロックの後に新しいブロックを追加 */}
            {chain.blocks.length > 0 && (
              <Group
                key={`next-block-${chainIndex}`}
                x={(chain.blocks.length) * BLOCK_SPACING_X}
                y={(chain.blocks.length) * BLOCK_SPACING_Y}
              >
                <Image
                  image={beltLine1Image}
                  x={0}
                  y={0}
                  width={BELT_WIDTH}
                  height={BELT_HEIGHT}
                  opacity={0.5}
                />
                <Image
                  image={beltLine1Image}
                  x={BLOCK_SPACING_X / 2}
                  y={BLOCK_SPACING_Y / 2}
                  width={BELT_WIDTH}
                  height={BELT_HEIGHT}
                  opacity={0.5}
                />
                <Group
                  x={15.5 + BLOCK_SPACING_X / 2}
                  y={-10 + BLOCK_SPACING_Y / 2}
                  onClick={() => handleMakeNewBlock(chain.blocks[chain.blocks.length - 1])}
                  onTouchEnd={() => handleMakeNewBlock(chain.blocks[chain.blocks.length - 1])}
                >
                  <Image
                    image={unblockImage}
                    x={0}
                    y={0}
                    width={BLOCK_WIDTH}
                    height={BLOCK_HEIGHT}
                  />
                  <Image
                    image={tipMakeImage}
                    x={0}
                    y={-24}
                    width={TIP_WIDTH}
                    height={TIP_HEIGHT}
                  />
                </Group>
              </Group>
            )}
          </Group>
        ))}
      </Layer>
    </Stage>
  )
}

export default ChainViewer
