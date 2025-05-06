import { getUnixTime } from 'date-fns'

export const isValidTimestamp = (timestamp: number) => {
  const currentTime = getUnixTime(new Date()) * 1000
  const timeDifference = currentTime - timestamp;
  return timeDifference <= 10000; // 10秒（10000ミリ秒）以内か判定
}
