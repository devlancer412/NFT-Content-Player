import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "../../utils/wallet-connection-provider-option";
import { toast } from "react-toastify";
import { setAddress, setError, setLoading } from "./state";

let web3Modal = null;
let provider = null;
let web3 = null;

export const connectWallet = () => async (dispatch) => {
  dispatch(setLoading(true));

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
  provider.on("error", (e) => dispatch(setError("WS Error : " + e)));
  provider.on("end", (e) => dispatch(setError("WS End : " + e)));

  provider.on("disconnect", (error) => {
    dispatch(setError(error));
  });

  provider.on("connect", (info) => {
    toast.info(info);
  });

  web3 = new Web3(provider);

  dispatch(setAddress(web3.currentProvider.selectedAddress));

  dispatch(setLoading(false));
};
