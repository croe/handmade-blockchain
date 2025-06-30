"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { AdminAuth } from "../../components/AdminAuth";
import { exhibitionModeState, persistExhibitionMode } from "../../stores/ui";
import { currentUserState } from "../../stores/users";
import { chainState } from "../../stores/chain";
import { makeTx } from "../../api/transaction";
import {buildBlock, getBlocks} from '@/api/block'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exhibitionMode, setExhibitionMode] = useAtom(exhibitionModeState);
  const [currentUser] = useAtom(currentUserState);
  const [chain] = useAtom(chainState);
  const [isCreatingGenesis, setIsCreatingGenesis] = useState(false);

  useEffect(() => {
    // ページロード時に認証状態をチェック
    const authenticated = localStorage.getItem("adminAuthenticated") === "true";
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  const handleToggleExhibitionMode = () => {
    const newMode = !exhibitionMode;
    setExhibitionMode(newMode);
    persistExhibitionMode(newMode);
  };

  const handleCreateGenesisBlock = async () => {
    if (chain.length > 0) {
      alert('ジェネシスブロックは既に存在します');
      return;
    }
    if (!currentUser) {
      alert('ユーザーが設定されていません');
      return;
    }

    setIsCreatingGenesis(true);
    try {
      const txKey = await makeTx(currentUser.id, 'genesis', currentUser.id);
      if (txKey?.key) {
        alert('ジェネシスブロック用のトランザクションが作成されました');
      } else {
        alert('トランザクションの作成に失敗しました');
        return
      }
      // ここでジェネシスブロックを作成する処理を追加
      const txs = [{
        i: txKey!.key,
        m: 1000000,
      }]
      await buildBlock(
        currentUser.id,
        'genesis',
        txs,
        0 // ジェネシスブロックはブロック高さ0
      )

    } catch (error) {
      console.error('Error creating genesis transaction:', error);
      alert('ジェネシスブロック作成中にエラーが発生しました');
    } finally {
      setIsCreatingGenesis(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* 展示モード切り替え */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">展示モード設定</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${exhibitionMode ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span className="text-lg font-medium text-gray-700">展示モード</span>
              </div>
              <span className="text-sm text-gray-500">
                {exhibitionMode ? 'ON - 制限機能が有効です' : 'OFF - 全ての機能が利用可能です'}
              </span>
            </div>
            <button
              onClick={handleToggleExhibitionMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                exhibitionMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  exhibitionMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            展示モードがONの場合、ブロック作成、トランザクション作成、ウォレット管理、ショップなどの機能が制限されます。
          </div>
        </div>

        {/* ジェネシスブロック作成 */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">ジェネシスブロック作成</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                ブロックチェーンの最初のブロック（ジェネシスブロック）を作成します
              </p>
              <p className="text-sm text-gray-500">
                現在のブロック数: {chain.length}個
              </p>
            </div>
            <button
              onClick={handleCreateGenesisBlock}
              disabled={chain.length > 0 || !currentUser || isCreatingGenesis}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                chain.length > 0 || !currentUser || isCreatingGenesis
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isCreatingGenesis ? '作成中...' : 'ジェネシスブロック作成'}
            </button>
          </div>
          {chain.length > 0 && (
            <p className="mt-2 text-sm text-orange-600">
              ※ ジェネシスブロックは既に作成済みです
            </p>
          )}
        </div>

        {/* システム情報 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">システム情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">システムバージョン:</span> 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
