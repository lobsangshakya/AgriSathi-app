# AgriCreds Wallet & Ethereum Integration - Deployment Guide

## Overview

This guide explains how to deploy the AgriCreds smart contract and integrate it with the AgriSaathi app's wallet functionality.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Test ETH** for deployment (you can get this from faucets)
4. **Hardhat** or **Remix** for smart contract deployment

## Smart Contract Deployment

### Option 1: Using Hardhat (Recommended)

1. **Install Hardhat:**
   ```bash
   npm install --save-dev hardhat @openzeppelin/contracts
   npx hardhat init
   ```

2. **Create hardhat.config.js:**
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.19",
     networks: {
       sepolia: {
         url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       },
       goerli: {
         url: process.env.GOERLI_URL || "https://goerli.infura.io/v3/YOUR-PROJECT-ID",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       }
     }
   };
   ```

3. **Create .env file:**
   ```
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
   ```

4. **Deploy the contract:**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Option 2: Using Remix (Easier for beginners)

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file called `AgriCredsToken.sol`
3. Copy the contract code from `contracts/AgriCredsToken.sol`
4. Compile the contract (Solidity Compiler plugin)
5. Deploy using the Deploy & Run Transactions plugin
6. Select "Injected Provider - MetaMask" as environment
7. Connect your MetaMask wallet
8. Deploy the contract

## Contract Configuration

After deployment, you'll need to:

1. **Update the contract address** in `src/contexts/WalletContext.tsx`:
   ```typescript
   const AGRICREDS_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```

2. **Set initial exchange rates** (optional):
   ```javascript
   // Call updateExchangeRates function
   await contract.updateExchangeRates(
     ethers.utils.parseEther("0.001"), // Buy rate: 1 AgriCred = 0.001 ETH
     ethers.utils.parseEther("0.0008") // Sell rate: 1 AgriCred = 0.0008 ETH
   );
   ```

## App Integration

### 1. Update Contract Address

Replace the mock contract address in `src/contexts/WalletContext.tsx`:

```typescript
// Replace this line
const AGRICREDS_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

// With your deployed contract address
const AGRICREDS_CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 2. Update ABI

The current implementation uses a simplified ABI. For production, use the full ABI from the compiled contract:

```typescript
const AGRICREDS_ABI = [
  // Copy the full ABI from your compiled contract
  // This will include all functions and events
];
```

### 3. Test the Integration

1. **Connect MetaMask** to the wallet page
2. **Buy some AgriCreds** with test ETH
3. **Send AgriCreds** to another address
4. **Sell AgriCreds** back to ETH
5. **Check transaction history**

## Security Considerations

### For Production Deployment

1. **Audit the smart contract** before mainnet deployment
2. **Use a multisig wallet** for contract ownership
3. **Implement rate limiting** to prevent abuse
4. **Add emergency pause functionality**
5. **Monitor for unusual activity**

### Access Control

- Only the contract owner can award AgriCreds for community participation
- Only the contract owner can spend user's AgriCreds for services
- Users can only buy/sell their own AgriCreds

## Testing

### Test Scenarios

1. **Buy AgriCreds:**
   - Send ETH to contract
   - Verify AgriCreds are minted to user
   - Check exchange rate calculations

2. **Sell AgriCreds:**
   - Burn user's AgriCreds
   - Send ETH back to user
   - Verify correct amounts

3. **Earn AgriCreds:**
   - Owner calls earnAgriCreds function
   - Verify daily limits are enforced
   - Check events are emitted

4. **Spend AgriCreds:**
   - Owner calls spendAgriCreds function
   - Verify sufficient balance checks
   - Check events are emitted

### Test Networks

- **Sepolia** (recommended for testing)
- **Goerli** (alternative testnet)
- **Local Hardhat network** (for development)

## Gas Optimization

The contract is optimized for:
- Minimal gas usage for common operations
- Efficient storage patterns
- Batch operations where possible

## Monitoring

### Events to Monitor

1. **AgriCredsEarned** - When users earn credits
2. **AgriCredsSpent** - When credits are spent
3. **ExchangeRateUpdated** - When rates change
4. **Transfer** - Standard ERC20 transfers

### Key Metrics

- Total supply of AgriCreds
- ETH balance in contract
- Daily earning limits
- Exchange rates
- User balances

## Troubleshooting

### Common Issues

1. **"MetaMask not found"**
   - Ensure MetaMask is installed and unlocked
   - Check if the correct network is selected

2. **"Insufficient ETH"**
   - Add more test ETH to your wallet
   - Check current gas prices

3. **"Transaction failed"**
   - Check if contract is paused
   - Verify sufficient balance
   - Check daily earning limits

4. **"Invalid address"**
   - Ensure you're using a valid Ethereum address
   - Check for typos in the address

### Support

For technical support:
1. Check the browser console for errors
2. Verify MetaMask connection
3. Ensure you're on the correct network
4. Check contract deployment status

## Future Enhancements

### Planned Features

1. **Staking mechanism** - Earn rewards by staking AgriCreds
2. **Governance** - Community voting on platform decisions
3. **Cross-chain bridges** - Support for other blockchains
4. **Advanced analytics** - Detailed usage statistics
5. **Mobile wallet integration** - Native mobile wallet support

### Scalability

The contract is designed to handle:
- Thousands of daily transactions
- Multiple earning sources
- Flexible exchange rates
- Emergency controls

## Conclusion

The AgriCreds wallet system provides a secure, transparent way for farmers to earn and spend credits within the AgriSaathi ecosystem. The smart contract ensures fair distribution and prevents abuse while maintaining user control over their assets.

For questions or support, please refer to the documentation or contact the development team. 