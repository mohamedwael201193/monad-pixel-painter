# Monad Pixel Painter

A pixel art grid-based dApp built with React + Vite + Tailwind CSS that interacts with smart contracts on the Monad Testnet. Each pixel click sends a transaction to a random contract on the Monad Testnet, similar to the interaction pattern used in other Monad dApps.

## Features

- **100x100 Pixel Canvas**: Interactive grid with 10,000 clickable pixels
- **Smart Contract Interactions**: Each pixel click sends a transaction to a random Monad Testnet contract
- **Wallet Integration**: Connect with MetaMask using WalletConnect
- **Color Palette**: 25 predefined colors + custom color picker
- **Real-time Feedback**: Transaction status updates and confirmations
- **Local Storage**: Pixel data is saved locally for persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Zoom & Pan**: Navigate the large canvas easily

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum library for blockchain interactions
- **WalletConnect**: Wallet connection protocol
- **Lucide React**: Modern icon library

## Quick Start

### Prerequisites

- Node.js (version 18 or later)
- pnpm (package manager)
- MetaMask browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamedwael201193/monad-pixel-painter.git
   cd monad-pixel-painter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm run build
```

## How It Works

### Smart Contract Interaction Pattern

Unlike traditional pixel art dApps that require deploying a custom smart contract, this application uses a simpler interaction pattern:

1. **Random Contract Selection**: Each pixel click selects a random contract address from a predefined list of existing Monad Testnet contracts
2. **Simple Interaction**: Sends a transaction with a small fee (0.001 MON) to the selected contract's `interact()` function
3. **Local Storage**: Pixel colors and metadata are stored locally in the browser
4. **Transaction Recording**: All interactions are recorded on the Monad Testnet blockchain

### Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection in MetaMask
2. **Add Monad Testnet**: Ensure MetaMask is configured for Monad Testnet:
   - Network Name: `Monad Testnet`
   - RPC URL: `testnet-rpc.monad.xyz`
   - Chain ID: `10143`
   - Currency Symbol: `MON`
3. **Get Test Tokens**: Obtain MON tokens from the Monad Testnet faucet
4. **Select Color**: Choose a color from the palette or use the custom color picker
5. **Paint Pixels**: Click any pixel on the canvas to send a transaction
6. **Confirm Transaction**: Approve the transaction in MetaMask
7. **View Results**: See your painted pixels and transaction confirmations

## Project Structure

```
monad-pixel-painter/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── ColorPalette.jsx
│   │   ├── PixelCanvas.jsx
│   │   ├── WalletConnection.jsx
│   │   ├── TransactionStatus.jsx
│   │   ├── PaintingInfo.jsx
│   │   └── QuickPaintButton.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useWeb3.js     # Web3 wallet connection
│   │   └── usePixelPainter.js # Pixel painting logic
│   ├── config/            # Configuration files
│   │   └── web3.js        # Web3 and contract configuration
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   └── main.jsx           # Application entry point
├── contracts/             # Smart contract source (reference)
│   └── PixelPainter.sol   # Original pixel painter contract
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Configuration

### Monad Testnet Setup

The application is pre-configured for Monad Testnet. Key configuration in `src/config/web3.js`:

```javascript
export const MONAD_TESTNET_CONFIG = {
  chainId: 10143,
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet-explorer.monad.xyz',
  rpcUrl: 'https://testnet-rpc.monad.xyz'
};
```

### WalletConnect Project ID

The application uses WalletConnect for wallet connections. The project ID is configured in `src/config/web3.js`.

## Features in Detail

### Pixel Canvas
- 100x100 grid (10,000 pixels total)
- Zoom and pan functionality
- Click to paint pixels
- Visual feedback for interactions

### Color System
- 25 predefined colors
- Custom color picker
- Color preview
- Easy color switching

### Transaction Handling
- Immediate MetaMask popup on pixel click
- Real-time transaction status updates
- Error handling and user feedback
- Transaction hash display

### Data Persistence
- Local storage for pixel data
- Automatic save/load
- Transaction metadata storage
- Interaction count tracking

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Hooks**: Add to `src/hooks/`
3. **Configuration**: Update `src/config/web3.js`
4. **Styling**: Use Tailwind CSS classes

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join discussions in GitHub Discussions
- **Documentation**: Check this README and inline code comments

## Acknowledgments

- Inspired by [somniapaint.fun](https://somniapaint.fun/)
- Built for the Monad Testnet ecosystem
- Uses the interaction pattern from [monad-contract-interaction](https://github.com/mohamedwael201193/monad-contract-interaction)

---

**Live Demo**: [https://monad-pixel-painter.vercel.app](https://monad-pixel-painter.vercel.app)

**Repository**: [https://github.com/mohamedwael201193/monad-pixel-painter](https://github.com/mohamedwael201193/monad-pixel-painter)

