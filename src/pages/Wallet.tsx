import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWallet } from '@/contexts/WalletContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  Coins, 
  Send, 
  Download, 
  Upload, 
  Copy, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Shield,
  TrendingUp,
  History,
  QrCode,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function WalletPage() {
  const { language, t } = useLanguage();
  const { 
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
    clearError
  } = useWallet();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'buy' | 'sell' | 'history'>('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  // Mock transaction history
  const [transactions] = useState([
    {
      id: 1,
      type: 'send',
      amount: 50,
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      timestamp: new Date(Date.now() - 3600000),
      status: 'completed'
    },
    {
      id: 2,
      type: 'buy',
      amount: 100,
      ethAmount: 0.1,
      timestamp: new Date(Date.now() - 7200000),
      status: 'completed'
    },
    {
      id: 3,
      type: 'receive',
      amount: 25,
      from: '0x1234567890123456789012345678901234567890',
      timestamp: new Date(Date.now() - 86400000),
      status: 'completed'
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: language === 'hindi' ? 'कॉपी हो गया' : 'Copied',
      description: language === 'hindi' 
        ? 'पता क्लिपबोर्ड पर कॉपी हो गया है'
        : 'Address copied to clipboard',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSend = async () => {
    const amount = parseInt(sendAmount);
    if (!amount || amount <= 0) {
      toast({
        title: language === 'hindi' ? 'अमान्य राशि' : 'Invalid Amount',
        description: language === 'hindi' 
          ? 'कृपया एक वैध राशि दर्ज करें'
          : 'Please enter a valid amount',
        variant: "destructive",
      });
      return;
    }

    if (!sendAddress || sendAddress.length !== 42) {
      toast({
        title: language === 'hindi' ? 'अमान्य पता' : 'Invalid Address',
        description: language === 'hindi' 
          ? 'कृपया एक वैध Ethereum पता दर्ज करें'
          : 'Please enter a valid Ethereum address',
        variant: "destructive",
      });
      return;
    }

    await sendAgriCreds(sendAddress, amount);
    setSendAmount('');
    setSendAddress('');
  };

  const handleBuy = async () => {
    const amount = parseInt(buyAmount);
    if (!amount || amount <= 0) {
      toast({
        title: language === 'hindi' ? 'अमान्य राशि' : 'Invalid Amount',
        description: language === 'hindi' 
          ? 'कृपया एक वैध राशि दर्ज करें'
          : 'Please enter a valid amount',
        variant: "destructive",
      });
      return;
    }

    await buyAgriCreds(amount);
    setBuyAmount('');
  };

  const handleSell = async () => {
    const amount = parseInt(sellAmount);
    if (!amount || amount <= 0) {
      toast({
        title: language === 'hindi' ? 'अमान्य राशि' : 'Invalid Amount',
        description: language === 'hindi' 
          ? 'कृपया एक वैध राशि दर्ज करें'
          : 'Please enter a valid amount',
        variant: "destructive",
      });
      return;
    }

    await sellAgriCreds(amount);
    setSellAmount('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'buy':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'sell':
        return <Upload className="h-4 w-4 text-orange-500" />;
      default:
        return <Coins className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionText = (transaction: any) => {
    switch (transaction.type) {
      case 'send':
        return language === 'hindi' ? 'भेजा गया' : 'Sent';
      case 'receive':
        return language === 'hindi' ? 'प्राप्त किया' : 'Received';
      case 'buy':
        return language === 'hindi' ? 'खरीदा' : 'Bought';
      case 'sell':
        return language === 'hindi' ? 'बेचा' : 'Sold';
      default:
        return transaction.type;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header title={language === 'hindi' ? 'वॉलेट' : 'Wallet'} />
        
        <div className="p-4 space-y-6">
          <Card className="text-center">
            <CardContent className="p-8">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">
                {language === 'hindi' ? 'वॉलेट कनेक्ट करें' : 'Connect Wallet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'hindi' 
                  ? 'अपने AgriCreds को प्रबंधित करने के लिए MetaMask से कनेक्ट करें'
                  : 'Connect with MetaMask to manage your AgriCreds'
                }
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {language === 'hindi' ? 'कनेक्ट हो रहा है...' : 'Connecting...'}
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'MetaMask से कनेक्ट करें' : 'Connect MetaMask'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header title={language === 'hindi' ? 'वॉलेट' : 'Wallet'} />
      
      <div className="p-4 space-y-6">
        {/* Wallet Overview */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'hindi' ? 'AgriCreds वॉलेट' : 'AgriCreds Wallet'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={disconnectWallet}
                className="text-white hover:bg-white/20"
              >
                {language === 'hindi' ? 'डिस्कनेक्ट' : 'Disconnect'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{agriCredsBalance}</div>
                <div className="text-sm opacity-90">AgriCreds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{parseFloat(balance).toFixed(4)}</div>
                <div className="text-sm opacity-90">ETH</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">
                  {language === 'hindi' ? 'वॉलेट पता' : 'Wallet Address'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(account!)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="font-mono text-sm mt-1">
                {formatAddress(account!)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-red-700 text-sm">{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="text-red-700 hover:bg-red-100"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'overview', label: language === 'hindi' ? 'अवलोकन' : 'Overview', icon: Wallet },
            { key: 'send', label: language === 'hindi' ? 'भेजें' : 'Send', icon: Send },
            { key: 'buy', label: language === 'hindi' ? 'खरीदें' : 'Buy', icon: Download },
            { key: 'sell', label: language === 'hindi' ? 'बेचें' : 'Sell', icon: Upload },
            { key: 'history', label: language === 'hindi' ? 'इतिहास' : 'History', icon: History }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
                className="flex-1"
              >
                <IconComponent className="h-4 w-4 mr-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {language === 'hindi' ? 'कीमतें' : 'Prices'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{language === 'hindi' ? '1 AgriCred =' : '1 AgriCred ='}</span>
                    <span className="font-semibold">0.001 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'hindi' ? '1 AgriCred =' : '1 AgriCred ='}</span>
                    <span className="font-semibold">0.0008 ETH (बिक्री)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {language === 'hindi' ? 'सुरक्षा' : 'Security'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {language === 'hindi' ? 'वॉलेट सुरक्षित है' : 'Wallet is secure'}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Send Tab */}
          {activeTab === 'send' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  {language === 'hindi' ? 'AgriCreds भेजें' : 'Send AgriCreds'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">
                    {language === 'hindi' ? 'प्राप्तकर्ता का पता' : 'Recipient Address'}
                  </Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">
                    {language === 'hindi' ? 'राशि' : 'Amount'}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSend} 
                  disabled={isTransacting || !sendAmount || !sendAddress}
                  className="w-full"
                >
                  {isTransacting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'hindi' ? 'भेज रहा है...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'भेजें' : 'Send'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Buy Tab */}
          {activeTab === 'buy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {language === 'hindi' ? 'AgriCreds खरीदें' : 'Buy AgriCreds'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="buyAmount">
                    {language === 'hindi' ? 'AgriCreds की संख्या' : 'Number of AgriCreds'}
                  </Label>
                  <Input
                    id="buyAmount"
                    type="number"
                    placeholder="0"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                  />
                </div>
                {buyAmount && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">
                      {language === 'hindi' ? 'आवश्यक ETH:' : 'ETH Required:'} {(parseInt(buyAmount) * 0.001).toFixed(4)} ETH
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleBuy} 
                  disabled={isTransacting || !buyAmount}
                  className="w-full"
                >
                  {isTransacting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'hindi' ? 'खरीद रहा है...' : 'Buying...'}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'खरीदें' : 'Buy'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Sell Tab */}
          {activeTab === 'sell' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {language === 'hindi' ? 'AgriCreds बेचें' : 'Sell AgriCreds'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sellAmount">
                    {language === 'hindi' ? 'AgriCreds की संख्या' : 'Number of AgriCreds'}
                  </Label>
                  <Input
                    id="sellAmount"
                    type="number"
                    placeholder="0"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                  />
                </div>
                {sellAmount && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-700">
                      {language === 'hindi' ? 'प्राप्त ETH:' : 'ETH Received:'} {(parseInt(sellAmount) * 0.0008).toFixed(4)} ETH
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleSell} 
                  disabled={isTransacting || !sellAmount}
                  className="w-full"
                >
                  {isTransacting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'hindi' ? 'बेच रहा है...' : 'Selling...'}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'बेचें' : 'Sell'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {language === 'hindi' ? 'लेन-देन इतिहास' : 'Transaction History'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <div className="font-medium">{getTransactionText(tx)}</div>
                          <div className="text-sm text-gray-500">
                            {tx.type === 'send' || tx.type === 'receive' 
                              ? formatAddress(tx.to || tx.from)
                              : `${tx.amount} AgriCreds`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {tx.type === 'buy' ? `+${tx.amount}` : tx.type === 'sell' ? `-${tx.amount}` : `${tx.amount}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/agri-credits')}
            className="h-12"
          >
            <Coins className="h-4 w-4 mr-2" />
            {language === 'hindi' ? 'AgriCredits' : 'AgriCredits'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
            className="h-12"
          >
            <Settings className="h-4 w-4 mr-2" />
            {language === 'hindi' ? 'प्रोफाइल' : 'Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
} 