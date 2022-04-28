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
    const result = await proofContract.newContentId();

    console.log("new content Id :", result);
    return {
      success: true,
      data: result._hex,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.isContentServer = async (address) => {
  console.log("Is content server...");
  try {
    const result = await proofContract.isContentServer(address);

    console.log("Is content server :", result);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.isContentDistributor = async (address, contentId) => {
  console.log("Is content distributor...");
  try {
    const result = await proofContract.isDistributorOf(address, contentId);

    console.log("Is content distributor :", result);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.setContentServer = async (address, setVale) => {
  console.log("Setting content server...");
  try {
    await proofContract.setContentServer(address, setVale);

    console.log("Setting content server :", { address, setVale });
    return {
      success: true,
      data: setVale,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.hasNFTForContent = async (address, contentId) => {
  console.log("Has NFT for content...");
  try {
    const result = await proofContract.hasNFTForContent(address, contentId);

    console.log("Has NFT for content :", result);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.hasNFTForContents = async (address, contentIds) => {
  console.log("Has NFT for content...");
  try {
    const result = await proofContract.hasNFTForContents(address, contentIds);

    console.log("Has NFT for content :", result);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
};

exports.canSeeProtected = async (address, contentIds) => {
  console.log("Get permittion to access protected...");
  try {
    const result = await proofContract.canSeeProtected(address, contentIds);

    console.log("Get permittion to access protected :", result);
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      data: err.reason,
    };
  }
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
