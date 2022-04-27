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

exports.getNewContentId = async () => {
  try {
    let contentId;
    while (true) {
      const random = ethers.utils.randomBytes(32);
      const randomNumber = ethers.BigNumber.from(random);

      if (await proofContract.isSetted(randomNumber)) {
        continue;
      }

      contentId = randomNumber.toHexString();
      break;
    }

    return {
      success: true,
      data: contentId,
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
