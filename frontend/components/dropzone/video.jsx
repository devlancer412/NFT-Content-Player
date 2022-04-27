import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

import uploadFile from "../../services/upload-file";

const VideoDropZone = ({ fileHandle }) => {
  const [src, setSrc] = useState({ preview: null, type: null });

  const onDrop = useCallback(async (acceptedFile) => {
    const file = acceptedFile[0];
    const filePath = await uploadFile(file);
    await fileHandle(filePath.data);

    setSrc(
      Object.assign(file, {
        preview: (window.webkitURL || window.URL).createObjectURL(file),
      })
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/*",
  });
  return (
    <div className="w-full bg-black h-full">
      <div className="w-full h-full" {...getRootProps()}>
        <input {...getInputProps()} />
        {src.preview ? (
          <ReactPlayer url={src.preview} controls width="100%" height="100%" />
        ) : (
          <div className="flex flex-col justify-center align-middle text-center text-gray-500">
            <FontAwesomeIcon icon={faVideo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDropZone;
