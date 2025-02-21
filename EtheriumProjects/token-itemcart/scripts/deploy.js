const hre = require("hardhat");

async function main() {
  console.log("Deploying RupeeTokenShop...");

  const TokenShop = await hre.ethers.getContractFactory("RupeeTokenShop");
  const tokenShop = await TokenShop.deploy();

  await tokenShop.waitForDeployment();
  
  const address = await tokenShop.getAddress();
  console.log("RupeeTokenShop deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });