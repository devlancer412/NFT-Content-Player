import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
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
      <div className="w-full h-full" {...getRootProps()}>
        <input {...getInputProps()} />
        <img
          className="w-full text-white min-h-fit"
          src={src.preview}
          alt="Drop files here"
        />
      </div>
    </div>
  );
};

export default ImageDropZone;
