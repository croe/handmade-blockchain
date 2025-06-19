import { atom } from 'jotai'
import { Product, Order } from '@/models/product'

export const selectedProductState = atom<Product | null>(null)

export const orderFormState = atom<{
  recipientName: string;
  recipientAddress: string;
}>({
  recipientName: '',
  recipientAddress: ''
})

export const ordersState = atom<Order[]>([]) 