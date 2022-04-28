import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "../../utils/wallet-connection-provider-option";

import axios from "../../utils/http-comon";
import stringify from "qs-stringify";
import { toastr } from "react-toastify";
import { setAddress, setError, setLoading } from "./state";

import CONTRACTDATA from "../../abi/NCPProof.json";

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

    window.provider = await web3Modal.connect();

    window.provider.on("accoutsChanged", (e) => {
      dispatch(setAddress(""));
      dispatch(setError("Wallet locked"));
    });

    window.provider.on("error", (e) => dispatch(setError("WS Error : " + e)));
    window.provider.on("end", (e) => dispatch(setError("WS End : " + e)));

    window.provider.on("disconnect", (error) => {
      dispatch(setError(error));
    });

    window.provider.on("connect", (info) => {
      toastr.info(info);
    });

    window.web3 = new Web3(provider);
    window.proofContract = await new web3.eth.Contract(
      abi,
      process.env.PROOF_CONTRACT_ADDRESS
    );

    dispatch(setAddress(web3.currentProvider.selectedAddress));
  } catch (err) {
    dispatch(setError(err));
  }
  dispatch(setLoading(false));
};

export const newContentCreate =
  (contentId, address, signature) => async (dispatch) => {
    dispatch(setLoading(true));

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
      console.log(err.code);
      if (err.code == -32602) {
        dispatch(setLoading(false));
        return true;
      }

      await axios.delete(
        `/api/content/upload/${contentId}`,
        stringify(address)
      );

      dispatch(setError(err.message));

      dispatch(setLoading(false));
      return false;
    }
  };

export const transferDistribution =
  (contentId, address, toAddress) => async (dispatch) => {
    dispatch(setLoading(true));

    console.log({ contentId, address });

    try {
      const txHash = await window.proofContract.methods
        .transferContentRights(contentId, toAddress)
        .call();

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

export const mintNFTForContent =
  (contentId, address, toAddress) => async (dispatch) => {
    dispatch(setLoading(true));

    console.log({ contentId, address });

    try {
      const txHash = await window.proofContract.methods
        .mint(toAddress, contentId)
        .call();

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
