/**
 * Type definitions for the Stripe Checkout POC
 */

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number; // in cents
  quantity: number;
  image?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentConfirmationResponse {
  status: string;
  amount: number;
  currency: string;
}

export type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';
