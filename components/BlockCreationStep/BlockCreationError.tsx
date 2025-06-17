import { AlertCircle } from 'lucide-react'

type BlockCreationErrorProps = {
  error: string
}

const BlockCreationError = ({ error }: BlockCreationErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="w-6 h-6" />
        <h2 className="text-xl font-bold">エラーが発生しました</h2>
      </div>
      <p className="text-gray-700">{error}</p>
    </div>
  )
}

export default BlockCreationError 