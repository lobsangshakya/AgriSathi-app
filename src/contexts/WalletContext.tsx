import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useLanguage } from './LanguageContext';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  // Wallet state
  isConnected: boolean;
  account: string | null;
  balance: string;
  agriCredsBalance: number;
  
  // Wallet actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendAgriCreds: (to: string, amount: number) => Promise<void>;
  buyAgriCreds: (amount: number) => Promise<void>;
  sellAgriCreds: (amount: number) => Promise<void>;
  
  // Loading states
  isConnecting: boolean;
  isTransacting: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock AgriCreds Token Contract ABI (simplified for demo)
const AGRICREDS_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(address from, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Mock contract address (in real app, this would be the deployed contract address)
const AGRICREDS_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [agriCredsBalance, setAgriCredsBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize wallet connection
  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (ethereumProvider) {
        const web3Provider = new ethers.providers.Web3Provider(ethereumProvider);
        setProvider(web3Provider);
        
        // Create contract instance
        const agriCredsContract = new ethers.Contract(
          AGRICREDS_CONTRACT_ADDRESS,
          AGRICREDS_ABI,
          web3Provider.getSigner()
        );
        setContract(agriCredsContract);
        
        // Check if already connected
        const accounts = await (ethereumProvider as any).request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await handleAccountsChanged(accounts);
        }
        
        // Listen for account changes
        ethereumProvider.on('accountsChanged', handleAccountsChanged);
        ethereumProvider.on('chainChanged', () => window.location.reload());
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setError(language === 'hindi' ? 'वॉलेट प्रारंभ करने में त्रुटि' : 'Failed to initialize wallet');
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setIsConnected(false);
      setAccount(null);
      setBalance('0');
      setAgriCredsBalance(0);
    } else {
      // User connected wallet
      const account = accounts[0];
      setAccount(account);
      setIsConnected(true);
      
      // Get ETH balance
      if (provider) {
        const ethBalance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(ethBalance));
        
        // Get AgriCreds balance (mock for demo)
        setAgriCredsBalance(Math.floor(Math.random() * 1000) + 100);
      }
    }
  };

  const connectWallet = async () => {
    if (!provider) {
      toast({
        title: language === 'hindi' ? 'MetaMask नहीं मिला' : 'MetaMask not found',
        description: language === 'hindi' 
          ? 'कृपया MetaMask इंस्टॉल करें और पेज को रिफ्रेश करें'
          : 'Please install MetaMask and refresh the page',
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      await handleAccountsChanged(accounts);
      
      toast({
        title: language === 'hindi' ? 'वॉलेट कनेक्ट हो गया' : 'Wallet Connected',
        description: language === 'hindi' 
          ? 'आपका MetaMask वॉलेट सफलतापूर्वक कनेक्ट हो गया है'
          : 'Your MetaMask wallet has been connected successfully',
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(
        language === 'hindi' 
          ? 'वॉलेट कनेक्ट करने में त्रुटि: ' + (error.message || 'अज्ञात त्रुटि')
          : 'Failed to connect wallet: ' + (error.message || 'Unknown error')
      );
      
      toast({
        title: language === 'hindi' ? 'कनेक्शन विफल' : 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance('0');
    setAgriCredsBalance(0);
    setError(null);
    
    toast({
      title: language === 'hindi' ? 'वॉलेट डिस्कनेक्ट' : 'Wallet Disconnected',
      description: language === 'hindi' 
        ? 'आपका वॉलेट डिस्कनेक्ट हो गया है'
        : 'Your wallet has been disconnected',
    });
  };

  const sendAgriCreds = async (to: string, amount: number) => {
    if (!contract || !account) {
      toast({
        title: language === 'hindi' ? 'वॉलेट कनेक्ट नहीं' : 'Wallet not connected',
        description: language === 'hindi' 
          ? 'कृपया पहले अपना वॉलेट कनेक्ट करें'
          : 'Please connect your wallet first',
        variant: "destructive",
      });
      return;
    }

    if (agriCredsBalance < amount) {
      toast({
        title: language === 'hindi' ? 'अपर्याप्त बैलेंस' : 'Insufficient Balance',
        description: language === 'hindi' 
          ? 'आपके पास पर्याप्त AgriCreds नहीं हैं'
          : 'You don\'t have enough AgriCreds',
        variant: "destructive",
      });
      return;
    }

    setIsTransacting(true);
    setError(null);

    try {
      // Mock transaction for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local balance
      setAgriCredsBalance(prev => prev - amount);
      
      toast({
        title: language === 'hindi' ? 'AgriCreds भेजे गए' : 'AgriCreds Sent',
        description: language === 'hindi' 
          ? `${amount} AgriCreds सफलतापूर्वक भेजे गए`
          : `${amount} AgriCreds sent successfully`,
      });
    } catch (error: any) {
      console.error('Failed to send AgriCreds:', error);
      setError(
        language === 'hindi' 
          ? 'AgriCreds भेजने में त्रुटि: ' + (error.message || 'अज्ञात त्रुटि')
          : 'Failed to send AgriCreds: ' + (error.message || 'Unknown error')
      );
      
      toast({
        title: language === 'hindi' ? 'लेन-देन विफल' : 'Transaction Failed',
        description: error.message || 'Failed to send AgriCreds',
        variant: "destructive",
      });
    } finally {
      setIsTransacting(false);
    }
  };

  const buyAgriCreds = async (amount: number) => {
    if (!provider || !account) {
      toast({
        title: language === 'hindi' ? 'वॉलेट कनेक्ट नहीं' : 'Wallet not connected',
        description: language === 'hindi' 
          ? 'कृपया पहले अपना वॉलेट कनेक्ट करें'
          : 'Please connect your wallet first',
        variant: "destructive",
      });
      return;
    }

    const ethRequired = amount * 0.001; // 1 AgriCred = 0.001 ETH
    const currentBalance = parseFloat(balance);

    if (currentBalance < ethRequired) {
      toast({
        title: language === 'hindi' ? 'अपर्याप्त ETH' : 'Insufficient ETH',
        description: language === 'hindi' 
          ? `आपको ${ethRequired.toFixed(4)} ETH की आवश्यकता है`
          : `You need ${ethRequired.toFixed(4)} ETH`,
        variant: "destructive",
      });
      return;
    }

    setIsTransacting(true);
    setError(null);

    try {
      // Mock transaction for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update balances
      setAgriCredsBalance(prev => prev + amount);
      setBalance(prev => (parseFloat(prev) - ethRequired).toString());
      
      toast({
        title: language === 'hindi' ? 'AgriCreds खरीदे गए' : 'AgriCreds Purchased',
        description: language === 'hindi' 
          ? `${amount} AgriCreds सफलतापूर्वक खरीदे गए`
          : `${amount} AgriCreds purchased successfully`,
      });
    } catch (error: any) {
      console.error('Failed to buy AgriCreds:', error);
      setError(
        language === 'hindi' 
          ? 'AgriCreds खरीदने में त्रुटि: ' + (error.message || 'अज्ञात त्रुटि')
          : 'Failed to buy AgriCreds: ' + (error.message || 'Unknown error')
      );
      
      toast({
        title: language === 'hindi' ? 'खरीद विफल' : 'Purchase Failed',
        description: error.message || 'Failed to buy AgriCreds',
        variant: "destructive",
      });
    } finally {
      setIsTransacting(false);
    }
  };

  const sellAgriCreds = async (amount: number) => {
    if (!provider || !account) {
      toast({
        title: language === 'hindi' ? 'वॉलेट कनेक्ट नहीं' : 'Wallet not connected',
        description: language === 'hindi' 
          ? 'कृपया पहले अपना वॉलेट कनेक्ट करें'
          : 'Please connect your wallet first',
        variant: "destructive",
      });
      return;
    }

    if (agriCredsBalance < amount) {
      toast({
        title: language === 'hindi' ? 'अपर्याप्त AgriCreds' : 'Insufficient AgriCreds',
        description: language === 'hindi' 
          ? 'आपके पास पर्याप्त AgriCreds नहीं हैं'
          : 'You don\'t have enough AgriCreds',
        variant: "destructive",
      });
      return;
    }

    setIsTransacting(true);
    setError(null);

    try {
      // Mock transaction for demo
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const ethReceived = amount * 0.0008; // 1 AgriCred = 0.0008 ETH (slightly less than buy price)
      
      // Update balances
      setAgriCredsBalance(prev => prev - amount);
      setBalance(prev => (parseFloat(prev) + ethReceived).toString());
      
      toast({
        title: language === 'hindi' ? 'AgriCreds बेचे गए' : 'AgriCreds Sold',
        description: language === 'hindi' 
          ? `${amount} AgriCreds सफलतापूर्वक बेचे गए`
          : `${amount} AgriCreds sold successfully`,
      });
    } catch (error: any) {
      console.error('Failed to sell AgriCreds:', error);
      setError(
        language === 'hindi' 
          ? 'AgriCreds बेचने में त्रुटि: ' + (error.message || 'अज्ञात त्रुटि')
          : 'Failed to sell AgriCreds: ' + (error.message || 'Unknown error')
      );
      
      toast({
        title: language === 'hindi' ? 'बिक्री विफल' : 'Sale Failed',
        description: error.message || 'Failed to sell AgriCreds',
        variant: "destructive",
      });
    } finally {
      setIsTransacting(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: WalletContextType = {
    isConnected,
    account,
    balance,
    agriCredsBalance,
    connectWallet,
    disconnectWallet,
    sendAgriCreds,
    buyAgriCreds,
    sellAgriCreds,
    isConnecting,
    isTransacting,
    error,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 