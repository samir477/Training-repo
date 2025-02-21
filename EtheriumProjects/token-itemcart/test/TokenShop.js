const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RupeeTokenShop", function () {
  let tokenShop;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const TokenShop = await ethers.getContractFactory("RupeeTokenShop");
    tokenShop = await TokenShop.deploy();
  });

  describe("Token Operations", function () {
    it("Should set tokens correctly", async function () {
      const tokenAmount = 1000;
      await tokenShop.connect(addr1).setTokens(tokenAmount);
      expect(await tokenShop.getTokenBalance(addr1.address)).to.equal(tokenAmount);
    });

    it("Should fail when setting 0 tokens", async function () {
      await expect(tokenShop.setTokens(0)).to.be.revertedWith("Amount must be greater than zero");
    });
  });

  describe("Purchase Operations", function () {
    beforeEach(async function () {
      // Set initial tokens for addr1
      await tokenShop.connect(addr1).setTokens(1000);
    });

    it("Should handle purchase with tokens only", async function () {
      const itemPrice = 800;
      const tax = itemPrice * 0.1; // 10% tax

      await expect(tokenShop.connect(addr1).buyItem(itemPrice, { value: tax }))
        .to.emit(tokenShop, "ItemPurchased")
        .withArgs(addr1.address, itemPrice, itemPrice, tax, tax, itemPrice + tax);

      expect(await tokenShop.getTokenBalance(addr1.address)).to.equal(0);
    });

    it("Should handle purchase with partial tokens", async function () {
      const itemPrice = 1500;
      const userTokens = 1000;
      const tax = itemPrice * 0.1;
      const requiredPayment = (itemPrice - userTokens) + tax;

      await expect(tokenShop.connect(addr1).buyItem(itemPrice, { value: requiredPayment }))
        .to.emit(tokenShop, "ItemPurchased")
        .withArgs(addr1.address, itemPrice, userTokens, requiredPayment, tax, itemPrice + tax);

      expect(await tokenShop.getTokenBalance(addr1.address)).to.equal(0);
    });

    it("Should fail when insufficient payment sent", async function () {
      const itemPrice = 800;
      const tax = itemPrice * 0.1;
      const insufficientPayment = tax - 1;

      await expect(
        tokenShop.connect(addr1).buyItem(itemPrice, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient rupees sent");
    });
  });
});