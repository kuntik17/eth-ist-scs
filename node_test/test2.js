const ethers = require('ethers');

// Infura API key and Goerli endpoint
const infuraApiKey = '87a0c31e5f3f4baaae705bb627d0350c';
const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;

// Ethereum address to check the balance
const addressToCheck = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

// Create a provider using Infura
const provider = new ethers.JsonRpcProvider(goerliEndpoint);

// Get balance
async function getBalance() {
  try {
    const balance = await provider.getBalance(addressToCheck);
    console.log(`Balance of ${addressToCheck}: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
getBalance();