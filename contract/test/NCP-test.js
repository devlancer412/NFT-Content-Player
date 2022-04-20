const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NCP", function () {
  it("Should return true for NFT uri", async function () {
    const Proof = await ethers.getContractFactory("NCPProof");
    const proof = await Proof.deploy();
    await proof.deployed();

    const [owner] = await ethers.getSigners();
  });

  it("Should return true for NFT uri", async function () {
    const Reward = await ethers.getContractFactory("NCPReward");
    const reward = await Reward.deploy();
    await reward.deployed();

    const [owner] = await ethers.getSigners();
    const balance = await reward.balanceOf(owner.address);
    console.log(balance.toString());

    const totalSupply = await reward.totalSupply();
    console.log(totalSupply.toString());
  });
});
