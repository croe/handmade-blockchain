// Firebase Realtime Database の設定と関数

import { initializeApp, getApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getStorage } from 'firebase/storage'

export const DB_USER = 'users'
export const DB_TRANSACTION = 'txs'
export const DB_BLOCK = 'blocks'

export const PUBLIC_BUCKET = 'https://storage.googleapis.com/handmade-blockchain.firebasestorage.app/'
export const TX_AMOUNT_BUCKET = 'tx_amounts'

// .env.local ファイルなどから読み込む想定 (Next.js)
// クライアントサイドで使うため NEXT_PUBLIC_ プレフィックスが必要
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// apiKey など必須項目がない場合はエラーを投げるか、デフォルト値を設定するなど考慮が必要
// 今回はサンプルなので、環境変数が設定されている前提で進めるのだ
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL || !firebaseConfig.projectId) {
  console.error("Firebase の設定が環境変数に正しく設定されていません。");
  // ここで処理を中断するか、デフォルトの動作を決める必要があるのだ
}

// Firebase App の重複初期化を防ぐ
let app;
if (!getApps().length) {
  // 必須項目が設定されている場合のみ初期化する
  if (firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  } else {
    // 設定がない場合のフォールバック処理（例：エラー表示や何もしない）
    console.error("Firebase アプリを初期化できませんでした。設定を確認してください。");
  }
} else {
  app = getApp();
}

// db も app が正常に初期化された場合のみ取得する
const db = app ? getDatabase(app) : null;

// Storage の初期化
const storage = getStorage()

// db が null の可能性があるので、利用側でチェックが必要なのだ
export { db, storage };
