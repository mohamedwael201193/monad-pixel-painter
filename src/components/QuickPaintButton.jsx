import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Paintbrush, Zap } from 'lucide-react';

export const QuickPaintButton = ({ 
  selectedColor, 
  onPixelClick, 
  isTransactionPending, 
  isConnected,
  isContractDeployed 
}) => {
  const [lastPaintedCoords, setLastPaintedCoords] = useState({ x: 50, y: 50 });

  const handleQuickPaint = () => {
    if (!isConnected || !isContractDeployed || isTransactionPending) return;
    
    // Generate random coordinates for quick testing
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    
    setLastPaintedCoords({ x, y });
    onPixelClick(x, y);
  };

  const isDisabled = !isConnected || !isContractDeployed || isTransactionPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          Quick Paint Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleQuickPaint}
          disabled={isDisabled}
          className="w-full"
          size="lg"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isTransactionPending ? 'Painting...' : 'Paint Random Pixel'}
        </Button>
        
        <div className="text-sm text-gray-600">
          <p>• Click to paint a random pixel with selected color</p>
          <p>• This will immediately trigger MetaMask popup</p>
          <p>• Last painted: ({lastPaintedCoords.x}, {lastPaintedCoords.y})</p>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm font-mono">{selectedColor}</span>
        </div>

        {!isConnected && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            Connect wallet to test painting
          </div>
        )}

        {!isContractDeployed && isConnected && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Deploy contract first
          </div>
        )}
      </CardContent>
    </Card>
  );
};

