/**
 * Stripe Checkout Wrapper Component
 *
 * Handles PaymentIntent creation and Stripe Elements initialization.
 * Separates concerns between payment setup and payment execution.
 */

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import type { CartItem, PaymentIntentResponse } from './types';

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeCheckoutProps {
  cartItems: CartItem[];
  totalAmount: number;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  cartItems,
  totalAmount,
}) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (totalAmount < 50) {
      setError('Minimum order amount is $0.50');
      setLoading(false);
      return;
    }

    createPaymentIntent();
  }, [totalAmount]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = import.meta.env.VITE_API_URL || '/api';

      const response = await fetch(`${apiUrl}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data: PaymentIntentResponse = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      console.error('Error creating payment intent:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Unable to Initialize Checkout</h2>
        <p>{error}</p>
        <button onClick={createPaymentIntent} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements options={elementsOptions} stripe={stripePromise}>
      <CheckoutForm
        cartItems={cartItems}
        totalAmount={totalAmount}
        onSuccess={() => {
          console.log('Payment completed successfully!');
          // In a real app, you'd navigate to a success page or update order status
        }}
      />
    </Elements>
  );
};

export default StripeCheckout;
