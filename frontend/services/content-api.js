import axios from "../utils/http-comon";

export const getContentList = async () => {
  try {
    const contents = await axios.get("/api/content");

    return { success: true, data: contents.data };
  } catch (err) {
    if (!err.response) {
      return { success: false, data: "Can't reache to server" };
    } else {
      return { success: false, data: stringify(err.response.data) };
    }
  }
};

export const getPersonalContentList = async (address) => {
  if (typeof address != "string") {
    return { success: false, data: "Please connect to wallet" };
  }
  if (address.length != 42) {
    return { success: false, data: "Please connect to wallet" };
  }

  try {
    const contents = await axios.get(`/api/content/${address}`);

    return { success: true, data: contents.data };
  } catch (err) {
    if (!err.response) {
      return { success: false, data: "Can't reache to server" };
    } else {
      return { success: false, data: stringify(err.response.data) };
    }
  }
};
