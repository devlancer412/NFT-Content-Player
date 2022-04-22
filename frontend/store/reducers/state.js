import { SET_LOADING, SET_ADDRESS } from "../types";

const initialState = {
  isLoading: false,
  address: "",
};

export default stateReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return { ...state, isLoading: payload };
    case SET_ADDRESS:
      return { ...state, address: payload };
    default:
      return state;
  }
};
