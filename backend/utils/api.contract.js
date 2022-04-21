require("dotenv").config();
const ethers = require("ethers");
const privateKey = require("../privatekey");

const provider = ethers.getDefaultProvider("rinkeby");
const proofAbi = require("../abi/NCPProof.json").abi;

const wallet = new ethers.Wallet(privateKey, provider);
const proofContract = new ethers.Contract(
  process.env.PROOF_CONTRACT_ADDRESS,
  proofAbi,
  wallet
);

exports.isContentServer = async (address) => {
  return await proofContract.isContentServer(address);
};

exports.isContentDistributor = async (address, contentId) => {
  return address == (await proofContract.contentDistributorOf(contentId));
};

exports.setContentServer = async (address, setVale) => {
  await proofContract.setContentServer(address, setVale);
};

exports.getNewContractSinature = async (address) => {
  const contentId = (await proof.newContentId()).value.toNumber();
  expect(contentId).to.equal(0);

  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint"],
    [address, contentId]
  );

  const messageHashBinary = ethers.utils.arrayify(messageHash);

  const signature = await owner.signMessage(messageHashBinary);

  return {
    contentId,
    signature,
  };
};
