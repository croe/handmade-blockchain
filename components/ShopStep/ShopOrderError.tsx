'use client'

import { useAtom } from 'jotai'
import { selectedProductState } from '@/stores/shop'

type Props = {
  error: string;
}

const ShopOrderError = ({ error }: Props) => {
  const [selectedProduct] = useAtom(selectedProductState)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* エラーアイコン */}
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <img src="/images/icons/badge_error.svg" alt="エラー" className="w-12 h-12" />
      </div>

      {/* エラーメッセージ */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#484848]">エラーが発生しました</h2>
        <p className="text-sm text-[#666]">
          申し訳ございませんが、注文処理中にエラーが発生しました。<br/>
          もう一度お試しください。
        </p>
      </div>

      {/* エラー詳細 */}
      <div className="w-full bg-red-50 p-4 rounded-2xl border border-red-200">
        <h3 className="text-sm font-bold text-[#484848] mb-2">エラー詳細</h3>
        <p className="text-xs text-red-600 text-left">{error}</p>
      </div>

      {/* 商品情報（選択されている場合） */}
      {selectedProduct && (
        <div className="w-full bg-white p-4 rounded-2xl border border-[#E5E5E5]">
          <h3 className="text-sm font-bold text-[#484848] mb-2">選択されていた商品</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
              <img className="w-8 h-8" src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-sm text-[#484848]">{selectedProduct.name}</h4>
              <p className="text-xs text-[#666]">{selectedProduct.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <img src="/images/icons/cnc.svg" alt="" className="w-4 h-4" />
              <span className="font-bold text-[#3d3d3d]">{selectedProduct.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 対処法 */}
      <div className="w-full bg-yellow-50 p-4 rounded-2xl">
        <h3 className="text-sm font-bold text-[#484848] mb-2">対処法</h3>
        <ul className="text-xs text-[#666] text-left space-y-1">
          <li>• インターネット接続を確認してください</li>
          <li>• ページを再読み込みしてください</li>
          <li>• コイン残高が十分にあるか確認してください</li>
          <li>• しばらく時間をおいてから再度お試しください</li>
        </ul>
      </div>
    </div>
  )
}

export default ShopOrderError 