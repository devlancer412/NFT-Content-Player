import { SET_CONTENTS, ADD_CONTENT, UPDATE_CONTENT } from "../types";

const contentReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_CONTENTS:
      return payload;
    case ADD_CONTENT:
      return [...state, payload];
    case UPDATE_CONTENT:
      return state.map((item) =>
        item.contentId == payload.contentId ? payload : item
      );
    default:
      return state;
  }
};

export default contentReducer;
