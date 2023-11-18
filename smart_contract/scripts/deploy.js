const fs = require('fs');
const path = require('path');

async function main() {
  const SecretTextContract = await ethers.getContractFactory("SecretTextContract");
  const secretTextContract = await SecretTextContract.deploy();

  await secretTextContract.deployed();

  console.log("SecretTextContract deployed to:", secretTextContract.address);

  // Define the path for the directory and the file
  const directoryPath = path.join(__dirname, '../');
  const filePath = path.join(directoryPath, 'deployedAddresses.json');

  // Create the directory if it does not exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // Create or update the file with the contract address
  const data = {
    SecretTextContract: secretTextContract.address
  };

  // Write to the file (append if it already exists)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
