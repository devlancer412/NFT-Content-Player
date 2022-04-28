import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
    <main className="flex flex-col w-full flex-1 px-5">
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
          <table className="min-w-full border text-start font-medium">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 border-r">
                  Content ID
                </td>
                <td className="text-gray-900 font-bold px-4 py-3 whitespace-nowrap border-r overflow-clip">
                  {content.contentId}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 border-r">
                  Name
                </td>
                <td className="text-gray-900 px-4 py-3 whitespace-nowrap border-r overflow-clip">
                  {content.name}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 border-r">
                  Owner
                </td>
                <td className="text-gray-900 px-4 py-3 whitespace-nowrap border-r overflow-clip">
                  {contentOwner}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 border-r">
                  Type
                </td>
                <td className="text-gray-900 px-6 py-4 whitespace-nowrap border-r overflow-clip">
                  {content.type}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 border-r">
                  Contents
                </td>
                <td className="text-gray-900 px-4 py-3 whitespace-nowrap border-r overflow-clip">
                  Private: {privateBlobNumber}; Public: {publicBlobNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between w-full mt-2">
          <Link href="/content">
            <Button
              size="base"
              text="Dashboard"
              className="bg-indigo-600 text-white py-1 w-5/12"
            />
          </Link>
          <Link href="/content/new/uploadblob">
            <Button
              size="base"
              text="Upload"
              className="bg-white text-indigo-900 border-2 rounded-sm border-indigo-400 py-1 w-5/12"
            />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NewContent;
