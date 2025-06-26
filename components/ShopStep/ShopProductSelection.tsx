'use client'

import { useAtom } from 'jotai'
import { selectedProductState } from '@/stores/shop'
import { myBalanceState } from '@/stores/transactions'
import { PRODUCTS } from '@/lib/products'
import { Product } from '@/models/product'
import { toast } from 'react-toastify'
import SupportAgentBlock from '@/components/SupportAgentBlock'

const ProductCard = ({ product, isSelected, onSelect }: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      className={`relative bg-white p-1 rounded-2xl shadow cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col gap-2 border border-[#E5E5E5] p-3 rounded-xl">
        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
          <img className="w-12 h-12" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-sm text-[#484848]">{product.name}</h3>
          <p className="text-xs text-[#666] line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <img src="/images/icons/cnc.svg" alt="" className="w-4 h-4" />
              <span className="text-sm font-bold text-[#3d3d3d]">{product.price.toLocaleString()}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.category === 'digital' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-green-100 text-green-600'
            }`}>
              {product.category === 'digital' ? 'デジタル' : '物理'}
            </span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2">
          <img src="/images/icons/circle_check.svg" alt="選択済み" />
        </div>
      )}
    </div>
  )
}

const ShopProductSelection = () => {
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductState)
  const [myBalance] = useAtom(myBalanceState)

  const handleSelectProduct = (product: Product) => {
    if (product.price > myBalance) {
      toast.error('コインが不足しています')
      return
    }
    setSelectedProduct(product)
  }

  return (
    <div className="flex flex-col gap-4">
      <SupportAgentBlock>
        <div className="font-bold mb-1">サポートエージェント</div>
        <div>
          あなたのコイン残高: <span className="font-bold">{myBalance.toLocaleString()}</span> CNC<br/>
          {/*下記の商品から購入したい商品を選択してください。<br/>*/}
          {/*商品を選択すると、次のステップで送付先情報を入力していただきます。<br/>*/}
          {/*デジタル商品は即座に配信され、物理商品は後日配送されます。*/}
        </div>
      </SupportAgentBlock>

      <div className="grid grid-cols-2 gap-3">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onSelect={() => handleSelectProduct(product)}
          />
        ))}
      </div>
      <p>近日中に商品を追加予定です！</p>
    </div>
  )
}

export default ShopProductSelection
