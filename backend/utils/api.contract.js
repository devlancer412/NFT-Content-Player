require("dotenv").config();
const ethers = require("ethers");
const privateKey = require("../privatekey");

const provider = new ethers.getDefaultProvider("rinkeby");
const proofAbi = require("../abi/NCPProof.json").abi;

const wallet = new ethers.Wallet(privateKey, provider);
const proofContract = new ethers.Contract(
  process.env.PROOF_CONTRACT_ADDRESS,
  proofAbi,
  wallet
);

exports.getNewContentId = async () => {
  console.log("Getting new content id...");
  try {
    const contentId = await proofContract.newContentId();

    console.log("new content Id :", contentId);
    return {
      success: true,
      data: contentId._hex,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.isContentServer = async (address) => {
  return await proofContract.isContentServer(address);
};

exports.isContentDistributor = async (address, contentId) => {
  return await proofContract.isDistributorOf(address, contentId);
};

exports.setContentServer = async (address, setVale) => {
  await proofContract.setContentServer(address, setVale);
};

exports.getNewContractSinature = async (address, contentId) => {
  const contentIdNum = ethers.BigNumber.from(contentId);
  const uintId = ethers.utils.zeroPad(contentIdNum, 32);

  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint"],
    [address, uintId]
  );

  const messageHashBinary = ethers.utils.arrayify(messageHash);

  const signature = await wallet.signMessage(messageHashBinary);

  return signature;
};

exports.getBigNumber = (number) => {
  return new ethers.BigNumber.from(number);
};
