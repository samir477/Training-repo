const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrderCalculator", function () {
  let orderCalculator;
  let owner;

  beforeEach(async function () {
    // Deploy the contract
    const OrderCalculator = await ethers.getContractFactory("OrderCalculator");
    orderCalculator = await OrderCalculator.deploy();
    

    // Get the owner address
    [owner] = await ethers.getSigners();
  });

  it("should set order details correctly", async function () {
    await orderCalculator.setOrderDetails(1000, 200, 300);
    expect(await orderCalculator.orderAmount()).to.equal(1000);
    expect(await orderCalculator.taxAmount()).to.equal(200);
    expect(await orderCalculator.couponValue()).to.equal(300);
  });

  it("should calculate discounted amount correctly", async function () {
    await orderCalculator.setOrderDetails(1000, 200, 300);
    expect(await orderCalculator.calculateDiscountedAmount()).to.equal(700);

    await orderCalculator.setOrderDetails(500, 100, 600);
    expect(await orderCalculator.calculateDiscountedAmount()).to.equal(0);
  });

  it("should calculate total amount correctly", async function () {
    await orderCalculator.setOrderDetails(1000, 200, 300);
    expect(await orderCalculator.calculateTotalAmount()).to.equal(900);

    await orderCalculator.setOrderDetails(500, 100, 600);
    expect(await orderCalculator.calculateTotalAmount()).to.equal(100);
  });
});