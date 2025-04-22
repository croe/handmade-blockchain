import Link from "next/link"
import { Mountain, Twitter, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Mountain size={24} />
              <span className="text-xl font-bold">ゲームタイトル</span>
            </Link>
            <p className="text-gray-400">最高のモバイルゲーム体験をお届けします。</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-purple-400 transition">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-purple-400 transition">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-purple-400 transition">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition">
                  特徴
                </Link>
              </li>
              <li>
                <Link href="#screenshots" className="text-gray-400 hover:text-white transition">
                  スクリーンショット
                </Link>
              </li>
              <li>
                <Link href="#download" className="text-gray-400 hover:text-white transition">
                  ダウンロード
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">サポート</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">ニュースレター</h3>
            <p className="text-gray-400 mb-4">最新情報を受け取る</p>
            <form className="flex">
              <input
                type="email"
                placeholder="メールアドレス"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md transition">
                登録
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ゲームタイトル. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
