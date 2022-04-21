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
    await proof.setContentServer(owner.address, true);

    const contentId = 0;
    expect(await proof.isSetted(contentId)).to.equal(false);

    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint"],
      [addr1.address, contentId]
    );

    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let signature = await owner.signMessage(messageHashBinary);

    await proof.newContent(contentId, addr1.address, signature);

    expect(await proof.contentDistributorOf(contentId)).to.equal(addr1.address);
    expect(await proof.isSetted(contentId)).to.equal(true);
  });

  it("Set addr2 to consumer and mint NFT to addr1, and then transfer to addr2", async function () {
    await proof.setContentServer(owner.address, true);

    const contentId = 0;

    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint"],
      [addr1.address, contentId]
    );

    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let signature = await owner.signMessage(messageHashBinary);

    await proof.newContent(contentId, addr1.address, signature);

    await proof.connect(addr1).mint(addr1.address, contentId);

    expect(await proof.hasNFTForContent(addr1.address, contentId)).to.equal(
      true
    );
    expect(await proof.hasNFTForContent(addr2.address, contentId)).to.equal(
      false
    );

    await proof.connect(addr1).transferContentRights(contentId, addr2.address);

    expect(await proof.hasNFTForContent(addr1.address, contentId)).to.equal(
      false
    );
    expect(await proof.hasNFTForContent(addr2.address, contentId)).to.equal(
      true
    );
  });
});
