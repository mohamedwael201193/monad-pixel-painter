# Monad Pixel Painter

A decentralized pixel art application built on the Monad Testnet. Paint pixels on a 100x100 canvas where each pixel is stored on the blockchain as an NFT-like token.

![Monad Pixel Painter](./screenshot.png)

## Features

- **100x100 Pixel Canvas**: Interactive grid with 10,000 clickable pixels
- **Blockchain Integration**: Each pixel painting is recorded on the Monad Testnet
- **Wallet Connection**: MetaMask integration for seamless Web3 experience
- **Real-time Updates**: Live transaction status and pixel updates
- **Color Palette**: 25 predefined colors plus custom color picker
- **Responsive Design**: Works on desktop and mobile devices
- **Zoom & Pan**: Navigate the large canvas with zoom and pan controls
- **Transaction Feedback**: Clear status indicators for pending, success, and failed transactions

## Technologies Used

- **Frontend**: React 19 + Vite + Tailwind CSS
- **UI Components**: shadcn/ui + Lucide React icons
- **Blockchain**: Ethers.js for smart contract interaction
- **Network**: Monad Testnet
- **Smart Contract**: Solidity contract for pixel ownership and painting

## Smart Contract

The `PixelPainter.sol` contract includes:

- **paintPixel(x, y, color)**: Paint a pixel at coordinates (x, y) with a specific color
- **getPixel(x, y)**: Retrieve pixel data including color, painter, and timestamp
- **getPixelsBatch()**: Efficiently load multiple pixels in a single call
- **Events**: Real-time pixel painting events for live updates

### Contract Features

- Configurable painting fee (default: 0.001 MON)
- Pixel ownership tracking
- Timestamp recording for each pixel
- Batch operations for efficient data loading
- Owner controls for fee adjustment and fund withdrawal

## Installation & Setup

### Prerequisites

- Node.js (version 18 or later)
- pnpm package manager
- MetaMask browser extension

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamedwael201193/monad-pixel-painter.git
   cd monad-pixel-painter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   ```

4. **Open the application**
   Navigate to `http://localhost:5173` in your browser

### Smart Contract Deployment

1. **Deploy the contract to Monad Testnet**
   - Use Remix IDE or Hardhat to deploy `contracts/PixelPainter.sol`
   - Update the contract address in `src/config/web3.js`

2. **Configure Monad Testnet in MetaMask**
   - Network Name: Monad Testnet
   - RPC URL: `https://testnet-rpc.monad.xyz`
   - Chain ID: 41454
   - Currency Symbol: MON
   - Block Explorer: `https://testnet-explorer.monad.xyz`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Select Color**: Choose a color from the palette or use custom color picker
3. **Paint Pixels**: Click on any pixel in the canvas to paint it
4. **Confirm Transaction**: Approve the transaction in MetaMask
5. **View Results**: See your painted pixel appear on the canvas

### Painting Costs

- Each pixel costs 0.001 MON (configurable by contract owner)
- You can paint over existing pixels
- All transactions are recorded on the blockchain
- Gas fees apply for each transaction

## Project Structure

```
monad-pixel-painter/
├── contracts/
│   └── PixelPainter.sol        # Smart contract
├── src/
│   ├── components/             # React components
│   │   ├── ColorPalette.jsx    # Color selection
│   │   ├── PixelCanvas.jsx     # Main canvas
│   │   ├── WalletConnection.jsx # Wallet integration
│   │   ├── TransactionStatus.jsx # Status feedback
│   │   └── PaintingInfo.jsx    # Info panel
│   ├── hooks/                  # Custom React hooks
│   │   ├── useWeb3.js          # Web3 functionality
│   │   └── usePixelPainter.js  # Pixel painting logic
│   ├── config/
│   │   └── web3.js             # Web3 configuration
│   ├── App.jsx                 # Main application
│   └── main.jsx                # Entry point
├── package.json
└── README.md
```

## Configuration

### Web3 Configuration (`src/config/web3.js`)

- **MONAD_TESTNET_CONFIG**: Network configuration for Monad Testnet
- **WALLETCONNECT_PROJECT_ID**: WalletConnect project ID for wallet connections
- **CONTRACT_CONFIG**: Smart contract address and ABI
- **DEFAULT_COLORS**: Predefined color palette

### Environment Variables

No environment variables required for basic functionality. All configuration is in the source code.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Frontend Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy from GitHub with build command `pnpm run build`
- **GitHub Pages**: Use GitHub Actions for automated deployment

### Smart Contract Deployment

Deploy the contract to Monad Testnet using:

- **Remix IDE**: Copy and paste the contract code
- **Hardhat**: Set up a deployment script
- **Foundry**: Use forge for deployment

## Troubleshooting

### Common Issues

1. **MetaMask not detected**: Ensure MetaMask is installed and enabled
2. **Wrong network**: Switch to Monad Testnet in MetaMask
3. **Transaction failed**: Check you have sufficient MON for gas fees
4. **Contract not found**: Verify the contract address in configuration

### Getting Test Tokens

Visit the Monad Testnet faucet to get test MON tokens for painting pixels.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [somniapaint.fun](https://somniapaint.fun/)
- Built with the Monad ecosystem
- Uses shadcn/ui for beautiful components
- Powered by Ethers.js for Web3 integration

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/mohamedwael201193/monad-pixel-painter/issues) page
2. Create a new issue with detailed information
3. Join the Monad community for support

---

**Happy Painting! 🎨**

