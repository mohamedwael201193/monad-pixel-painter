import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3.js';

export const WalletConnection = () => {
  const {
    account,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is not installed. Please install MetaMask to connect your wallet.
            </AlertDescription>
          </Alert>
          <Button 
            className="w-full mt-4" 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Wallet className="h-12 w-12 text-blue-500" />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected ? (
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-gray-600">Connected Account</p>
                <p className="font-mono text-lg">{formatAddress(account)}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={disconnectWallet}
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}

          <p className="text-xs text-gray-500 text-center">
            Connect your wallet to start painting pixels on the Monad Testnet
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

