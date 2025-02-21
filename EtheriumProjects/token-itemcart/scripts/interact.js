const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const tokenShop = await hre.ethers.getContractAt(
    "RupeeTokenShop",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  // Get signers
  const [owner, buyer] = await hre.ethers.getSigners();
  console.log("Buyer address:", buyer.address);

  // Set tokens for the buyer (1000 tokens)
  const tokenAmount = 800;
  console.log(`\nSetting ${tokenAmount} tokens for buyer...`);
  const setTokensTx = await tokenShop.connect(buyer).setTokens(tokenAmount);
  await setTokensTx.wait();

  // Check token balance
  const balance = await tokenShop.getTokenBalance(buyer.address);
  console.log(`Buyer token balance: ${balance}`);

  // Buy an item worth 800 tokens
  const itemPrice = 2000;
  const tax = Math.floor(itemPrice * 0.1); // 10% tax
  console.log(`\nBuying item worth ${itemPrice} tokens...`);
  console.log(`Tax amount: ${tax}`);

  const buyItemTx = await tokenShop.connect(buyer).buyItem(itemPrice, {
    value: tax // We only need to send the tax amount since we have enough tokens
  });
  await buyItemTx.wait();

  // Check final balance
  const finalBalance = await tokenShop.getTokenBalance(buyer.address);
  console.log(`Final token balance: ${finalBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });