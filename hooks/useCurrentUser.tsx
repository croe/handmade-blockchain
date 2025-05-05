import { useAtom } from 'jotai'
import { currentUserState } from '@/stores/users'
import { addNewUser } from '@/api/user'
import { useEffect } from 'react'
import { getUnixTime } from 'date-fns'

export const useCurrentUser = () => {
  // 雑だけどここでuserがなければ作成しちゃうか
  const [currentUser, setCurrentUser] = useAtom(currentUserState)
  useEffect(() => {
    console.log(currentUser)
    const createMyWallet = async () => {
      const timestamp = getUnixTime(new Date())
      const user = await addNewUser(timestamp)
      console.log(user)
      if (user?.key) {
        setCurrentUser({
          id: user.key,
          timestamp: timestamp,
        })
      }
    }
    if (!currentUser) {
      createMyWallet()
    }
  }, [currentUser])

  return currentUser
}

// transactionに署名＝サイン入れる？（似せることできちゃうよねぇ）
// passwordを決められるとか？それをその人しか知らない情報
// 誰かが自分になり変わるのを防ぎたい -> まあ今回はここは考えないでいいか
// 秘密のパスワードみたいな、復帰パスがあってもいいかも
