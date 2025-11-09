# SideShift Trader

<div align="center">

![SideShift Trader](https://img.shields.io/badge/SideShift-Trader-00FFFF?style=for-the-badge&logo=ethereum&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, neobrutalism-styled cross-chain cryptocurrency swap interface powered by SideShift.ai**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🚀 Features

- **🔗 Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and 10+ wallet providers
- **💱 Cross-Chain Swaps**: Trade 200+ cryptocurrencies across 42+ blockchains
- **📊 Real-Time Price Tracking**: Live price updates every 10 seconds with precise rate monitoring
- **⚡ Dual Rate Types**: 
  - Fixed Rate: Locked exchange rate for 15 minutes
  - Variable Rate: Rate determined on deposit, valid for 7 days
- **📈 Live Statistics**: Track total swaps, settled transactions, active pairs, and trading volume
- **🎨 Neobrutalism UI**: Bold, high-contrast design with geometric shapes and vibrant colors
- **🔄 Automatic Monitoring**: Real-time shift status updates with automatic polling
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🎯 Demo

![SideShift Trader Interface](https://via.placeholder.com/800x400/0a0a0a/00FFFF?text=SideShift+Trader+Interface)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- A SideShift.ai account ([Get one here](https://sideshift.ai/account))
- WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com/))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SCARPxVeNOM/flashbets.git
   cd flashbets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SIDESHIFT_SECRET=your_sideshift_secret_here
   NEXT_PUBLIC_AFFILIATE_ID=your_affiliate_id_here
   NEXT_PUBLIC_SIDESHIFT_API_URL=https://sideshift.ai/api/v2
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Getting Started

1. **Connect Your Wallet**
   - Click "SIGN IN / SIGN UP" in the header
   - Select your preferred wallet provider
   - Approve the connection

2. **Select Coins & Networks**
   - Choose the cryptocurrency you want to swap from
   - Select the target blockchain network
   - Choose the cryptocurrency you want to receive
   - Select the destination network

3. **Choose Rate Type**
   - **Fixed Rate**: Enter exact amount, rate locked for 15 minutes
   - **Variable Rate**: Send any amount within min/max, rate determined on deposit

4. **Create Shift**
   - Click "CREATE SHIFT" to generate a deposit address
   - Send the required amount to the displayed address
   - Monitor status in real-time

5. **Track Your Swaps**
   - View all shifts in the history panel
   - Check live price updates
   - Monitor trading statistics

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management

### Blockchain
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI

### API Integration
- **SideShift.ai REST API v2** - Cross-chain swap infrastructure
- **Axios** - HTTP client

### Design
- **Neobrutalism** - Bold, high-contrast design system
- **Lucide React** - Icon library

## 📁 Project Structure

```
sideshift-trader/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main landing page
│   ├── providers.tsx       # Wallet & query providers
│   ├── wagmi-config.ts     # Wagmi configuration
│   └── globals.css         # Global styles & neobrutalism utilities
├── components/
│   ├── TradeInterface.tsx  # Main trading interface
│   ├── PriceDisplay.tsx    # Real-time price tracker
│   ├── ShiftHistory.tsx    # Swap history component
│   └── StatsPanel.tsx      # Live trading statistics
├── lib/
│   ├── sideshift.ts        # SideShift API client
│   └── price-tracker.ts    # Price tracking system
├── store/
│   └── trade-store.ts      # Zustand state management
└── public/                 # Static assets
```

## 🔐 Security

- **Never commit `.env.local`** - Keep your SideShift secret secure
- **Verify addresses** - Always double-check deposit addresses before sending
- **Start small** - Test with small amounts first
- **Rate limits** - Respect API limits (5 shifts/min, 20 quotes/min)

## 📊 API Rate Limits

- **Shifts**: 5 per minute
- **Quotes**: 20 per minute
- **Status Checks**: Poll every 5 seconds for active shifts

## 🎨 Design Philosophy

This project embraces **neobrutalism** design principles:
- Bold 4px borders on all elements
- High contrast colors (Yellow #FFD700, Cyan #00FFFF)
- Box shadows for depth (8px offset)
- Uppercase, bold typography
- Geometric shapes and clean layouts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SideShift.ai](https://sideshift.ai) for the cross-chain swap infrastructure
- [RainbowKit](https://rainbowkit.com) for wallet connection UI
- [Wagmi](https://wagmi.sh) for Ethereum React hooks

## 📧 Support

- **SideShift Docs**: [https://docs.sideshift.ai](https://docs.sideshift.ai)
- **SideShift Support**: [help@sideshift.ai](mailto:help@sideshift.ai)
- **Issues**: [GitHub Issues](https://github.com/SCARPxVeNOM/flashbets/issues)

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Always verify transactions and addresses before sending funds. Use at your own risk.

---

<div align="center">

**Built with ❤️ for the Web3 community**

[⭐ Star this repo](https://github.com/SCARPxVeNOM/flashbets) • [🐛 Report Bug](https://github.com/SCARPxVeNOM/flashbets/issues) • [💡 Request Feature](https://github.com/SCARPxVeNOM/flashbets/issues)

</div>
