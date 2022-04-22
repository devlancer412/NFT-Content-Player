import { SET_BLOBS, ADD_BLOB, REMOVE_BLOB, UPDATE_BLOB } from "../types";

export default blobReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_BLOBS:
      return payload;
    case ADD_BLOB:
      return [...state, payload];
    case REMOVE_BLOB:
      return state.filter((item) => item.name != payload.name);
    case UPDATE_BLOB:
      return state.map((item) => (item.name == payload.name ? payload : item));
    default:
      return state;
  }
};
