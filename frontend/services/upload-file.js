import http from "../utils/http-comon";

const uploadFile = async (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return await http.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default uploadFile;
