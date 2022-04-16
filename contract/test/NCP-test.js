const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NCP-Proof", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Proof = await ethers.getContractFactory("NCPProof");
    const proof = await Proof.deploy();
    await proof.deployed();

    const [owner] = await ethers.getSigners();
    expect(await proof.balanceOf(owner.address)).to.equal(0);

    const setTx = await greeter.payToMint(owner.address, {
      value: ethers.utils.parseEther("0.05"),
    });

    // wait until the transaction is mined
    await setTx.wait();

    expect(await proof.balanceOf(owner.address)).to.equal(1);
  });
});
