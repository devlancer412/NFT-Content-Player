import axios from "../../services/upload-file";
import { ADD_BLOB, REMOVE_BLOB, UPDATE_BLOB } from "../types";

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

export const removeBlob = (index) => (dispatch) => {
  return dispatch({
    type: REMOVE_BLOB,
    payload: index,
  });
};
