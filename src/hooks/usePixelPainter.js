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
    const deployed = contract && contract.target !== '0x0000000000000000000000000000000000000000';
    console.log('isContractDeployed:', deployed, 'Contract target:', contract ? contract.target : 'N/A');
    return deployed;
  }, [contract]);

  // Load painting fee
  const loadPaintingFee = useCallback(async () => {
    console.log('Attempting to load painting fee...');
    if (!contract || !isContractDeployed()) {
      console.log('Contract not ready or not deployed, setting fee to 0.');
      setPaintingFee('0');
      return;
    }

    try {
      const fee = await contract.paintingFee();
      setPaintingFee(ethers.formatEther(fee));
      console.log('Painting fee loaded:', ethers.formatEther(fee));
    } catch (error) {
      console.error('Failed to load painting fee:', error);
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
    console.log('Attempting to load pixel data...');
    if (!contract || !isContractDeployed()) {
      console.log('Contract not ready or not deployed, skipping pixel data load.');
      return;
    }

    setIsLoading(true);
    try {
      if (coordinates && coordinates.length > 0) {
        console.log('Loading specific pixels:', coordinates);
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
        console.log('Specific pixels loaded.');
      } else {
        console.log('Loading all pixels (batch mode)...');
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
        console.log('All pixels loaded.');
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
    console.log(`Attempting to paint pixel (${x}, ${y}) with color ${color}...`);
    if (!contract || !isConnected || isTransactionPending) {
      console.log('Paint pixel conditions not met:', { contract: !!contract, isConnected, isTransactionPending });
      return false;
    }

    if (!isContractDeployed()) {
      console.log('Contract not deployed, cannot paint pixel.');
      setTransactionStatus({
        type: 'error',
        message: 'Smart contract not deployed. Please deploy the contract first and update the address in config.'
      });
      return false;
    }

    // Set pending state immediately to prevent multiple clicks
    setIsTransactionPending(true);
    setTransactionStatus({ type: 'pending', message: 'Preparing transaction...' });
    console.log('Transaction pending state set.');

    try {
      // Get current painting fee first (this should be fast if cached)
      let fee;
      try {
        console.log('Fetching painting fee...');
        fee = await contract.paintingFee();
        console.log('Painting fee fetched:', ethers.formatEther(fee));
      } catch (error) {
        console.error('Failed to get painting fee:', error);
        throw new Error('Could not get painting fee. Contract may not be deployed.');
      }

      // Immediately call the paintPixel function - this will trigger MetaMask popup
      setTransactionStatus({ type: 'pending', message: 'Please confirm transaction in MetaMask...' });
      console.log('Calling contract.paintPixel...');
      
      const tx = await contract.paintPixel(x, y, color, {
        value: fee,
        gasLimit: 300000 // Set a reasonable gas limit
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
      console.log('Transaction pending state reset.');
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setTransactionStatus(null);
        console.log('Transaction status cleared.');
      }, 5000);
    }
  }, [contract, isConnected, isTransactionPending, account, isContractDeployed]);

  // Load initial data when contract is available
  useEffect(() => {
    console.log('useEffect: Contract or connection status changed.');
    if (contract && isConnected && isContractDeployed()) {
      console.log('useEffect: Contract ready and connected, loading painting fee.');
      loadPaintingFee();
      // Don't load all pixels initially to avoid performance issues
      // loadPixelData();
    } else {
      console.log('useEffect: Contract not ready or not connected, skipping initial load.');
    }
  }, [contract, isConnected, loadPaintingFee, isContractDeployed]);

  // Listen for PixelPainted events
  useEffect(() => {
    console.log('useEffect: Setting up event listener.');
    if (!contract || !isContractDeployed()) {
      console.log('Contract not ready for event listener.');
      return;
    }

    const handlePixelPainted = (x, y, color, painter, event) => {
      console.log('PixelPainted event received:', { x, y, color, painter, event });
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
    console.log('PixelPainted event listener attached.');

    return () => {
      contract.off('PixelPainted', handlePixelPainted);
      console.log('PixelPainted event listener detached.');
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

