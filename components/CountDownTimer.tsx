'use client'

import Countdown, {zeroPad} from 'react-countdown'
import { useEffect, useState } from 'react'
import { useBlockCreation } from '@/hooks/useBlockCreation'

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
      <>
        <p className="text-xs font-black whitespace-nowrap">ブロック作成できます！</p>
        <p className="text-[29px] font-black">{zeroPad(minutes)}m{zeroPad(seconds)}s</p>
      </>
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

const CountDownTimer = () => {
  const { getNextBlockTime } = useBlockCreation()
  const [targetDate, setTargetDate] = useState<number>(getNextBlockTime())

  useEffect(() => {
    setTargetDate(getNextBlockTime())
  }, [getNextBlockTime])

  return (
    <div className="min-w-32 text-[#3842FF] flex flex-col items-center justify-center">
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  )
}

export default CountDownTimer
