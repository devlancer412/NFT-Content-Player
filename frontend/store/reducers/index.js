import { combineReducers } from "redux";
import stateReducer from "./state";
import contentReducer from "./content";
import blobReducer from "./blob";

const rootReducer = combineReducers({
  state: stateReducer,
  content: contentReducer,
  blob: blobReducer,
});

export default rootReducer;
