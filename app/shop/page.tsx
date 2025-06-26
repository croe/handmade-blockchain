'use client'

import { useState } from 'react'
import TitleHeader from '@/components/TitleHeader'
import BottomBar from '@/components/BottomBar'
import BasicButton from '@/components/Button/BasicButton'
import BackCircleButton from '@/components/Button/BackCircleButton'
import HelpButton from '@/components/Button/HelpButton'
import MiniLayout from '@/components/MiniLayout'
import { useAtom } from 'jotai/index'
import { currentUserState } from '@/stores/users'
import { myBalanceState } from '@/stores/transactions'
import { selectedProductState, orderFormState } from '@/stores/shop'
import { toast } from 'react-toastify'
import { makeTx } from '@/api/transaction'
import ShopProductSelection from '@/components/ShopStep/ShopProductSelection'
import ShopRecipientForm from '@/components/ShopStep/ShopRecipientForm'
import ShopOrderCheck from '@/components/ShopStep/ShopOrderCheck'
import ShopOrderComplete from '@/components/ShopStep/ShopOrderComplete'
import ShopOrderError from '@/components/ShopStep/ShopOrderError'
import { Loader } from 'lucide-react'
import ExhibitionModeRestriction from '@/components/ExhibitionModeRestriction'

type Step = 'product-selection' | 'recipient-form' | 'order-check' | 'complete' | 'error'

type StepInfo = {
  title: string
  subtitle: string
  stepNumber: number
  totalSteps: number
  buttonText: string
  canGoBack: boolean
}

const STEP_INFO: Record<Step, StepInfo> = {
  'product-selection': {
    title: '商品の選択',
    subtitle: 'ショップ STEP 1/4',
    stepNumber: 1,
    totalSteps: 4,
    buttonText: '送付先情報入力へ',
    canGoBack: false
  },
  'recipient-form': {
    title: '送付先情報の入力',
    subtitle: 'ショップ STEP 2/4',
    stepNumber: 2,
    totalSteps: 4,
    buttonText: '注文内容確認へ',
    canGoBack: true
  },
  'order-check': {
    title: '注文内容の確認',
    subtitle: 'ショップ STEP 3/4',
    stepNumber: 3,
    totalSteps: 4,
    buttonText: '注文を確定する',
    canGoBack: true
  },
  'complete': {
    title: '注文が完了しました',
    subtitle: 'ショップ STEP 4/4',
    stepNumber: 4,
    totalSteps: 4,
    buttonText: 'ダッシュボードに戻る',
    canGoBack: false
  },
  'error': {
    title: 'エラーが発生しました',
    subtitle: 'ショップ',
    stepNumber: 0,
    totalSteps: 4,
    buttonText: '最初からやり直す',
    canGoBack: false
  }
}

const ShopPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<Step>('product-selection')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentUser] = useAtom(currentUserState)
  const [myBalance] = useAtom(myBalanceState)
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductState)
  const [orderForm, setOrderForm] = useAtom(orderFormState)

  const handlePlaceOrder = async () => {
    try {
      if (!currentUser) throw new Error('ユーザー情報が取得できません')
      if (!selectedProduct) throw new Error('商品が選択されていません')
      if (selectedProduct.price > myBalance) throw new Error('コインが不足しています')
      if (!orderForm.recipientName.trim()) throw new Error('送付先情報が入力されていません')
      if (!orderForm.recipientAddress.trim()) throw new Error('送付先情報が入力されていません')

      setLoading(true)

      // 支払い取引を作成（ショップへの送金）
      const txKey = await makeTx(currentUser.id, 'shop', currentUser.id);
      if (!txKey?.key) throw new Error('支払い取引の作成に失敗しました')

      // 注文完了処理（実際のアプリではここで注文データベースに保存）
      console.log('注文完了:', {
        product: selectedProduct,
        recipient: orderForm,
        amount: selectedProduct.price,
        txId: txKey.key
      })

      setLoading(false)

    } catch (error) {
      console.error('Error in handlePlaceOrder:', error)
      setErrorMessage(error instanceof Error ? error.message : '注文の処理に失敗しました')
      setStep('error')
      setLoading(false)
      return
    }
  }

  const handleNextStep = async () => {
    if (loading) {
      toast.info('処理中です。しばらくお待ちください。')
      return
    }
    switch (step) {
      case 'product-selection':
        if (!selectedProduct) {
          toast.error('商品を選択してください')
          return
        }
        setStep('recipient-form')
        break
      case 'recipient-form':
        if (!orderForm.recipientName.trim()) {
          toast.error('送付先情報を入力してください')
          return
        }
        if (!orderForm.recipientAddress.trim()) {
          toast.error('送付先情報を入力してください')
          return
        }
        setStep('order-check')
        break
      case 'order-check':
        await handlePlaceOrder()
        setStep('complete')
        break
      case 'error':
        setStep('product-selection')
        setErrorMessage('')
        setSelectedProduct(null)
        setOrderForm({ recipientName: '', recipientAddress: '' })
        break
      default:
        break
    }
  }

  const handleBackStep = () => {
    switch (step) {
      case 'recipient-form':
        setStep('product-selection')
        break
      case 'order-check':
        setStep('recipient-form')
        break
      default:
        break
    }
  }

  const currentStepInfo = STEP_INFO[step]

  return (
    <ExhibitionModeRestriction feature="shop">
      <main className="w-full min-h-screen pb-36">
        <TitleHeader
          title={currentStepInfo.title}
          subtitle={currentStepInfo.subtitle}
          help={<HelpButton />}
        />
        <MiniLayout>
          {step === 'product-selection' && <ShopProductSelection />}
          {step === 'recipient-form' && <ShopRecipientForm />}
          {step === 'order-check' && <ShopOrderCheck />}
          {step === 'complete' && <ShopOrderComplete />}
          {step === 'error' && <ShopOrderError error={errorMessage} />}
        </MiniLayout>

        <BottomBar>
          <div className="flex items-center gap-8 justify-center">
            {step === 'product-selection' && (
              <div className="w-full flex justify-center gap-5 mb-8">
                <div className="relative w-[45px] h-[77px]">
                  <img className="absolute bottom-0 left-0 w-[45px]" src="/images/icons/box_shop.svg" alt=""/>
                  <img className="absolute top-0 left-1.5 w-[34px] h-[40px]" src="/images/icons/tip_shop.svg" alt=""/>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {currentStepInfo.canGoBack && <BackCircleButton onClick={handleBackStep} />}
              {step !== 'complete' && (
                <BasicButton onClick={handleNextStep}>
                  {loading ? (
                    <div className="animate-spin">
                      <Loader />
                    </div>
                  ):(
                    <>
                      <span className="text-base">{currentStepInfo.buttonText}</span>
                      <img src="/images/icons/double_arrow_white.svg" className="w-5 h-5" alt="next"/>
                    </>
                  )}
                </BasicButton>
              )}
            </div>
          </div>
        </BottomBar>
      </main>
    </ExhibitionModeRestriction>
  )
}

export default ShopPage
