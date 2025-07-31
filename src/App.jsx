import { useState } from 'react';
import { WalletConnection } from './components/WalletConnection.jsx';
import { ColorPalette } from './components/ColorPalette.jsx';
import { PixelCanvas } from './components/PixelCanvas.jsx';
import { TransactionStatus } from './components/TransactionStatus.jsx';
import { PaintingInfo } from './components/PaintingInfo.jsx';
import { QuickPaintButton } from './components/QuickPaintButton.jsx';
import { useWeb3 } from './hooks/useWeb3.js';
import { usePixelPainter } from './hooks/usePixelPainter.js';
import { DEFAULT_COLORS } from './config/web3.js';
import './App.css';

function App() {
  const { isConnected } = useWeb3();
  const {
    pixelData,
    isTransactionPending,
    transactionStatus,
    paintingFee,
    isLoading,
    paintPixel,
    loadPixelData,
    isContractDeployed
  } = usePixelPainter();

  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  const handlePixelClick = async (x, y) => {
    if (!isConnected || isTransactionPending || !isContractDeployed) return;
    await paintPixel(x, y, selectedColor);
  };

  const handleRefresh = () => {
    loadPixelData();
  };

  const paintedPixelCount = Object.keys(pixelData).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Monad Pixel Painter
          </h1>
          <p className="text-lg text-gray-600">
            Paint pixels on the blockchain • Monad Testnet
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WalletConnection />
            <ColorPalette 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
            <QuickPaintButton
              selectedColor={selectedColor}
              onPixelClick={handlePixelClick}
              isTransactionPending={isTransactionPending}
              isConnected={isConnected}
              isContractDeployed={isContractDeployed}
            />
            <PaintingInfo
              paintingFee={paintingFee}
              pixelCount={paintedPixelCount}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              isConnected={isConnected}
              isContractDeployed={isContractDeployed}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            <TransactionStatus status={transactionStatus} />
            
            <PixelCanvas
              selectedColor={selectedColor}
              onPixelClick={handlePixelClick}
              isTransactionPending={isTransactionPending}
              pixelData={pixelData}
              isConnected={isConnected}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with React + Vite + Tailwind CSS • Smart Contract on Monad Testnet
          </p>
          <p className="mt-1">
            Connect your wallet and start painting! Each pixel costs {paintingFee} MON.
          </p>
          {!isContractDeployed && (
            <p className="mt-2 text-red-600 font-medium">
              ⚠️ Smart contract not deployed. Please deploy the contract first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

