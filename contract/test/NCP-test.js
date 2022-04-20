const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, BigNumberish, Wallet } = require("ethers");
const {
  AbiCoder,
  solidityKeccak256,
  splitSignature,
  arrayify,
} = require("ethers/lib/utils");

describe("NCP", function () {
  // Initialize test variables.
  let proof;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  const privateKeyOfOwner =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  beforeEach(async function () {
    const Proof = await ethers.getContractFactory("NCPProof");
    proof = await Proof.deploy();
    await proof.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  it("Set owner to content server", async function () {
    await proof.setContentServer(owner.address, true);

    expect(await proof.isContentServer(owner.address)).to.equal(true);
    expect(await proof.isContentServer(addr1.address)).to.equal(false);
  });

  it("Set addr1 to distributor server", async function () {
    const address1 = addr1.address;

    const contentId = (await proof.newContentId()).value.toNumber();
    expect(contentId).to.equal(0);

    const issuerWallet = new Wallet(privateKeyOfOwner);

    const hash = solidityKeccak256(
      ["uint256", "address"],
      [contentId, address1]
    );

    console.log(hash);

    const signature = await issuerWallet.signMessage(arrayify(hash));

    const { v, r, s } = splitSignature(signature);

    await proof.newContent(contentId, address1, r, s, v);

    // expect(await proof.countOfContent()).to.equal(BigNumber(1));
    // expect(await proof.contentDistributorOf(contentId)).to.equal(address1);
  });
});
