import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import Input from "../controls/input";
import Button from "../../button/Button";

const TransferModalContent = ({ content, handleSubmit }) => {
  const [destAddress, setDestAddress] = useState("");

  return (
    <div className="w-full h-[350px] flex flex-col justify-between text-left">
      <div className="header w-full flex flex-col">
        <h1 className="w-full text-3xl text-gray-50">{content.name}</h1>
        <span className="w-full break-words mt-3">{content.contentId}</span>
      </div>
      <div className="body w-full flex-1 flex flex-col justify-center pb-5">
        <Input
          name="Address"
          value={destAddress}
          handleChange={(value) => setDestAddress(value)}
          placeholder="0x00..."
          className="w-full"
        />
        <span className="w-full">
          Transferring the distribution rights will prevent you from minting new
          copies of the content
        </span>
      </div>
      <div className="w-full flex flex-row justify-end">
        <Button
          size="base"
          icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
          text="Transfer"
          onClick={() => handleSubmit(content.contentId, destAddress)}
          className="border-0 bg-[#0d99ff] text-white py-1 w-40"
        />
      </div>
    </div>
  );
};

export default TransferModalContent;
