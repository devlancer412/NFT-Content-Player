import axios from "axios";
import { SET_CONTENTS, ADD_CONTENT, UPDATE_CONTENT, SET_ERROR } from "../types";
import { setError, setLoading } from "./state";

export const getContentList = () => async (dispatch) => {
  try {
    setLoading(true);
    const contents = await axios.get("/api/content");

    dispatch({
      type: SET_CONTENTS,
      payload: contents.data,
    });

    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (!err.response) {
      return dispatch(setError("Can't reache to server"));
    }

    return dispatch(setError(err.response.data));
  }
};

export const getPersonalContentList = (address) => async (dispatch) => {
  if (typeof address != "string") {
    return;
  }
  if (address.length != 42) {
    return;
  }
  try {
    setLoading(true);
    const contents = await axios.get(`/api/content/${address}`);

    dispatch({
      type: SET_CONTENTS,
      payload: contents.data,
    });
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (!err.response) {
      return dispatch(setError("Can't reache to server"));
    }

    return dispatch(setError(err.response.data));
  }
};
