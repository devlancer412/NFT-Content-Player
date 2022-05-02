import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "../../store/actions/state";
import { connectWallet } from "../../store/actions/web3-api";

const WalletConnectBtn = () => {
  const address = useSelector((store) => store.state.address);
  const dispatch = useDispatch();

  const connectHandle = () => {
    dispatch(connectWallet());
  };

  const str = address
    ? address.substr(0, 5) + "..." + address.substr(address.length - 5, 5)
    : "Connect";

  return (
    <div
      className="leading-loose rounded-lg bg-[#FF24BD] bg-opacity-80 text-white cursor-pointer w-56 text-center absolute top-5 right-5 hover:animate-bounce"
      onClick={connectHandle}
    >
      {str}
    </div>
  );
};

export default WalletConnectBtn;
