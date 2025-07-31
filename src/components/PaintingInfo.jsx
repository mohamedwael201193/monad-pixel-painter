import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { RefreshCw, Palette, Coins, Zap } from 'lucide-react';

export const PaintingInfo = ({ 
  paintingFee, 
  pixelCount, 
  onRefresh, 
  isLoading,
  isConnected,
  isContractDeployed = true,
  interactionCount = 0
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Painting Info
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || !isConnected}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Interaction Fee</p>
              <p className="text-lg font-mono">{paintingFee} MON</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Painted Pixels</p>
              <p className="text-lg font-mono">{pixelCount} / 10,000</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
          <Zap className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-700">Total Interactions</p>
            <p className="text-lg font-mono text-green-800">{interactionCount}</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Each pixel interaction costs {paintingFee} MON</p>
          <p>• Canvas size: 100x100 pixels (10,000 total)</p>
          <p>• Interactions are sent to random Monad Testnet contracts</p>
          <p>• All transactions are recorded on the Monad Testnet</p>
        </div>

        {!isConnected && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            Connect your wallet to see real-time data and start painting
          </div>
        )}

        {isConnected && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            <p className="font-medium">Ready to Paint!</p>
            <p>Click any pixel to send a transaction to Monad Testnet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

