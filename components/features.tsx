import { Gamepad2, Trophy, Users, Zap } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Gamepad2 className="h-10 w-10 text-purple-500" />,
      title: "没入型ゲームプレイ",
      description: "直感的なコントロールと美しいグラフィックで、没入感のあるゲーム体験を提供します。",
    },
    {
      icon: <Users className="h-10 w-10 text-purple-500" />,
      title: "マルチプレイヤー",
      description: "友達と一緒にプレイして、リアルタイムで競争しましょう。",
    },
    {
      icon: <Trophy className="h-10 w-10 text-purple-500" />,
      title: "ランキングシステム",
      description: "世界中のプレイヤーとスコアを競い合い、トップに立ちましょう。",
    },
    {
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      title: "定期的なアップデート",
      description: "新しいレベル、キャラクター、機能を定期的に追加しています。",
    },
  ]

  return (
    <section id="features" className="w-full py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">ゲームの特徴</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
