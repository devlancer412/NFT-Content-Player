import Router from "next/router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlueBtn from "../../components/button/blue";
import LargeBtn from "../../components/button/large";
import NormalBtn from "../../components/button/normal";

import { getPersonalContentList } from "../../store/actions/content";
import { setError } from "../../store/actions/state";

const ContentManager = (props) => {
  const contents = useSelector((store) => store.content);
  const address = useSelector((store) => store.state.address);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Wallet don't connected, please to connect wallet"));
      Router.push("/");
    }
  });

  useEffect(() => {
    dispatch(getPersonalContentList(address));
  }, [address]);

  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose">Content Manager</h1>
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-gray-700 h-full flex-1">
        {contents.map((element, index) => {
          return (
            <div
              className="content-view flex flex-row w-full mb-10"
              key={element.contentId}
            >
              <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
                <div className="content-header flex flex-col w-full">
                  <div className="content-name w-full text-xl">
                    {element.name} - Season {index + 1}
                  </div>
                  <div className="content-id w-full text-base">
                    Content Id: {element.contentId}
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    <NormalBtn>Contents</NormalBtn>
                    <NormalBtn>Transfer</NormalBtn>
                  </div>
                  <div className="content-ct flex flex-row justify-end">
                    <BlueBtn>Mint</BlueBtn>
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
          <LargeBtn>Add Content</LargeBtn>
        </div>
      </div>
    </main>
  );
};

export default ContentManager;
