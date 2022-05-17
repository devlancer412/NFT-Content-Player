import { SET_NFTS } from "../types";

const nftReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_NFTS:
      return payload;
    default:
      return state;
  }
};

export default nftReducer;
