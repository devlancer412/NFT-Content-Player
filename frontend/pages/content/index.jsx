import Router from "next/router";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faExternalLinkAlt,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../../components/Form/modal/modal";
import Button from "../../components/button/Button";

import { getPersonalContentList } from "../../services/content-api";
import { setError, setLoading } from "../../store/actions/state";

import TransferModalContent from "../../components/Form/modal/nft-transfer-template";

import { transferNFT, getNFTs } from "../../store/actions/web3-api";

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const address = useSelector((store) => store.state.address);
  const nfts = useSelector((store) => store.nfts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Please connect to wallet"));
      Router.push("/");
    }
  });

  const getContentAndNFTs = async () => {
    dispatch(setLoading(true));

    const result = await getPersonalContentList(address);
    await dispatch(getNFTs(address));

    if (result.success) {
      setContents(result.data);
    } else {
      dispatch(setError(result.data));
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (address) {
      getContentAndNFTs();
    }
  }, [address]);

  const transferNFTHandle = async (tokenId, toAddress) => {
    console.log({ tokenId, toAddress });

    if (!toAddress) {
      return dispatch(setError("Please insert a wallet address"));
    }

    const result = await dispatch(transferNFT(tokenId, address, toAddress));

    if (result) {
      await dispatch(getNFTs);
      setShowModal(false);
    }
  };

  const transferModal = (content, NFTdata) => {
    setModalContent(
      <TransferModalContent
        content={content}
        NFT={NFTdata}
        handleSubmit={transferNFTHandle}
      />
    );
    setShowModal(true);
  };

  return (
    <main className="flex flex-col w-full flex-1">
      <div className="header top-0 backdrop-blur-sm bg-opacity-30 bg-indigo-300 w-full z-10 flex items-center pl-5">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
        <h1 className="text-3xl font-bold leading-loose px-5">Contents List</h1>
      </div>
      <div className="main flex flex-col w-full border-y-2 border-[#e6e6e6] h-full flex-1">
        {contents.map((element, index) => {
          return (
            <div
              className="content-view flex lg:flex-row w-full py-8 px-5 flex-col even:bg-gradient-to-r from-transparent to-blue-100 odd:bg-gradient-to-l odd:to-blue-50 bg-opacity-10"
              key={index}
            >
              <div className="content-detail flex justify-between w-full lg:w-3/4 lg:pr-5 flex-col sm:flex-row md:flex-row  lg:flex-col">
                <div className="content-header flex flex-1 flex-col w-auto lg:w-full sm:mr-2">
                  <div className="content-name w-full text-[30px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                    {element.meta.name}
                  </div>
                  <div className="content-description w-full text-[20px] font-base bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
                    {element.meta.description}
                  </div>
                  <div className="mt-2 content-id w-full text-base break-all p-1 rounded-full bg-gradient-to-r from-blue-200 to-transparent ">
                    <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#00000044] to-black pl-5">
                      {element.content_id}
                    </div>
                  </div>
                  {nfts
                    .filter((nft) => nft.contentId == element.content_id)
                    .map((nft) => {
                      <div className="mt-2 content-id w-full text-base break-all p-1 rounded-full bg-gradient-to-r from-blue-200 to-transparent flex justify-between">
                        <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#00000044] to-black pl-5">
                          {new Date(
                            parseInt(nft.timestamp) * 1000
                          ).toLocaleDateString("en-US")}
                        </div>
                        <Button
                          size="base"
                          icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                          text="Transfer"
                          onClick={() => transferModal(element, nft)}
                          className="bg-white rounded-full text-black py-1 mr-0 mb-2"
                        />
                      </div>;
                    })}
                </div>
                <div className="content-edit flex justify-between font-semibold flex-col lg:flex-row my-2">
                  <div className="content-ct flex justify-start flex-col lg:flex-row align-middle mt-2 md:mt-0">
                    <Link href={`/content/${element.content_id}`}>
                      <Button
                        size="base"
                        icon={<FontAwesomeIcon icon={faList} />}
                        text="Contents"
                        className="bg-white rounded-full text-black py-1 lg:mr-3 mr-0 mb-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="content-preview lg:w-1/4 w-full mt-5 lg:mt-0">
                <img
                  className="w-full bg-gray-500"
                  src={element.content["banner-image"]?.url}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer p-5 w-full bg-indigo-300 bg-opacity-60 backdrop-blur-sm">
        <div className="float-left w-full sm:w-auto">
          <Link href="/content/manager">
            <Button
              size="base"
              icon={<FontAwesomeIcon icon={faCogs} />}
              text="Content Manage"
              className="border-0 bg-[#3E5E93] text-white py-1 w-full sm:w-52 rounded-full"
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

export default ContentList;
