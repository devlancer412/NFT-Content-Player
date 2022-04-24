import Router from "next/router";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../components/button/Button";
import Input from "../../../components/Form/input";
import Select from "../../../components/Form/select";

import { setError } from "../../../store/actions/state";
import { addBlob, removeBlob, updateBlob } from "../../../store/actions/blob";
import ImageDropZone from "../../../components/dropzone/image";
import VideoDropZone from "../../../components/dropzone/video";

const BlobTypes = ["Video", "Image"];

const NewContent = (props) => {
  const [name, setName] = useState("");
  const [type, setType] = useState(0);

  const blobs = useSelector((store) => store.blobs);
  const address = useSelector((store) => store.state.address);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      // dispatch(setError("Wallet don't connected, please to connect wallet"));
      // Router.push("/");
    }
  });

  useEffect(() => {
    // dispatch(getPersonalContentList(address));
  }, [address]);

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
    dispatch(updateBlob(index, { ...blobs[index], protected: flag }));
  };

  const updateBlobType = (index, value) => {
    dispatch(updateBlob(index, { ...blobs[index], type: BlobTypes[value] }));
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
          handleChange={setName}
          placeholder="Rick and Morty Season 1"
          className="w-2/3"
        />
        <Select
          name="Type"
          value={type}
          items={["Video", "Image"]}
          handleChange={setType}
        />
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-gray-700 h-full flex-1">
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
                      handleChange={(value) => updateBlobType(index, value)}
                    />
                  </div>
                </div>
                <div className="content-edit flex flex-row justify-between font-semibold">
                  <div className="content-ct flex flex-row justify-start">
                    <label className="inline-flex justify-between items-center">
                      {element.protected ? (
                        <input
                          type="checkbox"
                          checked
                          onChange={() => updateProtectedHandle(index, false)}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          onChange={() => updateProtectedHandle(index, true)}
                        />
                      )}
                      <span className="ml-2">Protected</span>
                    </label>
                  </div>
                  <div className="content-ct flex flex-row justify-end">
                    <Button
                      size="base"
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      text=""
                      onClick={() => dispatch(removeBlob(index))}
                      className="bg-white text-red-600 border-red-300 py-1 px-2 pl-4"
                    />
                  </div>
                </div>
              </div>
              <div className="content-preview w-1/3">
                {element.type === "Image" ? (
                  <ImageDropZone
                    fileHandle={(link) => {
                      updateBlobHandle(index, {
                        ...element,
                        link: link,
                      });
                    }}
                  />
                ) : null}
                {element.type === "Video" ? (
                  <VideoDropZone
                    fileHandle={(link) => {
                      updateBlobHandle(index, {
                        ...element,
                        link: link,
                      });
                    }}
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
            className="border border-2 border-indigo-200 text-indigo-600 py-1 w-52"
          />
        </div>
        <div className="float-right">
          <Link href="/content/new">
            <Button
              size="base"
              icon={<FontAwesomeIcon icon={faUpload} />}
              text="Upload Content"
              className="border border-2 border-green-200 text-green-600 py-1 w-52"
            />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NewContent;
