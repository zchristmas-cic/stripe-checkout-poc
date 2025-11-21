# Setup Guide - Step by Step

This guide walks through getting the Stripe Checkout POC running locally and deploying it.

## Part 1: Get Your Stripe API Keys

1. **Create/Login to Stripe Account**
   - Go to https://dashboard.stripe.com/register
   - Sign up or log in

2. **Get Your Test API Keys**
   - Navigate to https://dashboard.stripe.com/test/apikeys
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_`) - Safe to use in frontend
     - **Secret key** (starts with `sk_test_`) - Keep this secret, backend only
   - Click "Reveal test key" to see the secret key
   - Copy both keys somewhere safe

## Part 2: Run Locally

### Step 1: Install Dependencies

```bash
cd stripe-checkout-poc
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file and add your Stripe keys:
```env
# Backend - uses your SECRET key
STRIPE_SECRET_KEY=sk_test_your_actual_key_here

# Frontend - uses your PUBLISHABLE key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

3. Save the file

### Step 3: Start the Application

**You need TWO terminal windows:**

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```
You should see:
```
╔════════════════════════════════════════╗
║   Stripe Checkout POC Server Running   ║
║  Port:        3001                      ║
╚════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5175/
```

### Step 4: Test It Out

1. Open http://localhost:5175 in your browser
2. You should see a checkout page with a sample cart
3. Click on the payment form
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
5. Click "Pay $99.96"
6. You should see "Payment successful!"

### Step 5: Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. You should see your test payment listed
3. This confirms everything is working!

## Part 3: Deploy to Production

### Option A: Quick Deploy (GitHub Pages + Vercel)

#### Deploy Backend to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy backend:**
```bash
vercel --prod
```

4. **Add environment variable:**
   - Go to your project on https://vercel.com
   - Click Settings → Environment Variables
   - Add: `STRIPE_SECRET_KEY` = `sk_test_your_key`
   - Redeploy: `vercel --prod`

5. **Copy your deployment URL** (e.g., `https://your-app.vercel.app`)

#### Deploy Frontend to GitHub Pages

1. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name it `stripe-checkout-poc`
   - Click "Create repository"

2. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Stripe Checkout POC"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stripe-checkout-poc.git
git push -u origin main
```

3. **Configure GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add two secrets:
     - Name: `VITE_STRIPE_PUBLISHABLE_KEY`, Value: `pk_test_your_key`
     - Name: `VITE_API_URL`, Value: `https://your-vercel-app.vercel.app/api`

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Click Save

5. **Deploy:**
```bash
npm run deploy
```

6. **Access your app:**
   - URL will be: `https://YOUR_USERNAME.github.io/stripe-checkout-poc/`

### Option B: Simple Deploy (Both on Vercel)

1. Deploy everything to Vercel:
```bash
vercel --prod
```

2. Configure environment variables in Vercel dashboard
3. Access at your Vercel URL

## Part 4: Testing Payment Methods

### Test Cards

| Card Number         | Scenario                | Details              |
| ------------------- | ----------------------- | -------------------- |
| 4242 4242 4242 4242 | Success (Visa)          | Any CVC, any future date |
| 5555 5555 5555 4444 | Success (Mastercard)    | Any CVC, any future date |
| 4000 0025 0000 3155 | 3D Secure Required      | Prompts for authentication |
| 4000 0000 0000 9995 | Declined (generic)      | Card will be declined |
| 4000 0000 0000 0002 | Declined (insufficient) | Insufficient funds   |

More test cards: https://stripe.com/docs/testing

### Test Wallets (Apple Pay / Google Pay)

In **test mode**, Stripe automatically shows test wallet buttons:
- They appear automatically on supported browsers
- No real wallet setup needed in test mode
- Click to see the test payment flow

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend won't start
- Check that `.env` file exists
- Verify `STRIPE_SECRET_KEY` starts with `sk_test_`
- Make sure port 3001 isn't already in use

### Frontend shows "Loading checkout..."
- Make sure backend is running on port 3001
- Check browser console for errors (F12 → Console)
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`

### CORS errors in browser console
- Backend must be running
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- For deployment, update CORS settings in `server/index.ts`

### Payment fails
- Check Stripe Dashboard → Developers → Logs
- Verify you're using test mode keys (start with `pk_test_` and `sk_test_`)
- Try a different test card

## Next Steps

1. ✅ **Test locally** - Verify everything works
2. ✅ **Review the code** - Check `src/` and `server/` folders
3. ✅ **Deploy** - Get it online to share
4. 📚 **Learn more** - Check Stripe docs for advanced features
5. 🔧 **Customize** - Modify styling, add features, integrate with GSD

## Questions?

- Check the main [README.md](./README.md) for detailed documentation
- Stripe docs: https://stripe.com/docs
- Stripe support: https://support.stripe.com

---

**That's it! You now have a working Stripe integration.** 🎉
