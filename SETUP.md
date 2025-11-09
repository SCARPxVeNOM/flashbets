# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd sideshift-trader
npm install
```

## Step 2: Get SideShift Credentials

1. Visit [https://sideshift.ai/account](https://sideshift.ai/account)
2. Copy your **Private Key** (this is your `SIDESHIFT_SECRET`)
3. Copy your **Account ID** (this is your `AFFILIATE_ID`)

## Step 3: Get WalletConnect Project ID

1. Visit [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Create a free account
3. Create a new project
4. Copy your **Project ID**

## Step 4: Create Environment File

Create a file named `.env.local` in the `sideshift-trader` directory:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SIDESHIFT_SECRET=your_actual_secret_here
NEXT_PUBLIC_AFFILIATE_ID=your_actual_affiliate_id_here
NEXT_PUBLIC_SIDESHIFT_API_URL=https://sideshift.ai/api/v2
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Step 5: Run the Development Server

```bash
npm run dev
```

## Step 6: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Features to Try

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask or another wallet
2. **Select Coins**: Choose from 200+ cryptocurrencies
3. **Choose Networks**: Select from 42+ supported blockchains
4. **Create Swap**: 
   - **Fixed Rate**: Lock in rate for 15 minutes (requires exact amount)
   - **Variable Rate**: Rate determined when deposit received (valid 7 days)
5. **Track Prices**: Watch real-time price updates in the sidebar
6. **Monitor Shifts**: View all your swaps with automatic status updates

## Important Notes

⚠️ **Security**:
- Never share your `SIDESHIFT_SECRET` - it grants full access to your account
- Never commit `.env.local` to version control
- Always verify deposit addresses before sending funds

⚠️ **Testing**:
- Start with small amounts for testing
- Fixed rate shifts expire in 15 minutes
- Variable rate shifts expire in 7 days
- Rate limits: 5 shifts/min, 20 quotes/min

## Troubleshooting

**"Account not found" error?**
- Check that your `SIDESHIFT_SECRET` is correct
- Ensure there are no extra spaces in `.env.local`

**Wallet not connecting?**
- Verify `WALLETCONNECT_PROJECT_ID` is set
- Check browser console for errors
- Try a different wallet provider

**Prices not updating?**
- Check browser console for API errors
- Verify network connectivity
- Ensure coins are selected correctly

**API rate limit errors?**
- Wait a minute between creating shifts
- Don't create more than 5 shifts per minute
- Don't request more than 20 quotes per minute

## Next Steps

- Customize the UI in `components/`
- Add more features in `lib/`
- Extend state management in `store/`
- Deploy to Vercel or your preferred hosting

## Support

- SideShift Docs: [https://docs.sideshift.ai](https://docs.sideshift.ai)
- SideShift Support: [help@sideshift.ai](mailto:help@sideshift.ai)

