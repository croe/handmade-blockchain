'use client'

import { useAtom } from 'jotai'
import { selectedProductState, orderFormState } from '@/stores/shop'
import SupportAgentBlock from '@/components/SupportAgentBlock'

const ShopRecipientForm = () => {
  const [selectedProduct] = useAtom(selectedProductState)
  const [orderForm, setOrderForm] = useAtom(orderFormState)

  const handleInputChange = (field: 'recipientName' | 'recipientAddress', value: string) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!selectedProduct) return null

  return (
    <div className="flex flex-col gap-4">
      <SupportAgentBlock>
        <div className="font-bold mb-1">サポートエージェント</div>
        <div>
          選択された商品: <span className="font-bold">{selectedProduct.name}</span><br/>
          価格: <span className="font-bold">{selectedProduct.price.toLocaleString()}</span> CNC<br/>
          下記のフォームに送付先情報を入力してください。<br/>
          {selectedProduct.category === 'digital' 
            ? 'デジタル商品のため、メールアドレスを入力してください。' 
            : '物理商品のため、配送先住所を入力してください。'
          }
        </div>
      </SupportAgentBlock>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5]">
        <div className="flex flex-col gap-4">
          {/* 商品情報表示 */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
              <img className="w-8 h-8" src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#484848]">{selectedProduct.name}</h3>
              <p className="text-xs text-[#666]">{selectedProduct.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <img src="/images/icons/cnc.svg" alt="" className="w-4 h-4" />
              <span className="font-bold text-[#3d3d3d]">{selectedProduct.price.toLocaleString()}</span>
            </div>
          </div>

          {/* 送付先フォーム */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#484848] mb-2">
                {selectedProduct.category === 'digital' ? '受取人メールアドレス' : '受取人氏名'}
              </label>
              <input
                type={selectedProduct.category === 'digital' ? 'email' : 'text'}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={selectedProduct.category === 'digital' ? 'example@email.com' : '山田 太郎'}
                value={orderForm.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#484848] mb-2">
                {selectedProduct.category === 'digital' ? '確認用メールアドレス' : '配送先住所'}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder={
                  selectedProduct.category === 'digital' 
                    ? 'example@email.com' 
                    : '〒123-4567\n東京都渋谷区○○○○ 1-2-3'
                }
                value={orderForm.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopRecipientForm 