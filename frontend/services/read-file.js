export const url2blob = async (url) => {
  try {
    const data = await fetch(url);
    const blob = await data.blob();
    console.log("Success.");
    return blob;
  } catch (err) {
    console.error(err.name, err.message);
  }
};

export const blobToFile = (theBlob, fileName) => {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};
