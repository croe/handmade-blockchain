'use client'

import Countdown, {zeroPad} from 'react-countdown'
import { useEffect, useState } from 'react'
import { useBlockCreation } from '@/hooks/useBlockCreation'

type Props = {
  onClickCreateBlock: () => void
}

interface CountdownRendererProps {
  minutes: number
  seconds: number
  completed: boolean
}

const renderer = ({ minutes, seconds, completed }: CountdownRendererProps) => {
  // Render a countdown
  if (completed) {
    // Render a completed state
    return (
      <div className="relative">
        <img className="absolute -top-10 h-10 -left-1" src="/images/icons/popup_block_creation.svg" alt=""/>
        <p className="text-xs font-black whitespace-nowrap">ブロック作成できます！</p>
        <p className="text-[29px] font-black">{zeroPad(minutes)}m{zeroPad(seconds)}s</p>
      </div>
    )
  } else {
    // Render a countdown
    return (
      <>
        <p className="text-xs font-black">ブロック作成可能まで</p>
        <p className="text-[29px] font-black">{zeroPad(minutes)}m{zeroPad(seconds)}s</p>
      </>
    )
  }
}

const CountDownTimer = ({ onClickCreateBlock }: Props) => {
  const { getNextBlockTime } = useBlockCreation()
  const [targetDate, setTargetDate] = useState<number>(getNextBlockTime())

  useEffect(() => {
    setTargetDate(getNextBlockTime())
  }, [getNextBlockTime])

  return (
    <div className="min-w-32 text-[#3842FF] flex flex-col items-center justify-center" onClick={onClickCreateBlock}>
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  )
}

export default CountDownTimer
