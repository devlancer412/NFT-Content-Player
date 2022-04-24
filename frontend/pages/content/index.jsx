import Router from "next/router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faExternalLinkAlt,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../../components/button/Button";

import { getPersonalContentList } from "../../store/actions/content";
import { setError } from "../../store/actions/state";

const ContentManager = (props) => {
  const contents = useSelector((store) => store.content);
  // const address = useSelector((store) => store.state.address);
  const address = "0xa2E6F8392CF06f611C10764aA50F20E41aD30d23";
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Wallet don't connected, please to connect wallet"));
      // Router.push("/");
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
                    {element.name}
                  </div>
                  <div className="content-id w-full text-base">
                    Content Id: {element.contentId}
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    <Button
                      size="base"
                      icon={<FontAwesomeIcon icon={faList} />}
                      text="Contents"
                      className="border border-2 border-indigo-200 text-indigo-600 py-1 w-40 mr-3"
                    />

                    <Button
                      size="base"
                      icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                      text="Transfer"
                      className="border border-2 border-indigo-200 text-indigo-600 py-1 w-40"
                    />
                  </div>
                  <div className="content-ct flex flex-row justify-end">
                    <Button
                      size="base"
                      icon={<FontAwesomeIcon icon={faHammer} />}
                      text="Mint"
                      className="bg-indigo-600 text-white py-1 w-40"
                    />
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
          <Button
            size="base"
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Add Content"
            className="border border-2 border-indigo-200 text-indigo-600 py-1 w-52"
          />
        </div>
      </div>
    </main>
  );
};

export default ContentManager;
