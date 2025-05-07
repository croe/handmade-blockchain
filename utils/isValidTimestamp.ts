import { getUnixTime } from 'date-fns'
import { USER_SIGNAL_INTERVAL } from '@/lib/const'

export const isValidTimestamp = (timestamp: number) => {
  const currentTime = getUnixTime(new Date()) * 1000
  const timeDifference = currentTime - timestamp;
  return timeDifference <= USER_SIGNAL_INTERVAL; // 10秒（10000ミリ秒）以内か判定
}
