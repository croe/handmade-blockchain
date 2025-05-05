"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, remove, off, DataSnapshot, serverTimestamp, set } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Play, Send } from 'lucide-react'
import {useCurrentUser} from '@/hooks/useCurrentUser'

interface TestDataItemFromDB {
  text: string;
  timestamp: number;
}

interface TestDataItem extends TestDataItemFromDB {
  id: string; // key を id として持つ
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<TestDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the transaction form
  const [transactionFrom, setTransactionFrom] = useState<string>("");
  const [transactionTo, setTransactionTo] = useState<string>("");
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);

  const currentUser = useCurrentUser()
  console.log(currentUser)

  // データ取得と監視
  useEffect(() => {

    // db が初期化されていない場合は何もしない
    if (!db) {
      setError("Firebase is not configured correctly.");
      setLoading(false);
      return;
    }

    const dataRef = ref(db, 'testData'); // '/testData' パスへの参照

    // データ変更時のコールバック
    const handleValueChange = (snapshot: DataSnapshot) => {
      const rawData = snapshot.val();
      if (rawData) {
        // Firebaseから取得したデータを扱いやすい配列形式に変換
        const dataArray: TestDataItem[] = Object.keys(rawData).map(key => ({
          id: key, // Firebaseのキーをidとして保持
          ...rawData[key] as TestDataItemFromDB
        }));
        // タイムスタンプで降順（新しい順）にソート
        dataArray.sort((a, b) => b.timestamp - a.timestamp);
        setData(dataArray);
        setError(null); // エラーをクリア
      } else {
        setData([]); // データがない場合
      }
      setLoading(false);
    };

    // エラー発生時のコールバック
    const handleError = (err: Error) => {
        console.error("Firebase read error:", err);
        setError("Failed to load data from Firebase.");
        setLoading(false);
    };

    // データの購読を開始
    const unsubscribe = onValue(dataRef, handleValueChange, handleError);

    // コンポーネントのアンマウント時に購読を解除
    return () => {
      // onValue によって返された unsubscribe 関数を使うか、
      // リスナー関数を特定して off を呼び出す
      // unsubscribe(); // これでも OK
      off(dataRef, 'value', handleValueChange);
    };
  }, []); // db の参照が変わることはないので、空の依存配列

  // データ追加処理
  const handleAddItem = async () => {
    if (!inputText.trim() || !db) return; // 入力が空かdbがなければ何もしない

    const dataRef = ref(db, 'testData');
    const newItem = {
      text: inputText.trim(),
      timestamp: serverTimestamp() // Firebaseサーバーのタイムスタンプを使用
    };

    try {
      await push(dataRef, newItem); // pushで新しいユニークIDを生成してデータを追加
      setInputText(""); // 入力フィールドをクリア
      setError(null); // エラーをクリア
    } catch (err) {
      console.error("Firebase write error:", err);
      setError("Failed to add data to Firebase.");
    }
  };

  // データ削除処理
  const handleDeleteItem = async (id: string) => {
    if (!db) return;

    const itemRef = ref(db, `testData/${id}`); // 削除対象のデータへの参照

    try {
      await remove(itemRef); // removeでデータを削除
      setError(null); // エラーをクリア
      // データは onValue で自動的に更新されるので、ここで setData を呼ぶ必要はないのだ
    } catch (err) {
      console.error("Firebase delete error:", err);
      setError("Failed to delete data from Firebase.");
    }
  };

  // 初期データの追加処理
  const handleAddInitialData = async () => {
    if (!db) return;

    const dataRef = ref(db, 'testData');
    const initialData = {
      "initial-1": { text: "First sample item", timestamp: serverTimestamp() },
      "initial-2": { text: "Second sample item", timestamp: serverTimestamp() },
      "initial-3": { text: "Third sample item", timestamp: serverTimestamp() },
    };

    try {
      // set でデータを上書き (既存データは消える)
      await set(dataRef, initialData);
      setError(null);
      console.log("Initial data added/overwritten successfully.");
    } catch (err) {
      console.error("Firebase set error (initial data):", err);
      setError("Failed to add initial data.");
    }
  };

  // Transaction data add process
  const handleAddTransaction = async () => {
    // Basic validation
    const amount = parseFloat(transactionAmount);
    if (!transactionFrom.trim() || !transactionTo.trim() || isNaN(amount) || amount <= 0) {
      setTransactionError("Please fill in all fields with valid data (amount must be positive).");
      return;
    }
    if (!db) {
        setTransactionError("Firebase is not configured correctly.");
        return;
    }

    setTransactionLoading(true); // Start loading
    setTransactionError(null); // Clear previous errors

    const transactionRef = ref(db, 'transactions'); // Path for transactions
    // Save in TransactionFromDB format
    const newTransaction = {
      f: transactionFrom.trim(),
      t: transactionTo.trim(),
      m: amount,
      s: serverTimestamp() // Use Firebase server timestamp
    };

    try {
      await push(transactionRef, newTransaction);
      // Clear the form
      setTransactionFrom("");
      setTransactionTo("");
      setTransactionAmount("");
      setTransactionError(null); // Clear error on success
    } catch (err) {
      console.error("Firebase write error (transaction):", err);
      setTransactionError("Failed to add transaction to Firebase.");
    } finally {
      setTransactionLoading(false); // End loading
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 py-8">
      {/* Firebase RTDB サンプルセクション */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Firebase RTDB Sample</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* データ追加フォーム */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!db || loading}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()} // Enterキーでも追加
            />
            <Button onClick={handleAddItem} disabled={!inputText.trim() || !db || loading}> {/* trim() で空白のみの入力を無効化 */}
              Add Data
            </Button>
          </div>

           {/* 初期データ追加ボタン */}
           <Button variant="outline" onClick={handleAddInitialData} disabled={!db || loading}>
             <Play className="mr-2 h-4 w-4" /> Add/Reset Initial Data
           </Button>

          {/* データ表示エリア */}
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && db && (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {data.length === 0 ? (
                 <p className="text-gray-500">No data yet.</p>
              ) : (
                data.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-2 border rounded bg-white dark:bg-gray-800">
                    <span className="flex-1 mr-2 break-words">{item.text}
                       <span className="block text-xs text-gray-400">({new Date(item.timestamp).toLocaleString()})</span>
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} disabled={loading}> {/* handleDeleteItemを呼び出す */}
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))
              )}
            </ul>
          )}
           {!db && !loading && <p className="text-orange-500">Firebase is not configured correctly.</p>}
        </CardContent>
      </Card>

      {/* Transaction Form Section */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="From Address"
              value={transactionFrom}
              onChange={(e) => setTransactionFrom(e.target.value)}
              disabled={!db || transactionLoading}
            />
            <Input
              type="text"
              placeholder="To Address"
              value={transactionTo}
              onChange={(e) => setTransactionTo(e.target.value)}
              disabled={!db || transactionLoading}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              disabled={!db || transactionLoading}
              min="0"
              step="any"
            />
          </div>
          {transactionError && <p className="text-red-500 text-sm">{transactionError}</p>}
          <Button
            onClick={handleAddTransaction}
            disabled={!transactionFrom.trim() || !transactionTo.trim() || !transactionAmount || !db || transactionLoading}
            className="w-full"
          >
            {transactionLoading ? "Adding..." : <> <Send className="mr-2 h-4 w-4" /> Add Transaction </>}
          </Button>
           {!db && <p className="text-orange-500 text-sm">Firebase is not configured correctly.</p>}
        </CardContent>
      </Card>

      {/* Keep the existing TestData Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Data List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data addition form for TestData (keeping it separate for now) */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter text for TestData"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!db || loading}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button onClick={handleAddItem} disabled={!inputText.trim() || !db || loading}>
              Add Test Data
            </Button>
          </div>

           {/* Initial data button for TestData */}
           <Button variant="outline" onClick={handleAddInitialData} disabled={!db || loading}>
             <Play className="mr-2 h-4 w-4" /> Add/Reset Initial Test Data
           </Button>

          {/* Data display area for TestData */}
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && db && (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {data.length === 0 ? (
                 <p className="text-gray-500">No test data yet.</p>
              ) : (
                data.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-2 border rounded bg-white dark:bg-gray-800">
                    <span className="flex-1 mr-2 break-words">{item.text}
                       <span className="block text-xs text-gray-400">({new Date(item.timestamp).toLocaleString()})</span>
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))
              )}
            </ul>
          )}
           {!db && !loading && <p className="text-orange-500">Firebase is not configured correctly.</p>}
        </CardContent>
      </Card>
    </main>
  )
}
