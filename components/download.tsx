import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"

export default function Download() {
  return (
    <section id="download" className="w-full py-20 bg-purple-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">今すぐダウンロード</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          iOS と Android で利用可能。今すぐダウンロードして冒険を始めましょう！
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-black hover:bg-gray-800 flex items-center gap-2">
            <Apple size={24} />
            <div className="flex flex-col items-start">
              <span className="text-xs">Download on the</span>
              <span className="text-lg font-semibold">App Store</span>
            </div>
          </Button>

          <Button size="lg" className="bg-black hover:bg-gray-800 flex items-center gap-2">
            <Play size={24} />
            <div className="flex flex-col items-start">
              <span className="text-xs">GET IT ON</span>
              <span className="text-lg font-semibold">Google Play</span>
            </div>
          </Button>
        </div>
      </div>
    </section>
  )
}
