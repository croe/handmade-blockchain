'use client'

import { useEffect, useRef, useState } from 'react'
import {useAtomValue, useSetAtom} from 'jotai'
import { currentUserState } from '@/stores/users'
import * as fabric from 'fabric'
import { Eraser, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { storage } from '@/lib/firebase'
import { ref, uploadString } from 'firebase/storage'
import {getTxs, makeTx} from '@/api/transaction'
import {txsState} from '@/stores/transactions'

const TxCreatePage = () => {
  // FIXME: 手数料を入れないと無限に作られてしまう問題？（ミスったら入れられないからいいか）
  // 意外と👆の問題が根深そう、っていうか作るもの多いな...
  const [loading, setLoading] = useState<boolean>(false)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const currentUser = useAtomValue(currentUserState)
  const setTxs = useSetAtom(txsState)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = new fabric.Canvas(canvasRef.current)
    setCanvas(canvas)
    const pencil = new fabric.PencilBrush(canvas);
    pencil.color = "#000000";
    pencil.width = 3
    canvas.freeDrawingBrush = pencil;
    canvas.isDrawingMode = true;
    return () => {
      canvas.dispose()
    }
  }, [])

  const handleEraserClick = () => canvas?.clear()
  const handleSaveClick = async () => {
    if (!currentUser) return
    if (!canvas) return
    const tx = await makeTx(currentUser.id, currentUser.id, 'test')
    if (!tx) return
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 0.5,
      multiplier: 2,
    });
    const storageRef = ref(storage, `tx_amounts/${tx.key}.png`)
    uploadString(storageRef, dataUrl, 'data_url').then((snapshot) => {
      console.log('Uploaded a base64 string!')
      canvas.clear()
    }).catch((error) => {
      console.error(error)
    })
    const myTxs = await getTxs(currentUser.id)
    if (myTxs) {
      setTxs(myTxs.flatMap(e => e != null ? e : []))
    }
  }

  return (
    <div className="w-full h-screen text-black">
      <div className="w-4/5 p-4 border-2 flex flex-col text-sm mx-auto mt-20">
        <p className="mb-4 flex gap-3">
          <span>To: </span>
          <span className="text-gray-500"></span>
        </p>
        <div className="flex justify-center">
          <div className="relative w-[300px] h-[100px]">
            <canvas className="border" width="300" height="100" ref={canvasRef} />
            <button
              className="absolute bottom-0 right-0 text-gray-500 p-1"
              onClick={handleEraserClick}
            >
              <Eraser size={20} />
            </button>
          </div>
        </div>
        <p className="mt-4 text-right flex gap-3 justify-end">
          <span>From:</span>
          <span className="text-gray-500">{currentUser?.id}</span>
        </p>
      </div>
      <div className="w-full flex justify-center mt-10">
        <button onClick={handleSaveClick}>
          {loading ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            <span>SAVE</span>
          )}
        </button>
      </div>
      <p className="text-center mt-10"><Link href={`/dashboard`}>HOME</Link></p>
    </div>
  )
}

export default TxCreatePage
