import { SET_LOADING, SET_ADDRESS, SET_ERROR } from "../types";

const initialState = {
  isLoading: false,
  address: "",
  error: "",
};

const stateReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return { ...state, isLoading: payload };
    case SET_ADDRESS:
      return { ...state, address: payload };
    case SET_ERROR:
      return { ...state, error: payload };
    default:
      return state;
  }
};

export default stateReducer;
