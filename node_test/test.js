const { ethers } = require('ethers');

// Replace these values with your contract address and ABI
const contractAddress = '0x844615E1B2eCD40D01e6eaB7271cD177AEb3e6B4';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"newSecretText","type":"string"},{"indexed":false,"internalType":"address","name":"setter","type":"address"}],"name":"SecretTextChanged","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"addAllowedAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedAddresses","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSecretText","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"removeAllowedAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_secretText","type":"string"}],"name":"setSecretText","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Your contract ABI goes here

// Infura API key and Goerli endpoint
const infuraApiKey = '87a0c31e5f3f4baaae705bb627d0350c';
const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
//const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/pUstIeCE3BsAvGDCSEvaCvtE-8lNpbyM`);
const provider = new ethers.JsonRpcProvider(goerliEndpoint);

// Replace with your private key
const privateKey = '5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61';
const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);


async function setSecretText(text) {
  const tx = await contract.setSecretText(text);
  console.log(tx);
}

async function getSecretText() {
  const tx = await contract.getSecretText();
  console.log(tx)
}

async function setAllowedAddress(address) {
  const tx = await contract.addAllowedAddress(address);
  console.log(tx)
}

async function checkAllowedAddress(address) {
  const tx = await contract.allowedAddresses(address);
  console.log(tx)
}

// functions tests
//setAllowedAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C');
//checkAllowedAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C');
//setSecretText('login=jakeaccount:password=coolpassword2')
getSecretText();