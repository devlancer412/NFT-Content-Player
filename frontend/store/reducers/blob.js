import { SET_BLOBS, ADD_BLOB, REMOVE_BLOB, UPDATE_BLOB } from "../types";

const blobReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_BLOBS:
      return payload;
    case ADD_BLOB:
      return [...state, payload];
    case REMOVE_BLOB:
      return state.filter((item, index) => index != payload);
    case UPDATE_BLOB:
      return state.map((item, index) =>
        index == payload.index ? payload.item : item
      );
    default:
      return state;
  }
};

export default blobReducer;
