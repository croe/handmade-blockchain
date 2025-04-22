import Image from "next/image"

export default function Screenshots() {
  const screenshots = [
    { src: "/placeholder.svg?height=600&width=300", alt: "ゲームプレイ画面1" },
    { src: "/placeholder.svg?height=600&width=300", alt: "ゲームプレイ画面2" },
    { src: "/placeholder.svg?height=600&width=300", alt: "ゲームプレイ画面3" },
    { src: "/placeholder.svg?height=600&width=300", alt: "ゲームプレイ画面4" },
  ]

  return (
    <section id="screenshots" className="w-full py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">ゲームスクリーンショット</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg hover:scale-105 transition duration-300">
              <Image
                src={screenshot.src || "/placeholder.svg"}
                alt={screenshot.alt}
                width={300}
                height={600}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
