import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "../../utils/wallet-connection-provider-option";
import { toast } from "react-toastify";
import { setAddress, setError, setLoading } from "./state";

import CONTRACTDATA from "../../abi/NCPProof.json";

const abi = CONTRACTDATA.abi;

let web3Modal = null;
let provider = null;
let web3 = null;

let proofContract;

export const connectWallet = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    if (provider) {
      if (provider.close) {
        await provider.close();

        await web3Modal.clearCachedProvider();
        provider = null;
      }
    }

    web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      WalletConnectProvider,
    });

    provider = await web3Modal.connect();

    provider.on("accoutsChanged", (e) => {
      dispatch(setAddress(""));
      dispatch(setError("Wallet locked"));
    });
    provider.on("error", (e) => dispatch(setError("WS Error : " + e)));
    provider.on("end", (e) => dispatch(setError("WS End : " + e)));
    provider.on("disconnect", (error) => {
      dispatch(setError(error));
    });
    provider.on("connect", (info) => {
      toast.info(info);
    });

    web3 = new Web3(provider);
    proofContract = await new web3.eth.Contract(
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

    try {
      await proofContract.methods.newContent(contentId, address, signature);
    } catch (err) {
      console.log(err);
      dispatch(setError(err));
    }

    dispatch(setLoading(false));
  };
