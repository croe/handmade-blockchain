'use client'

import { currentUserState } from '@/stores/users'
import { useAtom } from 'jotai'
import SplashImage from '@/assets/images/splash.svg'
import {getUnixTime} from 'date-fns'
import {addNewUser} from '@/api/user'
import {useRouter} from 'next/navigation'

export default function Home() {
  const [currentUser, setCurrentUser] = useAtom(currentUserState)
  const router = useRouter()

  const handleCreateWallet = async () => {
    // FIXME: ここタイムスタンプの持ち方がサーバーとクライアントで違うので考える
    if (currentUser) {
      router.push('/dashboard')
      return
    } else {
      const timestamp = getUnixTime(new Date())
      const user = await addNewUser()
      console.log(user)
      if (user?.key) {
        setCurrentUser({
          id: user.key,
          timestamp: timestamp,
          status: true,
        })
      }
      router.push('/dashboard')
    }
  }

  return (
    <main className="w-full min-h-screen">
      <div className="cursor-pointer" onClick={handleCreateWallet}>
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <img className="w-[250px] animate-fadeIn" src={SplashImage.src} alt=""/>
        </div>
        <div className="fixed bottom-24 left-0 w-full">
          <p className="font-black text-center text-[#6B73FF] animate-fadeIn-delay-1s">Tap To Start</p>
        </div>
      </div>
    </main>
  )
}
