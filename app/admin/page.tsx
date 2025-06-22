"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { AdminAuth } from "../../components/AdminAuth";
import { exhibitionModeState, persistExhibitionMode } from "../../stores/ui";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exhibitionMode, setExhibitionMode] = useAtom(exhibitionModeState);

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

        {/* ダッシュボードコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 統計カード */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">総ユーザー数</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">総トランザクション数</h3>
            <p className="text-3xl font-bold text-green-600">5,678</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">総ブロック数</h3>
            <p className="text-3xl font-bold text-purple-600">89</p>
          </div>
        </div>

        {/* 管理機能 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ユーザー管理</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                ユーザー一覧を表示
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                ユーザーを検索
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">トランザクション管理</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                トランザクション履歴
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                未承認トランザクション
              </button>
            </div>
          </div>
        </div>

        {/* システム情報 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">システム情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">システムバージョン:</span> 1.0.0
            </div>
            <div>
              <span className="font-medium">最終更新:</span> 2024-01-15
            </div>
            <div>
              <span className="font-medium">データベース状態:</span> 正常
            </div>
            <div>
              <span className="font-medium">メモリ使用量:</span> 64%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 