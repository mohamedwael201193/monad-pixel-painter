import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3.js';

export const usePixelPainter = () => {
  const { contract, isConnected, account } = useWeb3();
  const [pixelData, setPixelData] = useState({});
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [paintingFee, setPaintingFee] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  // Check if contract is properly deployed
  const isContractDeployed = useCallback(() => {
    return contract && contract.target !== '0x0000000000000000000000000000000000000000';
  }, [contract]);

  // Load painting fee
  const loadPaintingFee = useCallback(async () => {
    if (!contract || !isContractDeployed()) {
      setPaintingFee('0');
      return;
    }

    try {
      const fee = await contract.paintingFee();
      setPaintingFee(ethers.formatEther(fee));
    } catch (error) {
      console.error('Failed to load painting fee:', error);
      // If we can't load the fee, it likely means the contract isn't deployed
      if (error.message.includes('could not decode result data')) {
        setTransactionStatus({
          type: 'error',
          message: 'Smart contract not deployed. Please deploy the contract first and update the address in config.'
        });
      }
      setPaintingFee('0');
    }
  }, [contract, isContractDeployed]);

  // Load pixel data from contract
  const loadPixelData = useCallback(async (coordinates = null) => {
    if (!contract || !isContractDeployed()) return;

    setIsLoading(true);
    try {
      if (coordinates && coordinates.length > 0) {
        // Load specific pixels
        const [colors, painters, timestamps] = await contract.getPixelsBatch(coordinates);
        
        const newPixelData = { ...pixelData };
        coordinates.forEach((coord, index) => {
          const [x, y] = coord;
          const key = `${x}-${y}`;
          if (colors[index] && colors[index] !== '') {
            newPixelData[key] = {
              color: colors[index],
              painter: painters[index],
              timestamp: Number(timestamps[index])
            };
          }
        });
        setPixelData(newPixelData);
      } else {
        // Load all pixels (this might be expensive, consider pagination)
        const newPixelData = {};
        const batchSize = 100; // Load in batches to avoid gas limit issues
        
        for (let batch = 0; batch < 100; batch++) { // 100 batches of 100 pixels each
          const coordinates = [];
          for (let i = 0; i < batchSize; i++) {
            const pixelIndex = batch * batchSize + i;
            if (pixelIndex >= 10000) break; // 100x100 = 10,000 pixels
            
            const x = pixelIndex % 100;
            const y = Math.floor(pixelIndex / 100);
            coordinates.push([x, y]);
          }
          
          if (coordinates.length === 0) break;
          
          try {
            const [colors, painters, timestamps] = await contract.getPixelsBatch(coordinates);
            
            coordinates.forEach((coord, index) => {
              const [x, y] = coord;
              const key = `${x}-${y}`;
              if (colors[index] && colors[index] !== '') {
                newPixelData[key] = {
                  color: colors[index],
                  painter: painters[index],
                  timestamp: Number(timestamps[index])
                };
              }
            });
          } catch (error) {
            console.error(`Failed to load batch ${batch}:`, error);
            break; // Stop loading if we hit an error
          }
        }
        
        setPixelData(newPixelData);
      }
    } catch (error) {
      console.error('Failed to load pixel data:', error);
      if (error.message.includes('could not decode result data')) {
        setTransactionStatus({
          type: 'error',
          message: 'Smart contract not deployed. Please deploy the contract first and update the address in config.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [contract, pixelData, isContractDeployed]);

  // Paint a pixel - Optimized for immediate MetaMask popup
  const paintPixel = useCallback(async (x, y, color) => {
    if (!contract || !isConnected || isTransactionPending) {
      return false;
    }

    if (!isContractDeployed()) {
      setTransactionStatus({
        type: 'error',
        message: 'Smart contract not deployed. Please deploy the contract first and update the address in config.'
      });
      return false;
    }

    // Set pending state immediately to prevent multiple clicks
    setIsTransactionPending(true);
    setTransactionStatus({ type: 'pending', message: 'Preparing transaction...' });

    try {
      // Get current painting fee first (this should be fast if cached)
      let fee;
      try {
        fee = await contract.paintingFee();
      } catch (error) {
        console.error('Failed to get painting fee:', error);
        throw new Error('Could not get painting fee. Contract may not be deployed.');
      }

      // Immediately call the paintPixel function - this will trigger MetaMask popup
      setTransactionStatus({ type: 'pending', message: 'Please confirm transaction in MetaMask...' });
      
      const tx = await contract.paintPixel(x, y, color, {
        value: fee,
        gasLimit: 300000 // Set a reasonable gas limit
      });

      // Transaction was sent successfully (user confirmed in MetaMask)
      setTransactionStatus({ 
        type: 'pending', 
        message: `Transaction submitted: ${tx.hash.slice(0, 10)}...` 
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Transaction successful
        setTransactionStatus({ 
          type: 'success', 
          message: 'Pixel painted successfully!' 
        });

        // Update local pixel data immediately for better UX
        const key = `${x}-${y}`;
        setPixelData(prev => ({
          ...prev,
          [key]: {
            color,
            painter: account,
            timestamp: Math.floor(Date.now() / 1000)
          }
        }));

        return true;
      } else {
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
      } else if (error.message.includes('could not decode result data')) {
        errorMessage = 'Smart contract not deployed. Please deploy the contract first.';
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
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setTransactionStatus(null);
      }, 5000);
    }
  }, [contract, isConnected, isTransactionPending, account, isContractDeployed]);

  // Load initial data when contract is available
  useEffect(() => {
    if (contract && isConnected && isContractDeployed()) {
      loadPaintingFee();
      // Don't load all pixels initially to avoid performance issues
      // loadPixelData();
    }
  }, [contract, isConnected, loadPaintingFee, isContractDeployed]);

  // Listen for PixelPainted events
  useEffect(() => {
    if (!contract || !isContractDeployed()) return;

    const handlePixelPainted = (x, y, color, painter, event) => {
      const key = `${x}-${y}`;
      setPixelData(prev => ({
        ...prev,
        [key]: {
          color,
          painter,
          timestamp: Math.floor(Date.now() / 1000)
        }
      }));
    };

    // Listen for events
    contract.on('PixelPainted', handlePixelPainted);

    return () => {
      contract.off('PixelPainted', handlePixelPainted);
    };
  }, [contract, isContractDeployed]);

  return {
    pixelData,
    isTransactionPending,
    transactionStatus,
    paintingFee,
    isLoading,
    paintPixel,
    loadPixelData,
    loadPaintingFee,
    isContractDeployed: isContractDeployed()
  };
};

