import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faDashboard,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../../../components/button/Button";
import { setFinished } from "../../../store/actions/content";
import { setError } from "../../../store/actions/state";

const NewContent = () => {
  const router = useRouter();

  const [privateBlobNumber, setPrivateBlobNumber] = useState("");
  const [publicBlobNumber, setPublicBlobNumber] = useState("");

  const contentOwner = useSelector((store) => store.state.address);
  const content = useSelector((store) => store.content);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(contentOwner);
    if (!contentOwner) {
      dispatch(setError("Please connect wallet"));
      dispatch(setError("Redirecting to content manager page"));
      router.push("/content/");
    }
  }, [contentOwner]);

  useEffect(() => {
    if (!content.contentId || !content.signatured) {
      console.log(content);
      console.log("Redirecting to upload blobs page");
      router.push("/content/new/uploadblob");
    }

    setPrivateBlobNumber(content.blobs.filter((item) => item.protected).length);
    setPublicBlobNumber(content.blobs.filter((item) => !item.protected).length);
    if (!content.finished) {
      dispatch(setFinished());
    }
  }, [content]);

  return (
    <main className="flex flex-col w-full flex-1 px-5 container">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose font-bold">
          Blob Upload - {content.name}
        </h1>
      </div>
      <div className="main flex flex-col w-full p-5 h-full flex-1 justify-center py-auto">
        <div className="w-32 h-32 rounded-full bg-green-500 text-gray-700 text-3xl flex flex-col justify-center text-center mx-auto font-bold">
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="text-center mt-2 text-lg">Content Blobs Uploaded</div>
        <div className="flex flex-col">
          <table className="min-w-full text-start font-medium bg-transparent">
            <tbody>
              <tr className="border border-0 border-b-2 border-gray-300">
                <td className="px-4 py-3 whitespace-nowrap text-gray-40 bg-transparent rounded-xl ">
                  Content ID
                </td>
                <td className="text-gray-40 font-bold px-4 py-3 whitespace-nowrap overflow-clip bg-transparent rounded-xl ">
                  {content.contentId}
                </td>
              </tr>
              <tr className="border border-0 border-b-2 border-gray-300">
                <td className="px-4 py-3 whitespace-nowrap text-gray-40">
                  Name
                </td>
                <td className="text-gray-40 px-4 py-3 whitespace-nowrap overflow-clip">
                  {content.name}
                </td>
              </tr>
              <tr className="border border-0 border-b-2 border-gray-300">
                <td className="px-4 py-3 whitespace-nowrap text-gray-40">
                  Owner
                </td>
                <td className="text-gray-40 px-4 py-3 whitespace-nowrap overflow-clip">
                  {contentOwner}
                </td>
              </tr>
              <tr className="border border-0 border-b-2 border-gray-300">
                <td className="px-4 py-3 whitespace-nowrap text-gray-40">
                  Type
                </td>
                <td className="text-gray-40 px-6 py-4 whitespace-nowrap overflow-clip">
                  {content.type}
                </td>
              </tr>
              <tr className="border border-0 border-b-2 border-gray-300">
                <td className="px-4 py-3 whitespace-nowrap text-gray-40">
                  Contents
                </td>
                <td className="text-gray-40 px-4 py-3 whitespace-nowrap overflow-clip">
                  Private: {privateBlobNumber}; Public: {publicBlobNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-around w-full mt-2">
          <Link href="/content">
            <Button
              size="base"
              text="Dashboard"
              icon={<FontAwesomeIcon icon={faDashboard} />}
              className="border-0 bg-[#3E5E93] text-white py-1 w-5/12 text-2xl"
            />
          </Link>
          <Link href="/content/new/uploadblob">
            <Button
              size="base"
              text="Upload New"
              icon={<FontAwesomeIcon icon={faUpload} />}
              className="border-0 bg-[#0d99ff] text-[#DCF1FF] rounded-sm py-1 w-5/12 text-2xl"
            />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NewContent;
