'use client'

import { useAtom } from 'jotai'
import { selectedProductState, orderFormState } from '@/stores/shop'
import Link from 'next/link'
import BasicButton from '@/components/Button/BasicButton'

const ShopOrderComplete = () => {
  const [selectedProduct] = useAtom(selectedProductState)
  const [orderForm] = useAtom(orderFormState)

  if (!selectedProduct) return null

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* 成功アイコン */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <img src="/images/icons/badge_success.svg" alt="成功" className="w-12 h-12" />
      </div>

      {/* 完了メッセージ */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#484848]">注文が完了しました！</h2>
        <p className="text-sm text-[#666]">
          ご注文ありがとうございます。<br/>
          注文番号: <span className="font-mono font-bold">{Date.now().toString(36).toUpperCase()}</span>
        </p>
      </div>

      {/* 注文詳細 */}
      <div className="w-full bg-white p-4 rounded-2xl border border-[#E5E5E5]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
              <img className="w-8 h-8" src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-sm text-[#484848]">{selectedProduct.name}</h3>
              <p className="text-xs text-[#666]">{selectedProduct.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <img src="/images/icons/cnc.svg" alt="" className="w-4 h-4" />
              <span className="font-bold text-[#3d3d3d]">{selectedProduct.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">送付先:</span>
              <span className="font-medium text-[#484848]">{orderForm.recipientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">支払い金額:</span>
              <span className="font-medium text-[#484848]">{selectedProduct.price.toLocaleString()} CNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* 次のステップ */}
      <div className="w-full bg-blue-50 p-4 rounded-2xl">
        <h3 className="text-sm font-bold text-[#484848] mb-2">次のステップ</h3>
        {selectedProduct.category === 'digital' ? (
          <p className="text-xs text-[#666] text-left">
            • デジタル商品は即座に <span className="font-medium">{orderForm.recipientName}</span> に配信されました<br/>
            • メールをご確認ください<br/>
            • ご不明な点がございましたら、サポートまでお問い合わせください
          </p>
        ) : (
          <p className="text-xs text-[#666] text-left">
            • 物理商品は後日配送されます<br/>
            • 配送状況は <span className="font-medium">{orderForm.recipientName}</span> にメールでお知らせします<br/>
            • 配送には3-5営業日かかります
          </p>
        )}
      </div>

      {/* ボタン */}
      <div className="w-full">
        <Link href="/dashboard">
          <BasicButton className="w-full">
            <span className="text-base">ダッシュボードに戻る</span>
            <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="next"/>
          </BasicButton>
        </Link>
      </div>
    </div>
  )
}

export default ShopOrderComplete 