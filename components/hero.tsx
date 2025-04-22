import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-purple-900 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            あなたの冒険が
            <br />
            今始まる
          </h1>
          <p className="text-xl text-gray-300">
            最高のモバイルゲーム体験をお楽しみください。新しい世界を探索し、友達と競い合いましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              今すぐダウンロード
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-900"
            >
              詳細を見る
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div className="relative w-64 h-[500px]">
            <Image
              src="/placeholder.svg?height=500&width=250"
              alt="ゲームのスクリーンショット"
              width={250}
              height={500}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
