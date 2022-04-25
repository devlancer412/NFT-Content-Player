import Router from "next/router";
import axios from "../../utils/http-comon";
import stringify from "qs-stringify";

import {
  SET_CONTENT_NAME,
  SET_CONTENT_ID,
  SET_BLOBS,
  ADD_BLOB,
  REMOVE_BLOB,
  UPDATE_BLOB,
  UPDATE_BLOB_LINK,
  CLEAR_CONTENT,
  SET_CONTENT_TYPE,
} from "../types";

import { setError, setLoading } from "./state";
import { newContentCreate } from "./web3-api";

export const setContentName = (name) => (dispatch) => {
  console.log("set content name:", name);
  return dispatch({
    type: SET_CONTENT_NAME,
    payload: name,
  });
};

export const setContentId = (contentId) => (dispatch) => {
  return dispatch({
    type: SET_CONTENT_ID,
    payload: contentId,
  });
};

export const setContentType = (contentId) => (dispatch) => {
  return dispatch({
    type: SET_CONTENT_TYPE,
    payload: contentId,
  });
};

export const addBlob = (item) => (dispatch) => {
  return dispatch({
    type: ADD_BLOB,
    payload: item,
  });
};

export const updateBlob = (index, item) => (dispatch) => {
  return dispatch({
    type: UPDATE_BLOB,
    payload: {
      index,
      item,
    },
  });
};

export const updateBlobLink = (index, link) => (dispatch) => {
  return dispatch({
    type: UPDATE_BLOB_LINK,
    payload: {
      index,
      link,
    },
  });
};

export const removeBlob = (index) => (dispatch) => {
  return dispatch({
    type: REMOVE_BLOB,
    payload: index,
  });
};

export const getNewContentId = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await axios.get("/api/content/upload/new");

    dispatch(setContentId(result.data));
  } catch (err) {
    if (!err.response) {
      dispatch(setError("Can't reache to server"));
    } else {
      dispatch(setError(stringify(err.response.data)));
    }
  }

  dispatch(setLoading(false));
};

export const uploadContentBlob =
  (name, address, contentId, blobs) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      for (let blob of blobs) {
        await axios.post(
          `/api/content/upload/${contentId}/blob`,
          stringify(blob)
        );
      }

      const result = await axios.post(
        `/api/content/upload/${contentId}/finish`,
        stringify({ name, address })
      );

      await dispatch(
        newContentCreate(contentId, address, result.data.signature)
      );

      Router.push("/content/new");
    } catch (err) {
      await axios.delete(
        `/api/content/upload/${contentId}`,
        stringify(address)
      );

      if (err && !err.response) {
        dispatch(setError("Can't reache to server"));
      } else if (err && err.response) {
        dispatch(setError(stringify(err.response.data)));
      } else {
        dispatch(setError("Unknown error"));
      }
    }

    dispatch(setLoading(false));
  };

export const clearContent = () => (dispatch) => {
  dispatch({
    type: CLEAR_CONTENT,
    payload: null,
  });
};
