// run with $ npx hardhat run scripts/test.js

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

async function setSellerAddress(address) {
  const tx = await contract.setSellerAddress(address);
  console.log(tx)
}

async function setBuyerAddress(address) {
  const tx = await contract.setBuyerAddress(address);
  console.log(tx)
}

async function checkAllowedAddress(address) {
  const tx = await contract.allowedAddresses(address);
  console.log(tx)
}

async function setPrice(priceInEther) {
  // Convert the price from Ether to Wei
  const priceInWei = ethers.utils.parseUnits(priceInEther, "ether");
  //console.log(priceInWei)
  const tx = await contract.setPrice(priceInWei);
  console.log(tx);
}

async function addStake(amount) {
  const amountInWei = ethers.utils.parseUnits(amount, "ether");
  //const stakeAmount = ethers.utils.parseEther(amount); // 0.00001 ETH in Wei
  try {
      const txResponse = await contract.addStake({ value: amountInWei });
      const receipt = await txResponse.wait();
      console.log("Stake added successfully. Transaction hash:", receipt.transactionHash);
  } catch (error) {
      console.error("Error while adding stake:", error);
  }
}

async function returnStake() {
  try {
      const txResponse = await contract.returnStake();
      const receipt = await txResponse.wait();
      console.log("Stake returned successfully. Transaction hash:", receipt.transactionHash);
  } catch (error) {
      console.error("Error while returning stake:", error);
  }
}

async function payStakeToSeller() {
  try {
      const txResponse = await contract.payStakeToSeller();
      const receipt = await txResponse.wait();
      console.log("Stake paid to seller successfully. Transaction hash:", receipt.transactionHash);
  } catch (error) {
      console.error("Error while paying stake to seller:", error);
  }
}

async function readPublicVariables() {
  const sellerAddress = await contract.sellerAddress();
  const buyerAddress = await contract.buyerAddress();
  const price = await contract.price();
  const parsedPrice = ethers.BigNumber.from(price);
  const priceInEther = ethers.utils.formatEther(parsedPrice);
  const priceAsString = priceInEther.toString();

  console.log("seller", sellerAddress);
  console.log("buyer", buyerAddress);
  console.log("price", priceAsString);
  console.log("raw price: ", price)
}

// functions tests
//setAllowedAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C');
//checkAllowedAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C');
//setSecretText('login=jakeaccount45:password=coolpassword66')
//getSecretText();
//addStake("0.001")
//returnStake()
payStakeToSeller()

//setSellerAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C')
//setBuyerAddress('0x66636CeA8a193f5E806C2dd5CA19055D9A69EA7C')
//setSellerAddress('0x3bAEa58C85a56db599Ad63ff2522DE051c24CE35')

//setPrice("0.001")

//readPublicVariables();