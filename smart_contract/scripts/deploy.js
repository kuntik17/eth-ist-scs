async function main() {
  const SecretTextContract = await ethers.getContractFactory("SecretTextContract");
  const secretTextContract = await SecretTextContract.deploy();

  await secretTextContract.deployed();

  console.log("SecretTextContract deployed to:", secretTextContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
