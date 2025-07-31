import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { RefreshCw, Palette, Coins, AlertTriangle } from 'lucide-react';

export const PaintingInfo = ({ 
  paintingFee, 
  pixelCount, 
  onRefresh, 
  isLoading,
  isConnected,
  isContractDeployed = false
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
            disabled={isLoading || !isConnected || !isContractDeployed}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isContractDeployed && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Smart contract not deployed! Please deploy the contract first and update the address in config.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Painting Fee</p>
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

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Each pixel costs {paintingFee} MON to paint</p>
          <p>• Canvas size: 100x100 pixels (10,000 total)</p>
          <p>• You can paint over existing pixels</p>
          <p>• All transactions are recorded on the Monad Testnet</p>
        </div>

        {!isConnected && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            Connect your wallet to see real-time data and start painting
          </div>
        )}

        {!isContractDeployed && isConnected && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            <p className="font-medium">Contract Not Deployed</p>
            <p>Please deploy the smart contract first. See DEPLOYMENT_GUIDE.md for instructions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

