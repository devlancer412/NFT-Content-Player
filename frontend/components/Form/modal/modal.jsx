import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handlePrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const modalContent = show ? (
    <div
      className="fixed t-0 l-0 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-40"
      onClick={handleCloseClick}
    >
      <div
        className="bg-[#3D4E80] w-[500px] h-[400px] rounded-2xl p-4 relative"
        onClick={handlePrevent}
      >
        <div className="pt-3 w-full min-h-full text-white text-opacity-50">
          {children}
        </div>
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
