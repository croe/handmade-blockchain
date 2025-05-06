import { PUBLIC_BUCKET } from '@/lib/firebase'

export const getBucketImage = (bucket: string, path: string, format: string) => {
  return `${PUBLIC_BUCKET}${bucket}/${path}.${format}`
}
