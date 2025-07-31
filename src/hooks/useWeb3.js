import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MONAD_TESTNET_CONFIG, CONTRACT_CONFIG } from '../config/web3.js';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Add Monad Testnet to MetaMask
  const addMonadTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${MONAD_TESTNET_CONFIG.chainId.toString(16)}`,
          chainName: MONAD_TESTNET_CONFIG.name,
          nativeCurrency: {
            name: MONAD_TESTNET_CONFIG.currency,
            symbol: MONAD_TESTNET_CONFIG.currency,
            decimals: 18,
          },
          rpcUrls: [MONAD_TESTNET_CONFIG.rpcUrl],
          blockExplorerUrls: [MONAD_TESTNET_CONFIG.explorerUrl],
        }],
      });
      return true;
    } catch (error) {
      console.error('Failed to add Monad Testnet:', error);
      return false;
    }
  };

  // Switch to Monad Testnet
  const switchToMonadTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${MONAD_TESTNET_CONFIG.chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added, try to add it
        return await addMonadTestnet();
      }
      console.error('Failed to switch to Monad Testnet:', error);
      return false;
    }
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      // Check if we're on the correct network
      if (Number(network.chainId) !== MONAD_TESTNET_CONFIG.chainId) {
        const switched = await switchToMonadTestnet();
        if (!switched) {
          throw new Error('Please switch to Monad Testnet');
        }
        // Refresh provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        setProvider(newProvider);
        setSigner(newSigner);
      } else {
        setProvider(web3Provider);
        setSigner(web3Signer);
      }

      // Create contract instance
      const contractInstance = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        web3Signer
      );

      setContract(contractInstance);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error.message);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setIsConnected(false);
    setChainId(null);
    setError(null);
  }, []);

  // Handle account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16);
      setChainId(newChainId);
      
      if (newChainId !== MONAD_TESTNET_CONFIG.chainId) {
        setError('Please switch to Monad Testnet');
        setIsConnected(false);
      } else {
        setError(null);
        if (account) {
          setIsConnected(true);
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const network = await web3Provider.getNetwork();
          
          if (Number(network.chainId) === MONAD_TESTNET_CONFIG.chainId) {
            await connectWallet();
          }
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    };

    checkConnection();
  }, [connectWallet]);

  return {
    provider,
    signer,
    account,
    contract,
    isConnected,
    isConnecting,
    chainId,
    error,
    connectWallet,
    disconnectWallet,
    switchToMonadTestnet,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};

