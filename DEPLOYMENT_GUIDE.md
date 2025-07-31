# Smart Contract Deployment Guide

## Prerequisites

1. **MetaMask Extension**: Make sure you have MetaMask installed and configured
2. **Monad Testnet Setup**: Add Monad Testnet to your MetaMask with these settings:
   - Network Name: `Monad Testnet`
   - RPC URL: `testnet-rpc.monad.xyz`
   - Chain ID: `10143`
   - Currency Symbol: `MON`
   - Block Explorer: `testnet.monadexplorer.com`

3. **Test Tokens**: Get some MON tokens from the Monad Testnet faucet for gas fees

## Step-by-Step Deployment

### Step 1: Open Remix IDE
1. Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Create a new file called `PixelPainter.sol`

### Step 2: Copy the Smart Contract
1. Copy the entire content from `contracts/PixelPainter.sol` in this repository
2. Paste it into the new file in Remix IDE

### Step 3: Compile the Contract
1. Go to the "Solidity Compiler" tab (second icon on the left)
2. Select compiler version `0.8.19` or higher
3. Click "Compile PixelPainter.sol"
4. Make sure there are no compilation errors

### Step 4: Deploy the Contract
1. Go to the "Deploy & Run Transactions" tab (third icon on the left)
2. In the "Environment" dropdown, select "Injected Provider - MetaMask"
3. Make sure MetaMask is connected to Monad Testnet
4. Select "PixelPainter" from the contract dropdown
5. Click "Deploy"
6. Confirm the transaction in MetaMask

### Step 5: Copy the Contract Address
1. After successful deployment, you'll see the contract in the "Deployed Contracts" section
2. Copy the contract address (it will look like `0x1234...abcd`)

### Step 6: Update the Frontend Configuration
1. Open `src/config/web3.js` in your project
2. Replace the contract address:
   ```javascript
   export const CONTRACT_CONFIG = {
     address: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // Replace this
     abi: [
       // ... (keep the existing ABI)
     ]
   };
   ```

### Step 7: Test the Application
1. Save the file and redeploy your application to Vercel
2. Connect your MetaMask to the application
3. Try painting a pixel to test the functionality

## Troubleshooting

### Common Issues:

1. **"Failed to load painting fee" Error**
   - This means the contract address is not set correctly or the contract is not deployed
   - Double-check the contract address in `src/config/web3.js`

2. **"Transaction Failed" Error**
   - Make sure you have enough MON tokens for gas fees
   - Check that you're connected to the correct network (Monad Testnet)

3. **"Network Error" or Slow Transactions**
   - This is common with testnets. Wait a bit and try again
   - Make sure your RPC URL is correct in MetaMask

4. **"Contract Not Found" Error**
   - Verify the contract address is correct
   - Make sure the contract was successfully deployed

### Getting Test Tokens:
- Visit the Monad Testnet faucet to get free MON tokens
- You'll need these tokens to pay for gas fees when painting pixels

## Contract Functions

Once deployed, your contract will have these main functions:

- `paintPixel(x, y, color)`: Paint a pixel at coordinates (x, y) with a specific color
- `getPixel(x, y)`: Get information about a specific pixel
- `paintingFee()`: Get the current fee for painting a pixel (default: 0.001 MON)

## Security Notes

- The contract owner (deployer) can:
  - Change the painting fee
  - Withdraw collected fees
  - Transfer ownership
- Regular users can only paint pixels by paying the fee

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all configuration settings
3. Make sure you're using the correct network and have sufficient funds
4. Try refreshing the page and reconnecting MetaMask

---

**Important**: Always test on the testnet before deploying to mainnet!

