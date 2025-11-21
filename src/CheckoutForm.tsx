/**
 * Checkout Form Component
 *
 * Enhanced version of CTO's initial implementation with:
 * - Better error handling and validation
 * - Improved UX with loading states
 * - TypeScript type safety
 * - Cleaner component structure
 */

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { CartItem, PaymentStatus } from './types';

interface CheckoutFormProps {
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  totalAmount,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe is not loaded. Please refresh the page.');
      return;
    }

    setPaymentStatus('processing');
    setMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An error occurred during payment');
        setPaymentStatus('failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        setMessage('Payment successful! Thank you for your purchase.');
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessage(errorMessage);
      setPaymentStatus('failed');
    }
  };

  const isProcessing = paymentStatus === 'processing';
  const isSucceeded = paymentStatus === 'succeeded';

  return (
    <div className="checkout-container">
      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                {item.description && (
                  <span className="item-description">{item.description}</span>
                )}
                <span className="item-quantity">Qty: {item.quantity}</span>
              </div>
              <span className="item-price">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="total">
          <strong>Total:</strong>
          <strong>${(totalAmount / 100).toFixed(2)}</strong>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>Payment Details</h2>

        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        <button
          type="submit"
          disabled={!stripe || isProcessing || isSucceeded}
          className={`pay-button ${isProcessing ? 'processing' : ''} ${isSucceeded ? 'succeeded' : ''}`}
        >
          {isProcessing && (
            <span className="spinner" />
          )}
          {isProcessing
            ? 'Processing...'
            : isSucceeded
            ? '✓ Payment Complete'
            : `Pay $${(totalAmount / 100).toFixed(2)}`}
        </button>

        {message && (
          <div className={`message ${paymentStatus === 'succeeded' ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Development Info */}
        {import.meta.env.DEV && (
          <div className="dev-info">
            <p>💳 Test Card: 4242 4242 4242 4242</p>
            <p>📅 Expiry: Any future date</p>
            <p>🔐 CVC: Any 3 digits</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
