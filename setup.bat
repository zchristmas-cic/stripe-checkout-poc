@echo off
REM Stripe Checkout POC Setup Script for Windows

echo ╔════════════════════════════════════════╗
echo ║   Stripe Checkout POC Setup Wizard     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Check if .env exists
if exist .env (
    echo ⚠️  .env file already exists. Skipping environment setup.
) else (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your Stripe API keys
    echo    Get them from: https://dashboard.stripe.com/test/apikeys
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ╔════════════════════════════════════════╗
echo ║         Setup Complete! 🎉             ║
echo ╠════════════════════════════════════════╣
echo ║                                        ║
echo ║  Next Steps:                           ║
echo ║                                        ║
echo ║  1. Edit .env with your Stripe keys    ║
echo ║     notepad .env                       ║
echo ║                                        ║
echo ║  2. Start the backend (Terminal 1):    ║
echo ║     npm run server:dev                 ║
echo ║                                        ║
echo ║  3. Start the frontend (Terminal 2):   ║
echo ║     npm run dev                        ║
echo ║                                        ║
echo ║  4. Open browser:                      ║
echo ║     http://localhost:5175              ║
echo ║                                        ║
echo ║  5. Test with card:                    ║
echo ║     4242 4242 4242 4242                ║
echo ║                                        ║
echo ╚════════════════════════════════════════╝
echo.
echo 📚 For detailed instructions, see SETUP.md
echo.

pause
