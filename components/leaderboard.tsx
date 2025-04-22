"use client"

import { useEffect, useState } from "react"
import { getLeaderboardData } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"

type LeaderboardEntry = {
  id: string
  username: string
  score: number
  rank: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardData()
        setLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <section id="leaderboard" className="w-full py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">トップランキング</h2>

        <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-md overflow-hidden">
          <div className="bg-purple-900 text-white py-4 px-6 flex">
            <div className="w-16 font-semibold">順位</div>
            <div className="flex-1 font-semibold">プレイヤー</div>
            <div className="w-24 text-right font-semibold">スコア</div>
          </div>

          <div className="divide-y">
            {loading ? (
              // ローディング状態
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="py-4 px-6 flex items-center">
                    <div className="w-16">
                      <Skeleton className="h-6 w-10" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="w-24 text-right">
                      <Skeleton className="h-6 w-16 ml-auto" />
                    </div>
                  </div>
                ))
            ) : leaderboard.length > 0 ? (
              // データがある場合
              leaderboard.map((entry) => (
                <div key={entry.id} className="py-4 px-6 flex items-center">
                  <div className="w-16 font-medium">
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `${entry.rank}位`}
                  </div>
                  <div className="flex-1">{entry.username}</div>
                  <div className="w-24 text-right font-semibold">{entry.score.toLocaleString()}</div>
                </div>
              ))
            ) : (
              // データがない場合
              <div className="py-8 text-center text-gray-500">ランキングデータがありません</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
