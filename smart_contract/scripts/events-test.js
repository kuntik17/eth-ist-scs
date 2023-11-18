// run with $ npx hardhat run scripts/events-test.js

const { ethers } = require('ethers');
const contractData = require("../artifacts/contracts/SecretTextContract.sol/SecretTextContract.json")
const deployedAddresses = require("../deployedAddresses.json")

// Replace these values with your contract address and ABI
const contractAddress = deployedAddresses.SecretTextContract;
const contractABI = contractData.abi;

// Infura API key and Goerli endpoint
const infuraApiKey = '87a0c31e5f3f4baaae705bb627d0350c';
const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
//const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/pUstIeCE3BsAvGDCSEvaCvtE-8lNpbyM`);
const provider = new ethers.providers.JsonRpcProvider(goerliEndpoint);

// Replace with your private key
const privateKey = '5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61';

const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function listenForEvent() {
  // Listen for the event
  contract.on('ConfirmSecretStatusSet', (newStatus) => {
    console.log('Event: ConfirmSecretStatusSet');
    console.log('New Status:', newStatus);
  });

  console.log('Listening for events...');

  // Keep the script running indefinitely
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for a second
  }
}

listenForEvent().catch((error) => {
  console.error('Error:', error);
});