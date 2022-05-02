import Router from "next/router";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faExternalLinkAlt,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../../components/Form/modal/modal";
import Button from "../../components/button/Button";

import { getPersonalContentList } from "../../services/content-api";
import { setError, setLoading } from "../../store/actions/state";

import TransferModalContent from "../../components/Form/modal/transfer-template";
import MintModalContent from "../../components/Form/modal/mint-template";

import {
  transferDistribution,
  mintNFTForContent,
} from "../../store/actions/web3-api";

const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const address = useSelector((store) => store.state.address);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Please connect to wallet"));
      Router.push("/");
    }
  });

  const getContents = async () => {
    dispatch(setLoading(true));
    const result = await getPersonalContentList(address);

    if (result.success) {
      setContents(result.data);
    } else {
      dispatch(setError(result.data));
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    getContents();
  }, [address]);

  const transferDistributionHandle = async (contentId, toAddress) => {
    console.log({ contentId, toAddress });

    if (!toAddress) {
      return dispatch(setError("Please insert a wallet address"));
    }

    const result = await dispatch(
      transferDistribution(contentId, address, toAddress)
    );

    if (result) {
      getContents();
      setShowModal(false);
    }
  };

  const mintNFTHandle = async (contentId, toAddress) => {
    console.log({ contentId, toAddress });

    if (!toAddress) {
      return dispatch(setError("Please insert a wallet address"));
    }

    const result = await dispatch(
      mintNFTForContent(contentId, address, toAddress)
    );

    if (result) {
      setShowModal(false);
    }
  };

  const transferModal = (content) => {
    setModalContent(
      <TransferModalContent
        content={content}
        handleSubmit={transferDistributionHandle}
      />
    );
    setShowModal(true);
  };

  const mintModal = (content) => {
    setModalContent(
      <MintModalContent content={content} handleSubmit={mintNFTHandle} />
    );
    setShowModal(true);
  };

  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose">Content Manager</h1>
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-[#e6e6e6] h-full flex-1">
        {contents.map((element, index) => {
          return (
            <div
              className="content-view flex flex-row w-full mb-10"
              key={index}
            >
              <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
                <div className="content-header flex flex-col w-full">
                  <div className="content-name w-full text-xl">
                    {element.name}
                  </div>
                  <div className="content-id w-full text-base break-words">
                    {element.contentId}
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    <Link href={`/content/${element.contentId}`}>
                      <Button
                        size="base"
                        icon={<FontAwesomeIcon icon={faList} />}
                        text="Contents"
                        className="bg-white border rounded-md border-opacity-50 border-[1px] border-black text-black py-1 w-40 mr-3"
                      />
                    </Link>

                    {element.isOwner ? (
                      <Button
                        size="base"
                        icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                        text="Transfer"
                        onClick={() => transferModal(element)}
                        className="bg-white border rounded-md border-opacity-50 border-[1px] border-black text-black  py-1 w-40"
                      />
                    ) : null}
                  </div>
                  <div className="content-ct flex flex-row justify-end">
                    {element.isOwner ? (
                      <Button
                        size="base"
                        icon={<FontAwesomeIcon icon={faHammer} />}
                        text="Mint"
                        onClick={() => mintModal(element)}
                        className="border-0 bg-[#0d99ff] rounded-md text-white py-1 w-40"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="content-preview w-1/4">
                <div className="w-full h-40 bg-gray-500"></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer p-5 w-full">
        <div className="float-left">
          <Link href="/content/new/uploadblob">
            <Button
              size="base"
              icon={<FontAwesomeIcon icon={faPlus} />}
              text="Add Content"
              className="border-0 bg-[#3E5E93] text-white py-1 w-52"
            />
          </Link>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {modalContent}
      </Modal>
    </main>
  );
};

export default ContentManager;
