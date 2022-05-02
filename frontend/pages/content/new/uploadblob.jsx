import Router from "next/router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../components/button/Button";
import Input from "../../../components/Form/controls/input";
import Select from "../../../components/Form/controls/select";

import { setError } from "../../../store/actions/state";

import {
  addBlob,
  clearContent,
  removeBlob,
  setContentName,
  setContentType,
  updateBlob,
  updateBlobLink,
} from "../../../store/actions/content";

import ImageDropZone from "../../../components/dropzone/image";
import VideoDropZone from "../../../components/dropzone/video";
import {
  getNewContentId,
  uploadContentBlob,
} from "../../../store/actions/content";

const BlobTypes = ["Video", "Image"];
const ContentTypes = ["Type-1", "Type-2"];

const BlobUploadManager = () => {
  const name = useSelector((store) => store.content.name);
  const contentId = useSelector((store) => store.content.contentId);
  const address = useSelector((store) => store.state.address);
  const blobs = useSelector((store) => store.content.blobs);
  const type = useSelector((store) => store.content.type);
  const finished = useSelector((store) => store.content.finished);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      dispatch(setError("Please connect wallet"));
      Router.push("/");
    }
  });

  useEffect(() => {
    dispatch(getNewContentId());
  }, [address]);

  useEffect(() => {
    if (finished) {
      dispatch(clearContent());
    }
  }, [finished]);

  const addBlobHandle = () => {
    if (blobs.filter((item) => item.name === "").length) {
      return dispatch(setError("There is an item is empty"));
    }

    dispatch(
      addBlob({
        name: "",
        link: "",
        type: "Image",
        protected: false,
      })
    );
  };

  const updateBlobHandle = (index, item) => {
    if (
      blobs.filter((ele, eleIndex) => {
        return ele.name === item.name && eleIndex != index;
      }).length
    ) {
      return dispatch(setError("There is an item has same name"));
    }

    dispatch(updateBlob(index, item));
  };

  const updateProtectedHandle = (index, flag) => {
    updateBlobHandle(index, { ...blobs[index], protected: flag });
  };

  const updateBlobType = (index, value) => {
    dispatch(updateBlob(index, { ...blobs[index], type: value }));
  };

  const uploadContentBlobHandle = async () => {
    if (!address) {
      return dispatch(
        setError("You can't upload. Please connect to your wallet.")
      );
    }

    dispatch(uploadContentBlob(name, address, contentId, type, blobs));
  };

  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose">Blob Upload</h1>
      </div>
      <div className="Title p-5">
        <Input
          name="Title"
          value={name}
          handleChange={(value) => dispatch(setContentName(value))}
          placeholder="Rick and Morty Season 1"
          className="w-2/3"
        />
        <Select
          name="Type"
          value={ContentTypes.indexOf(type)}
          items={ContentTypes}
          handleChange={(value) =>
            dispatch(setContentType(ContentTypes[value]))
          }
        />
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-[#e6e6e6]  h-full flex-1">
        {blobs.map((element, index) => {
          return (
            <div
              className="content-view flex flex-row w-full mb-10 justify-between"
              key={index}
            >
              <div className="content-detail w-96 flex flex-col justify-between pr-5">
                <div className="content-header flex flex-col w-full">
                  <div className="content-name w-full text-xl">
                    <Input
                      name="Name"
                      value={element.name}
                      handleChange={(nname) =>
                        updateBlobHandle(index, {
                          ...element,
                          name: nname,
                        })
                      }
                      placeholder="poster-image"
                      className="w-full"
                    />
                    <Select
                      name="Type"
                      value={BlobTypes.indexOf(element.type)}
                      items={BlobTypes}
                      handleChange={(value) =>
                        updateBlobType(index, BlobTypes[value])
                      }
                    />
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    <label className="inline-flex justify-between items-center">
                      <input
                        type="checkbox"
                        name="type"
                        value={element.protected}
                        onChange={() =>
                          updateProtectedHandle(index, !element.protected)
                        }
                      />
                      <span className="ml-2">Protected</span>
                    </label>
                  </div>
                  <div className="content-ct flex flex-row justify-end">
                    <Button
                      size="base"
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      text=""
                      onClick={() => dispatch(removeBlob(index))}
                      className="bg-transparent text-red-600 border-red-300 py-1 px-2 pl-4"
                    />
                  </div>
                </div>
              </div>
              <div className="content-preview w-1/3">
                {element.type === "Image" ? (
                  <ImageDropZone
                    fileHandle={(link) => dispatch(updateBlobLink(index, link))}
                  />
                ) : null}
                {element.type === "Video" ? (
                  <VideoDropZone
                    fileHandle={(link) => dispatch(updateBlobLink(index, link))}
                  />
                ) : null}
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
            text="Add Blob"
            onClick={addBlobHandle}
            className="border-0 bg-[#3E5E93] text-white py-1 w-52"
          />
        </div>
        <div className="float-right">
          <Button
            size="base"
            icon={<FontAwesomeIcon icon={faUpload} />}
            text="Upload Content"
            onClick={uploadContentBlobHandle}
            className="border-0 bg-[#3E5E93] text-white text-opacity-70 py-1 w-52"
          />
        </div>
      </div>
    </main>
  );
};

export default BlobUploadManager;
