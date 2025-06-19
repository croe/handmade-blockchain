export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'digital' | 'physical';
}

export type Order = {
  id: string;
  productId: string;
  userId: string;
  recipientName: string;
  recipientAddress: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled';
} 