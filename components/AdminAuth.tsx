"use client";

import { useState } from "react";
import BasicButton from "./Button/BasicButton";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 簡易的なパスワード（本番環境では環境変数やより安全な方法を使用すべき）
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // パスワードチェック（実際の実装ではサーバーサイドで行うべき）
    if (password === ADMIN_PASSWORD) {
      // 認証成功時の処理
      localStorage.setItem("adminAuthenticated", "true");
      onAuthSuccess();
    } else {
      setError("パスワードが正しくありません");
    }

    setIsLoading(false);
  };

  const handleButtonClick = () => {
    // フォームのsubmitイベントを手動で発火
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            管理者認証
          </h2>
          <p className="text-gray-600">
            管理者ページにアクセスするにはパスワードを入力してください
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="パスワードを入力"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <BasicButton
            onClick={handleButtonClick}
            className="w-full"
          >
            {isLoading ? "認証中..." : "ログイン"}
          </BasicButton>
        </form>
      </div>
    </div>
  );
} 