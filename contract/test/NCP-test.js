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

    expect(
      await proof.isContentDistributorOf(contentId, addr1.address)
    ).to.equal(true);
    expect(await proof.isSetted(contentId)).to.equal(true);
  });

  it("Set addr2 to consumer and mint NFT to addr1, and then transfer to addr2", async function () {
    await proof.setContentServer(owner.address, true);

    // get new conent id
    const contentId = await proof.newContentId();

    // make message to make new content
    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [addr1.address, contentId]
    );

    let messageHashBinary = ethers.utils.arrayify(messageHash);

    // make signature
    let signature = await owner.signMessage(messageHashBinary);

    // create new content
    await proof.newContent(contentId, addr1.address, signature);

    expect(
      await proof.isContentDistributorOf(contentId, addr2.address)
    ).to.equal(false);

    // set another distributor
    await proof.connect(addr1).setDistributor(contentId, addr2.address);

    expect(
      await proof.isContentDistributorOf(contentId, addr2.address)
    ).to.equal(true);

    let dt = new Date();
    dt.setSeconds(dt.getSeconds() + 10);
    const period = Math.floor(dt.getTime() / 1000);

    // mint NFT for content
    await proof.connect(addr2).mint(addr1.address, contentId, period);

    expect(await proof.hasNFTForContent(addr1.address, contentId)).to.equal(
      true
    );
    expect(await proof.hasNFTForContent(addr2.address, contentId)).to.equal(
      false
    );

    // suppose the current block has a timestamp of 01:00 PM
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine"); // this one will have 02:00 PM as its timestamp

    expect(await proof.hasNFTForContent(addr1.address, contentId)).to.equal(
      false
    );

    await proof.connect(addr1).transferContentRights(contentId, addr2.address);

    expect(
      await proof.isContentDistributorOf(contentId, addr1.address)
    ).to.equal(true);
    expect(
      await proof.isContentDistributorOf(contentId, addr2.address)
    ).to.equal(true);

    expect(await proof.contentOwnerOf(contentId)).to.equal(addr2.address);
  });
});
