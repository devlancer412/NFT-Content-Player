const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NCP", function () {
  it("Should return true for NFT uri", async function () {
    const Proof = await ethers.getContractFactory("NCPProof");
    const proof = await Proof.deploy();
    await proof.deployed();

    const [owner] = await ethers.getSigners();
    expect(await proof.balanceOf(owner.address)).to.equal(0);

    const setTx = await proof.payToMint(owner.address, "aaaa", {
      value: ethers.utils.parseEther("0.05"),
    });

    // wait until the transaction is mined
    await setTx.wait();

    expect(await proof.balanceOf(owner.address)).to.equal(1);

    expect(await proof.hasNFT(owner.address, "aaaa")).to.equal(true);
    expect(await proof.hasNFT(owner.address, "aaab")).to.equal(false);
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
