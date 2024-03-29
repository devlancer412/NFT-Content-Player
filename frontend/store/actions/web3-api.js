import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "../../utils/wallet-connection-provider-option";

import axios from "../../utils/http-comon";
import stringify from "qs-stringify";
import { toastr } from "react-toastify";
import { setAddress, setError, setLoading } from "./state";

import CONTRACTDATA from "../../abi/NCPProof.json";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { SET_NFTS } from "../types";

const abi = CONTRACTDATA.abi;

const expectedBlockTime = 1000;

export const connectWallet = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    if (window.provider) {
      if (window.provider.close) {
        await window.provider.close();

        await window.web3Modal.clearCachedProvider();
        window.provider = null;
      }
    }

    window.web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      WalletConnectProvider,
    });

    window.provider = await window.web3Modal.connect();

    window.provider.on("accountsChanged", (accounts) => {
      console.log("ACCOUNTS CHANGED" + accounts[0]);
    });

    window.web3 = new Web3(window.provider);
    window.proofContract = await new web3.eth.Contract(
      abi,
      process.env.PROOF_CONTRACT_ADDRESS
    );

    dispatch(setAddress(window.web3.currentProvider.selectedAddress));
  } catch (err) {
    dispatch(setError(err));
  }
  dispatch(setLoading(false));
};

export const newContentCreate =
  (contentId, address, signature) => async (dispatch) => {
    if (window.web3.currentProvider.selectedAddress != address) {
      dispatch(
        setError("Your account has changed, please reconnect to wallet")
      );
      return true;
    }

    dispatch(setLoading(true));

    console.log({ contentId, address, signature });

    console.log({ contentId, address, signature });
    try {
      const txHash = await window.proofContract.methods
        .newContent(contentId, address, signature)
        .send({ from: address });

      let transactionReceipt = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await window.web3.eth.getTransactionReceipt(
          txHash
        );
        console.log("waiting");
        await sleep(expectedBlockTime);
      }

      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.log(err);
      if (err?.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };

export const transferDistribution =
  (contentId, address, toAddress) => async (dispatch) => {
    if (window.web3.currentProvider.selectedAddress != address) {
      dispatch(
        setError("Your account has changed, please reconnect to wallet")
      );
      return true;
    }

    dispatch(setLoading(true));

    console.log({ contentId, address, toAddress });

    try {
      const txHash = await window.proofContract.methods
        .transferContentRights(contentId, toAddress.toLowerCase())
        .send({ from: address });

      let transactionReceipt = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await window.web3.eth.getTransactionReceipt(
          txHash
        );
        console.log("waiting");
        await sleep(expectedBlockTime);
      }

      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.log(err);
      if (err.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };

export const mintNFTForContent =
  (contentId, address, toAddress, period = 1) =>
  async (dispatch) => {
    if (window.web3.currentProvider.selectedAddress != address) {
      dispatch(
        setError("Your account has changed, please reconnect to wallet")
      );
      return true;
    }

    dispatch(setLoading(true));

    let date = new Date();
    date.setMonth(date.getMonth() + parseInt(period));
    const endTime = Math.floor(date.getTime() / 1000);

    try {
      const txHash = await window.proofContract.methods
        .mint(toAddress, contentId, endTime)
        .send({ from: address });

      let transactionReceipt = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await window.web3.eth.getTransactionReceipt(
          txHash
        );
        console.log("waiting");
        await sleep(expectedBlockTime);
      }

      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.log(err.code);
      if (err.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };

export const addDistributorForContent =
  (contentId, address, toAddress) => async (dispatch) => {
    if (window.web3.currentProvider.selectedAddress != address) {
      dispatch(
        setError("Your account has changed, please reconnect to wallet")
      );
      return true;
    }

    dispatch(setLoading(true));

    try {
      const txHash = await window.proofContract.methods
        .setDistributor(contentId, toAddress)
        .send({ from: address });

      let transactionReceipt = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await window.web3.eth.getTransactionReceipt(
          txHash
        );
        console.log("waiting");
        await sleep(expectedBlockTime);
      }

      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.log(err.code);
      if (err.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };

export const unLockPrivate = async (address, contentId) => {
  if (window.web3.currentProvider.selectedAddress != address) {
    return {
      success: false,
      data: "Your account has changed, please reconnect to wallet",
    };
  }

  let signature, timestamp;
  try {
    const accessFlag = await window.proofContract.methods
      .canSeeProtected(address, contentId)
      .call({ from: address });

    if (!accessFlag) {
      return {
        success: false,
        data: "You aren't NFT owner!, So you can't see private contents",
      };
    }

    timestamp = Math.floor(Date.now() / 1000);

    signature = await window.web3.eth.personal.sign(
      window.web3.utils.soliditySha3(timestamp, address, contentId),
      address
    );

    console.log({ timestamp, address, contentId, signature });
  } catch (err) {
    console.log(err);

    return {
      success: false,
      data: err.message,
    };
  }

  try {
    const result = await axios.get(
      `/api/content/unlock/${contentId}?signature=${signature}&timestamp=${timestamp}`
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    console.log(stringify(err));
    if (!err.response) {
      return {
        success: false,
        data: "Can't reache to the server",
      };
    } else {
      return {
        success: false,
        data: err.response.data.detail,
      };
    }
  }
};

function bnToHex(bn) {
  var base = 16;
  var hex = BigInt(bn).toString(base);
  if (hex.length % 2) {
    hex = "0" + hex;
  }
  return "0x" + hex;
}

export const getNFTs = (address) => async (dispatch) => {
  if (window.web3.currentProvider.selectedAddress != address) {
    dispatch(setError("Your account has changed, please reconnect to wallet"));
    return true;
  }

  dispatch(setLoading(true));

  try {
    const result = await window.proofContract.methods
      .getNFTs(address)
      .call({ from: address });

    console.log(result);

    const nfts = result
      .filter((nftData) => nftData.contentId != "0")
      .map((nftData) => {
        return {
          tokenId: nftData.tokenId,
          contentId: bnToHex(nftData.contentId),
          period: nftData.period,
        };
      });

    dispatch({
      type: SET_NFTS,
      payload: nfts,
    });

    dispatch(setLoading(false));
    return true;
  } catch (err) {
    console.log(err.code);
    if (err.code == -32602) {
      dispatch(setLoading(false));
      return true;
    }

    dispatch(setError(err.message));

    dispatch(setLoading(false));
    return false;
  }
};

export const transferNFT =
  (tokenId, address, toAddress) => async (dispatch) => {
    if (window.web3.currentProvider.selectedAddress != address) {
      dispatch(
        setError("Your account has changed, please reconnect to wallet")
      );
      return true;
    }

    dispatch(setLoading(true));

    console.log({ tokenId, address, toAddress });

    try {
      const txHash = await window.proofContract.methods
        .transferNFTRights(tokenId, toAddress.toLowerCase())
        .send({ from: address });

      let transactionReceipt = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await window.web3.eth.getTransactionReceipt(
          txHash
        );
        console.log("waiting");
        await sleep(expectedBlockTime);
      }

      dispatch(setLoading(false));
      return true;
    } catch (err) {
      console.log(err);
      if (err.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };
