import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import uploadFile from "../../services/upload-file";

const ImageDropZone = ({ fileHandle }) => {
  const [src, setSrc] = useState({ preview: null });

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
    accept: "image/*",
  });
  return (
    <div className="w-full bg-black h-full">
      <div
        className="w-full h-full flex flex-col justify-center text-3xl"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {src.preview ? (
          <img
            className="w-full text-white min-h-fit"
            src={src.preview}
            alt="Drop files here"
          />
        ) : (
          <div className="flex flex-col justify-center align-middle text-center text-gray-500">
            <FontAwesomeIcon icon={faImage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropZone;
