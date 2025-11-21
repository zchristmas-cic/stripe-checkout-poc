# Stripe Checkout POC

A production-ready proof of concept for Stripe payment integration with support for multiple payment methods.

## 🎯 Overview

This POC demonstrates a complete Stripe checkout implementation with:

- **Multi-payment method support** - Cards, wallets (Apple Pay, Google Pay), and more
- **Type-safe TypeScript** - Full type safety across frontend and backend
- **Modern React 18** - Latest React features with hooks and TypeScript
- **Secure backend** - Express server handling sensitive Stripe operations
- **Production patterns** - Error handling, loading states, validation
- **Easy deployment** - GitHub Pages (frontend) + Vercel/Netlify (backend)

## 📁 Project Structure

```
stripe-checkout-poc/
├── src/                    # Frontend React application
│   ├── App.tsx            # Main application component
│   ├── StripeCheckout.tsx # Payment intent creation & Stripe Elements setup
│   ├── CheckoutForm.tsx   # Payment form with Stripe Elements
│   ├── types.ts           # TypeScript type definitions
│   ├── App.css            # Styling
│   └── main.tsx           # Application entry point
├── server/                 # Backend Express server
│   └── index.ts           # Stripe API routes and webhook handling
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Stripe account ([sign up free](https://dashboard.stripe.com/register))

### 1. Clone and Install

```bash
cd stripe-checkout-poc
npm install  # or: pnpm install
```

### 2. Configure Stripe Keys

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Edit `.env` and add your keys:

```env
# Backend
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Frontend (Vite requires VITE_ prefix)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Run Locally

**Option A: Run both frontend and backend** (recommended for development)

```bash
# Terminal 1 - Backend server
npm run server:dev

# Terminal 2 - Frontend dev server
npm run dev
```

Then open: http://localhost:5175

**Option B: Frontend only** (if you have a deployed backend)

```bash
# Update .env with your deployed backend URL
VITE_API_URL=https://your-backend.vercel.app/api

npm run dev
```

### 4. Test Payments

Use these [Stripe test cards](https://stripe.com/docs/testing):

| Card Number         | Scenario        |
| ------------------- | --------------- |
| 4242 4242 4242 4242 | Success         |
| 4000 0025 0000 3155 | Requires 3D Secure |
| 4000 0000 0000 9995 | Declined        |

- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

## 🌐 Deployment

### Deploy Backend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    }
  ],
  "env": {
    "STRIPE_SECRET_KEY": "@stripe-secret-key"
  }
}
```

3. Deploy:

```bash
vercel --prod
```

4. Add environment variables in Vercel dashboard

### Deploy Frontend (GitHub Pages)

1. Update `vite.config.ts` base URL to match your repo:

```ts
base: '/stripe-checkout-poc/'
```

2. Update `.env` with your deployed backend:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

3. Deploy:

```bash
npm run deploy
```

4. Enable GitHub Pages in repo settings: Settings → Pages → Source: gh-pages branch

## 🏗️ Technical Architecture

### Frontend (React + TypeScript + Vite)

- **Vite** - Lightning-fast dev server and build tool
- **React 18** - Modern hooks-based components
- **TypeScript** - Full type safety
- **Stripe Elements** - Pre-built, customizable payment UI components
- **Responsive Design** - Mobile-first CSS Grid layout

### Backend (Express + TypeScript)

- **Express** - Minimal, flexible Node.js framework
- **Stripe SDK** - Official Node.js library for Stripe API
- **CORS** - Configured for secure cross-origin requests
- **Environment Variables** - Secure credential management

### Payment Flow

```
1. User loads checkout page
   ↓
2. Frontend requests PaymentIntent from backend
   ↓
3. Backend creates PaymentIntent via Stripe API
   ↓
4. Backend returns clientSecret to frontend
   ↓
5. Frontend renders Stripe Elements with clientSecret
   ↓
6. User enters payment details and submits
   ↓
7. Stripe Elements securely processes payment
   ↓
8. Frontend receives confirmation
```

## 📚 API Endpoints

### `POST /api/create-payment-intent`

Creates a new PaymentIntent.

**Request:**
```json
{
  "amount": 9996,
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### `POST /api/confirm-payment`

Retrieves payment status (for polling/confirmation).

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "status": "succeeded",
  "amount": 9996,
  "currency": "usd"
}
```

### `POST /api/webhook`

Handles Stripe webhook events (for production).

## 🔒 Security Best Practices

✅ **Implemented in this POC:**

- ✅ API keys stored in environment variables (never committed)
- ✅ Secret key only used on backend (never exposed to client)
- ✅ CORS configured to restrict origins
- ✅ HTTPS required in production (enforced by deployment platforms)
- ✅ Stripe Elements handles PCI compliance (card data never touches your server)

⚠️ **For production deployment, also add:**

- Authentication/authorization for creating payments
- Rate limiting on API endpoints
- Request validation and sanitization
- Webhook signature verification
- Logging and monitoring
- Error tracking (Sentry, etc.)

## 🧪 Testing

### Manual Testing

1. Run locally: `npm run dev` + `npm run server:dev`
2. Use test cards from [Stripe Testing Docs](https://stripe.com/docs/testing)
3. Check Stripe Dashboard → Payments to see test transactions

### Automated Testing

```bash
# Run TypeScript checks
npm run build

# Future: Add Jest/Vitest tests
# npm test
```

## 🎨 Customization

### Styling

Edit `src/App.css` - CSS variables at the top for easy theming:

```css
:root {
  --color-primary: #0570de;
  --color-success: #28a745;
  --border-radius: 8px;
  /* ... */
}
```

### Stripe Elements Appearance

Edit `src/StripeCheckout.tsx`:

```ts
const elementsOptions: StripeElementsOptions = {
  appearance: {
    theme: 'stripe', // 'stripe' | 'night' | 'flat'
    variables: {
      colorPrimary: '#0570de',
      // ... customize colors, fonts, etc.
    },
  },
};
```

## 🐛 Troubleshooting

### "Stripe is not loaded"
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` (test mode) or `pk_live_` (live mode)
- Check browser console for errors

### "Failed to create payment intent"
- Verify backend is running (`npm run server:dev`)
- Check `STRIPE_SECRET_KEY` is set on backend
- Ensure frontend `VITE_API_URL` points to correct backend URL
- Check backend console for error details

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- For production, update CORS origin in `server/index.ts`

### Payment not completing
- Check amount is >= 50 cents ($0.50 USD minimum)
- Try a different test card
- Check Stripe Dashboard → Logs for API errors

## 📖 Additional Resources

- [Stripe Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements React Documentation](https://stripe.com/docs/stripe-js/react)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)

## 🤝 Integration with GSD Platform

This POC demonstrates the payment integration pattern. To integrate into the main GSD platform:

1. **Adapt to NestJS architecture** - Convert Express routes to NestJS controllers
2. **Add multi-tenancy** - Scope payments by `storeId`
3. **Use shared packages** - Import types from `@gsd/shared-types`
4. **Add order integration** - Link PaymentIntent to Order entity
5. **Configure per store** - Allow stores to configure payment methods
6. **Add webhook handling** - Process Stripe events for order fulfillment

See `docs/standards/GOLD_STANDARD_CODE_PATTERN.md` in main repo for patterns.

## 📝 License

This is a proof of concept for internal use at GlobalShop Direct.

---

**Built with** ❤️ **using Stripe, React, TypeScript, and modern web standards**
