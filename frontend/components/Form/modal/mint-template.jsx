import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons";

import Input from "../controls/input";
import Button from "../../button/Button";

const MintModalContent = ({ content, handleSubmit }) => {
  const [destAddress, setDestAddress] = useState("");

  return (
    <div className="w-full h-[350px] flex flex-col justify-between text-left">
      <div className="header w-full flex flex-col">
        <h1 className="w-full text-5xl">{content.name}</h1>
        <span className="w-full">{content.owner}</span>
      </div>
      <div className="body w-full flex-1 flex flex-col justify-center pb-5">
        <Input
          name="Address"
          value={destAddress}
          handleChange={(value) => setDestAddress(value)}
          placeholder="0x00..."
          className="w-full"
        />
      </div>
      <div className="w-full flex flex-row justify-end">
        <Button
          size="base"
          icon={<FontAwesomeIcon icon={faHammer} />}
          text="Mint"
          onClick={() => handleSubmit(content.contentId, destAddress)}
          className="bg-indigo-600 text-white py-1 w-40"
        />
      </div>
    </div>
  );
};

export default MintModalContent;
