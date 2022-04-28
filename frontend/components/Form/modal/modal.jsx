import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="fixed t-0 l-0 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-40">
      <div className="bg-white w-[500px] h-[400px] rounded-2xl p-4 relative">
        <div className="flex justify-end text-2xl absolute top-2 right-4 min-h-full">
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        <div className="pt-3 w-full min-h-full">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
