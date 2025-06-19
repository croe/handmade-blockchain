'use client'

import { useAtom } from 'jotai'
import { selectedProductState, orderFormState } from '@/stores/shop'
import SupportAgentBlock from '@/components/SupportAgentBlock'

const ShopOrderCheck = () => {
  const [selectedProduct] = useAtom(selectedProductState)
  const [orderForm] = useAtom(orderFormState)

  if (!selectedProduct) return null

  return (
    <div className="flex flex-col gap-4">
      <SupportAgentBlock>
        <div className="font-bold mb-1">サポートエージェント</div>
        <div>
          注文内容の最終確認です。<br/>
          下記の内容で間違いがないかご確認ください。<br/>
          確認後、「注文を確定する」ボタンを押して注文を完了してください。
        </div>
      </SupportAgentBlock>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5]">
        <div className="flex flex-col gap-4">
          {/* 商品情報 */}
          <div>
            <h3 className="text-sm font-bold text-[#484848] mb-2">商品情報</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                <img className="w-8 h-8" src={selectedProduct.imageUrl} alt={selectedProduct.name} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#484848]">{selectedProduct.name}</h4>
                <p className="text-xs text-[#666]">{selectedProduct.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  selectedProduct.category === 'digital' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {selectedProduct.category === 'digital' ? 'デジタル商品' : '物理商品'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/images/icons/cnc.svg" alt="" className="w-4 h-4" />
                <span className="font-bold text-[#3d3d3d]">{selectedProduct.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 送付先情報 */}
          <div>
            <h3 className="text-sm font-bold text-[#484848] mb-2">送付先情報</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-[#666]">
                  {selectedProduct.category === 'digital' ? 'メールアドレス' : '受取人氏名'}:
                </span>
                <span className="text-sm font-medium text-[#484848]">{orderForm.recipientName}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-[#666]">
                  {selectedProduct.category === 'digital' ? '確認用メール' : '配送先住所'}:
                </span>
                <span className="text-sm font-medium text-[#484848] break-all">{orderForm.recipientAddress}</span>
              </div>
            </div>
          </div>

          {/* 支払い情報 */}
          <div>
            <h3 className="text-sm font-bold text-[#484848] mb-2">支払い情報</h3>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
              <span className="text-sm text-[#484848]">支払い金額:</span>
              <div className="flex items-center gap-1">
                <img src="/images/icons/cnc.svg" alt="" className="w-5 h-5" />
                <span className="text-lg font-bold text-[#3d3d3d]">{selectedProduct.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="p-3 bg-yellow-50 rounded-xl">
            <h4 className="text-sm font-bold text-[#484848] mb-1">注意事項</h4>
            <ul className="text-xs text-[#666] space-y-1">
              {selectedProduct.category === 'digital' ? (
                <>
                  <li>• デジタル商品は注文確定後、即座にメールで配信されます</li>
                  <li>• メールアドレスは正確に入力してください</li>
                  <li>• 一度確定した注文はキャンセルできません</li>
                </>
              ) : (
                <>
                  <li>• 物理商品は後日配送されます</li>
                  <li>• 配送には3-5営業日かかります</li>
                  <li>• 配送状況は別途メールでお知らせします</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopOrderCheck 