import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletConnectBtn from "./button/connect";
import { Loading } from "./loading";
import { Meta } from "./meta";

const Layout = ({ children }) => {
  const isLoading = useSelector((store) => store.state.isLoading);
  const error = useSelector((store) => store.state.error);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Meta />
      {isLoading ? <Loading /> : null}
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        {children}
      </div>
      <ToastContainer />
      <WalletConnectBtn />
    </>
  );
};

export default Layout;
