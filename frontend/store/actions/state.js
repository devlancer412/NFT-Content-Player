import { SET_LOADING, SET_ADDRESS } from "../types";

export const setLoading = (flag) => (dispatch) => {
  return dispatch({
    type: SET_LOADING,
    payload: flag,
  });
};

export const setAddress = (address) => (dispatch) => {
  return dispatch({
    type: SET_ADDRESS,
    payload: address,
  });
};

export const getAddress = () => async (dispatch) => {
  let accounts = await window.ethereum.request({ method: "eth_accounts" });

  if (!accounts.length) {
    await ethereum.request({ method: "eth_requestAccounts" });
    accounts = await window.ethereum.request({ method: "eth_accounts" });
  }

  return dispatch(setAddress(accounts[0]));
};
