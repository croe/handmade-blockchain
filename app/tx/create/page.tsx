'use client'

import { useEffect, useRef } from 'react'
import * as fabric from 'fabric'

const TxCreatePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current === null) return
    const canvas = new fabric.Canvas(canvasRef.current)
    const pencil = new fabric.PencilBrush(canvas);
    pencil.color = "#000000";
    pencil.width = 3
    canvas.freeDrawingBrush = pencil;
    canvas.isDrawingMode = true;
    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-black">
      <h1 className="text-2xl font-bold">Create Transaction</h1>
      <p className="mt-4 text-lg">This page is under construction.</p>
      <canvas className="border" width="300" height="100" ref={canvasRef} />
    </div>
  )
}

export default TxCreatePage
