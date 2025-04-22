import Hero from "@/components/hero"
import Features from "@/components/features"
import Screenshots from "@/components/screenshots"
import Download from "@/components/download"
import Leaderboard from "@/components/leaderboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <Features />
      <Screenshots />
      <Leaderboard />
      <Download />
    </main>
  )
}
