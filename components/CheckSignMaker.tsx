'use client'

import {useEffect, useRef, useState} from 'react'
import * as fabric from 'fabric'

type Props = {
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas | null) => void
}

const CheckSignMaker = ({canvas, setCanvas}:Props) => {
  let isRedoing = false
  const [canvasHistory, setCanvasHistory] = useState<fabric.Object[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    console.log('canvasRef', canvasRef.current)
    if (canvasRef.current === null) return
    const _canvas = new fabric.Canvas(canvasRef.current)
    setCanvas(_canvas)
    const pencil = new fabric.PencilBrush(_canvas);
    pencil.color = "#000000"
    pencil.width = 2
    _canvas.backgroundColor = "#FFFFFF"
    _canvas.freeDrawingBrush = pencil
    _canvas.isDrawingMode = true
    return () => {
      _canvas.dispose()
    }
  }, [])

  useEffect(() => {
    canvas?.on('object:added', () => {
      isRedoing = false
    })
    canvas?.on('object:removed', (e) => {
      if (!isRedoing && e.target) {
        setCanvasHistory(prev => [...prev, e.target!])
      }
    })
  }, [canvas])

  const handlePenClick = () => {
    if (!canvas) return;
    canvas.isDrawingMode = true;
    const pencil = new fabric.PencilBrush(canvas);
    pencil.color = "#000000";
    pencil.width = 2;
    canvas.freeDrawingBrush = pencil;
  }

  const handleEraserClick = () => {
    if (!canvas) return;
    canvas.isDrawingMode = true;
    const eraser = new fabric.PencilBrush(canvas);
    eraser.color = "#FFFFFF";
    eraser.width = 20;
    canvas.freeDrawingBrush = eraser;
  }

  const handleClearClick = () => canvas?.clear()

  const handleUndoClick = () => {
    if (canvas) {
      const lastAction = canvas.getObjects().pop();
      if (lastAction) {
        canvas.remove(lastAction);
        canvas.renderAll();
      }
    }
  }
  const handleRedoClick = () => {
    if (canvas && canvasHistory.length > 0) {
      isRedoing = true
      const lastHistory = canvasHistory[canvasHistory.length - 1]
      canvas.add(lastHistory)
      setCanvasHistory(prev => prev.slice(0, -1))
      canvas.renderAll()
    }
  }

  return (
    <div>
      <p className="flex gap-1 text-[#999] items-center text-xs mb-1">
        <img src="/images/icons/mini/gray/pen.svg" alt="pen" className="w-5 h-5"/>
        <span>取引内容を書く</span>
      </p>
      <div className="w-[300px]">
        <div className="relative w-[300px] h-[100px] border rounded-xl border-[#DADADA] bg-white overflow-hidden">
          <canvas className="rounded-xl" width="300" height="100" ref={canvasRef} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4">
            <button onClick={handlePenClick}>
              <img src="/images/icons/circle_pen.svg" alt="pen" className="w-8 h-8"/>
            </button>
            <button onClick={handleEraserClick}>
              <img src="/images/icons/circle_eraser.svg" alt="eraser" className="w-8 h-8"/>
            </button>
            <button onClick={handleUndoClick}>
              <img src="/images/icons/circle_undo.svg" alt="undo" className="w-8 h-8"/>
            </button>
            <button onClick={handleRedoClick}>
              <img src="/images/icons/circle_redo.svg" alt="redo" className="w-8 h-8"/>
            </button>
          </div>
          <button onClick={handleClearClick}>
            <img src="/images/icons/circle_delete.svg" alt="clear" className="w-8 h-8"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckSignMaker
