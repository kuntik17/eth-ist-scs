require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "mantle",
   networks: {
      hardhat: {},
      mantle: {
         url: "https://rpc.testnet.mantle.xyz/",
         chainId: 5001,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
};