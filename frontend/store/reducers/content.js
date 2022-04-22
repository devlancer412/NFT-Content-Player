import {
  SET_CONTENTS,
  ADD_CONTENT,
  REMOVE_CONTENT,
  UPDATE_CONTENT,
} from "../types";

export default contentReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_CONTENTS:
      return payload;
    case ADD_CONTENT:
      return [...state, payload];
    case REMOVE_CONTENT:
      return state.filter((item) => item.contentId != payload.contentId);
    case UPDATE_CONTENT:
      return state.map((item) =>
        item.contentId == payload.contentId ? payload : item
      );
    default:
      return state;
  }
};
