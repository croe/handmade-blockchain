// Firebase Realtime Database の設定と関数

import {initializeApp} from 'firebase/app'
import {getAnalytics} from 'firebase/analytics'
import {getDatabase, ref, get, query, orderByChild, limitToLast, set, serverTimestamp} from 'firebase/database'

// Firebaseの設定
// 注: 実際の値は.envファイルに保存し、環境変数として使用することをお勧めします
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebase初期化
let app
let database
let analytics

// サーバーサイドレンダリング対応のための初期化
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
    analytics = getAnalytics(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

// ランキングデータを取得する関数
export async function getLeaderboardData(limit = 10) {
  if (!database) {
    // テスト用のダミーデータを返す（Firebase未設定時）
    return [
      {id: '1', username: 'プレイヤー1', score: 9850, rank: 1},
      {id: '2', username: 'プレイヤー2', score: 8720, rank: 2},
      {id: '3', username: 'プレイヤー3', score: 7650, rank: 3},
      {id: '4', username: 'プレイヤー4', score: 6540, rank: 4},
      {id: '5', username: 'プレイヤー5', score: 5430, rank: 5},
    ]
  }

  try {
    const leaderboardRef = ref(database, 'leaderboard')
    const leaderboardQuery = query(leaderboardRef, orderByChild('score'), limitToLast(limit))

    const snapshot = await get(leaderboardQuery)

    if (snapshot.exists()) {
      const data = snapshot.val()

      // オブジェクトを配列に変換し、スコアでソート
      const leaderboardArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))

      // スコアの降順でソート
      leaderboardArray.sort((a, b) => b.score - a.score)

      // ランク付け
      return leaderboardArray.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    throw error
  }
}

// ゲームデータを保存する関数
export async function saveGameScore(userId, username, score) {
  if (!database) return false

  try {
    const userScoreRef = ref(database, `leaderboard/${userId}`)
    await set(userScoreRef, {
      username,
      score,
      timestamp: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error('Error saving game score:', error)
    return false
  }
}

export default {getLeaderboardData, saveGameScore}
