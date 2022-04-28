import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setError, setLoading } from "../../../store/actions/state";
import { getContentData } from "../../../services/content-api";

import ImageDropZone from "../../../components/dropzone/image";
import VideoDropZone from "../../../components/dropzone/video";

// const BlobTypes = ["Video", "Image"];
// const ContentTypes = ["Type-1", "Type-2"];

const ContentViewer = (props) => {
  const router = useRouter();
  const { contentId } = router.query;
  const address = useSelector((store) => store.state.address);

  const [content, setContent] = useState({
    name: "",
    contentId: "",
    type: "",
    blobs: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Please connect wallet"));
      router.push("/");
    }
  });

  useEffect(async () => {
    dispatch(setLoading(true));
    const result = await getContentData(address, contentId);
    dispatch(setLoading(false));
    if (!result.success) {
      dispatch(setError(result.data));
      return;
    }

    setContent(result.data);
  }, [contentId]);

  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose">Blob Upload</h1>
      </div>
      <div className="Title p-5">
        <div className="w-full">Title : {content.name}</div>
        <div className="w-full">ContentId : {content.contentId}</div>
        <div className="w-full">Type : {content.type}</div>
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-gray-700 h-full flex-1">
        {content.blobs.map((element, index) => {
          return (
            <div
              className="content-view flex flex-row w-full mb-10 justify-between"
              key={index}
            >
              <div className="content-detail w-96 flex flex-col justify-between pr-5">
                <div className="content-header flex flex-col w-full">
                  <div className="content-name w-full text-xl">
                    <div className="w-full">Name: {element.name}</div>
                    <div className="w-full">Type: {element.type}</div>
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    {element.protected ? "Protected" : "Public"}
                  </div>
                  <div className="content-ct flex flex-row justify-end"></div>
                </div>
              </div>
              <div className="content-preview w-1/3">
                {element.type === "Image" ? <ImageDropZone /> : null}
                {element.type === "Video" ? <VideoDropZone /> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer p-5 w-full">
        {/* <div className="float-left">
          <Button
            size="base"
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Add Blob"
            onClick={addBlobHandle}
            className="border border-2 border-indigo-200 text-indigo-600 py-1 w-52"
          />
        </div>
        <div className="float-right">
          <Button
            size="base"
            icon={<FontAwesomeIcon icon={faUpload} />}
            text="Upload Content"
            onClick={uploadContentBlobHandle}
            className="border border-2 border-green-200 text-green-600 py-1 w-52"
          />
        </div> */}
      </div>
    </main>
  );
};

export default ContentViewer;
