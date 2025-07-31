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

  // Load painting fee
  const loadPaintingFee = useCallback(async () => {
    if (!contract) return;

    try {
      const fee = await contract.paintingFee();
      setPaintingFee(ethers.formatEther(fee));
    } catch (error) {
      console.error('Failed to load painting fee:', error);
    }
  }, [contract]);

  // Load pixel data from contract
  const loadPixelData = useCallback(async (coordinates = null) => {
    if (!contract) return;

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
    } finally {
      setIsLoading(false);
    }
  }, [contract, pixelData]);

  // Paint a pixel
  const paintPixel = useCallback(async (x, y, color) => {
    if (!contract || !isConnected || isTransactionPending) {
      return false;
    }

    setIsTransactionPending(true);
    setTransactionStatus({ type: 'pending', message: 'Transaction pending...' });

    try {
      // Get current painting fee
      const fee = await contract.paintingFee();
      
      // Call the paintPixel function
      const tx = await contract.paintPixel(x, y, color, {
        value: fee,
        gasLimit: 300000 // Set a reasonable gas limit
      });

      setTransactionStatus({ 
        type: 'pending', 
        message: `Transaction submitted: ${tx.hash}` 
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Transaction successful
        setTransactionStatus({ 
          type: 'success', 
          message: 'Pixel painted successfully!' 
        });

        // Update local pixel data
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
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
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
  }, [contract, isConnected, isTransactionPending, account]);

  // Load initial data when contract is available
  useEffect(() => {
    if (contract && isConnected) {
      loadPaintingFee();
      // Don't load all pixels initially to avoid performance issues
      // loadPixelData();
    }
  }, [contract, isConnected, loadPaintingFee]);

  // Listen for PixelPainted events
  useEffect(() => {
    if (!contract) return;

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
  }, [contract]);

  return {
    pixelData,
    isTransactionPending,
    transactionStatus,
    paintingFee,
    isLoading,
    paintPixel,
    loadPixelData,
    loadPaintingFee
  };
};

