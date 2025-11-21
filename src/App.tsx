/**
 * Main Application Component
 *
 * Demonstrates the Stripe checkout integration with a sample cart.
 * In a real application, this would integrate with your product catalog
 * and shopping cart state management.
 */

import React from 'react';
import StripeCheckout from './StripeCheckout';
import type { CartItem } from './types';
import './App.css';

const App: React.FC = () => {
  // Sample cart data - in production this would come from your cart state
  const sampleCart: CartItem[] = [
    {
      id: '1',
      name: 'Premium T-Shirt',
      description: 'High-quality cotton tee with custom logo',
      price: 2999, // $29.99 in cents
      quantity: 2,
    },
    {
      id: '2',
      name: 'Custom Mug',
      description: '11oz ceramic mug with personalization',
      price: 1499, // $14.99 in cents
      quantity: 1,
    },
    {
      id: '3',
      name: 'Branded Pen Set',
      description: 'Set of 3 premium pens with company branding',
      price: 1999, // $19.99 in cents
      quantity: 1,
    },
  ];

  const totalAmount = sampleCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Stripe Checkout POC</h1>
        <p className="subtitle">
          Multi-Payment Method Integration Demonstration
        </p>
      </header>

      <main className="app-main">
        <StripeCheckout cartItems={sampleCart} totalAmount={totalAmount} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Technical Stack:</strong> React 18 + TypeScript + Vite +
            Stripe Elements
          </p>
          <p>
            <strong>Backend:</strong> Express + TypeScript + Stripe API v{import.meta.env.VITE_STRIPE_API_VERSION || '2024-11-20'}
          </p>
          <div className="footer-links">
            <a
              href="https://stripe.com/docs/payments/payment-intents"
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 Stripe Docs
            </a>
            <a
              href="https://github.com/zchristmas-cic/stripe-checkout-poc"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 GitHub Repo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
