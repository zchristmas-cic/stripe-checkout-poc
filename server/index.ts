/**
 * Stripe Checkout POC - Backend Server
 *
 * Based on initial implementation by CTO, enhanced with:
 * - Better error handling
 * - Environment variable validation
 * - Request logging
 * - CORS configuration
 */

import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is required in .env file');
  process.exit(1);
}

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true,
}));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stripe: 'connected'
  });
});

/**
 * Create Payment Intent
 *
 * This endpoint creates a PaymentIntent on the Stripe side.
 * The client will use the returned clientSecret to complete the payment.
 */
app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', paymentMethodTypes } = req.body;

    // Validate amount
    if (!amount || amount < 50) {
      return res.status(400).json({
        error: 'Amount must be at least $0.50 USD'
      });
    }

    console.log(`Creating PaymentIntent for ${amount} ${currency}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      // Optional: specify payment method types
      ...(paymentMethodTypes && { payment_method_types: paymentMethodTypes }),
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment intent'
    });
  }
});

/**
 * Confirm Payment
 *
 * Retrieves the status of a PaymentIntent to confirm completion.
 * In a real application, you'd also handle webhooks for reliable payment confirmation.
 */
app.post('/api/confirm-payment', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: error.message || 'Failed to confirm payment'
    });
  }
});

/**
 * Create Setup Intent
 *
 * For saving payment methods for future use (subscriptions, etc.)
 * Not needed for one-time payments, but included for completeness.
 */
app.post('/api/create-setup-intent', async (req: Request, res: Response) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({
      error: error.message || 'Failed to create setup intent'
    });
  }
});

/**
 * Webhook handler for Stripe events
 *
 * In production, you'd use this to handle payment confirmations,
 * failures, disputes, etc. reliably (since the client can disconnect).
 */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).send('Webhook signature required');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('💰 Payment succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Stripe Checkout POC Server Running   ║
╠════════════════════════════════════════╣
║  Port:        ${PORT}                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Frontend:    ${process.env.FRONTEND_URL || 'http://localhost:5175'} ║
╚════════════════════════════════════════╝
  `);
});
