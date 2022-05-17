import { combineReducers } from "redux";
import stateReducer from "./state";
import contentReducer from "./content";
import nftReducer from "./nft";

const rootReducer = combineReducers({
  state: stateReducer,
  content: contentReducer,
  nfts: nftReducer,
});

export default rootReducer;
