import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3.js';
import { getRandomContractAddress, INTERACTION_FEE } from '../config/web3.js';

export const usePixelPainter = () => {
  const { provider, isConnected, account } = useWeb3();
  const [pixelData, setPixelData] = useState({});
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [paintingFee, setPaintingFee] = useState(INTERACTION_FEE);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Simple contract ABI for interact() method
  const CONTRACT_ABI = [
    {
      "inputs": [],
      "name": "interact",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  // Check if we can interact (provider is available)
  const isContractDeployed = useCallback(() => {
    const canInteract = !!provider && isConnected;
    console.log('Can interact with contracts:', canInteract, 'Provider:', !!provider, 'Connected:', isConnected);
    return canInteract;
  }, [provider, isConnected]);

  // Load painting fee (static value)
  const loadPaintingFee = useCallback(async () => {
    console.log('Setting static painting fee:', INTERACTION_FEE);
    setPaintingFee(INTERACTION_FEE);
  }, []);

  // Load pixel data (simulate from local storage or generate random)
  const loadPixelData = useCallback(async () => {
    console.log('Loading pixel data from local storage...');
    setIsLoading(true);
    
    try {
      // Try to load from localStorage
      const savedPixelData = localStorage.getItem('monad-pixel-data');
      if (savedPixelData) {
        const parsed = JSON.parse(savedPixelData);
        setPixelData(parsed);
        console.log('Loaded pixel data from localStorage:', Object.keys(parsed).length, 'pixels');
      } else {
        console.log('No saved pixel data found.');
      }
    } catch (error) {
      console.error('Failed to load pixel data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Paint a pixel - Using simple contract interaction
  const paintPixel = useCallback(async (x, y, color) => {
    console.log(`Attempting to paint pixel (${x}, ${y}) with color ${color}...`);
    
    if (!provider || !isConnected || isTransactionPending) {
      console.log('Paint pixel conditions not met:', { provider: !!provider, isConnected, isTransactionPending });
      return false;
    }

    // Set pending state immediately to prevent multiple clicks
    setIsTransactionPending(true);
    setTransactionStatus({ type: 'pending', message: 'Preparing transaction...' });
    console.log('Transaction pending state set.');

    try {
      // Get a random contract address for this interaction
      const contractAddress = getRandomContractAddress();
      console.log('Using contract address:', contractAddress);

      // Create contract instance
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

      // Set transaction status
      setTransactionStatus({ type: 'pending', message: 'Please confirm transaction in MetaMask...' });
      console.log('Calling contract.interact() with fee:', INTERACTION_FEE);
      
      // Call the interact function with a small fee
      const tx = await contract.interact({
        value: ethers.parseEther(INTERACTION_FEE),
        gasLimit: 100000 // Set a reasonable gas limit
      });
      
      console.log('Transaction sent, waiting for confirmation:', tx.hash);

      // Transaction was sent successfully (user confirmed in MetaMask)
      setTransactionStatus({ 
        type: 'pending', 
        message: `Transaction submitted: ${tx.hash.slice(0, 10)}...` 
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 1) {
        // Transaction successful
        setTransactionStatus({ 
          type: 'success', 
          message: 'Pixel painted successfully!' 
        });
        console.log('Pixel painted successfully!');

        // Update local pixel data and save to localStorage
        const key = `${x}-${y}`;
        const newPixelData = {
          color,
          painter: account,
          timestamp: Math.floor(Date.now() / 1000),
          txHash: tx.hash,
          contractAddress
        };

        setPixelData(prev => {
          const updated = {
            ...prev,
            [key]: newPixelData
          };
          
          // Save to localStorage
          try {
            localStorage.setItem('monad-pixel-data', JSON.stringify(updated));
            console.log('Pixel data saved to localStorage.');
          } catch (error) {
            console.error('Failed to save pixel data to localStorage:', error);
          }
          
          return updated;
        });

        // Increment interaction count
        setInteractionCount(prev => prev + 1);
        console.log('Local pixel data updated.');

        return true;
      } else {
        console.error('Transaction failed: Receipt status is not 1.');
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Failed to paint pixel:', error);
      
      let errorMessage = 'Transaction failed';
      
      // Handle different types of errors
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again.';
      }

      setTransactionStatus({ 
        type: 'error', 
        message: errorMessage 
      });

      return false;
    } finally {
      setIsTransactionPending(false);
      console.log('Transaction pending state reset.');
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setTransactionStatus(null);
        console.log('Transaction status cleared.');
      }, 5000);
    }
  }, [provider, isConnected, isTransactionPending, account, CONTRACT_ABI]);

  // Load initial data when provider is available
  useEffect(() => {
    console.log('useEffect: Provider or connection status changed.');
    if (provider && isConnected) {
      console.log('useEffect: Provider ready and connected, loading data.');
      loadPaintingFee();
      loadPixelData();
    } else {
      console.log('useEffect: Provider not ready or not connected, skipping initial load.');
    }
  }, [provider, isConnected, loadPaintingFee, loadPixelData]);

  return {
    pixelData,
    isTransactionPending,
    transactionStatus,
    paintingFee,
    isLoading,
    paintPixel,
    loadPixelData,
    loadPaintingFee,
    isContractDeployed: isContractDeployed(),
    interactionCount
  };
};

