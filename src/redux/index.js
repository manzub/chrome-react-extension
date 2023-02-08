import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { userReducer } from "./reducers";

const reducer = ({
  user: userReducer
})

// const store = createStore(combineReducers(reducer), compose(applyMiddleware(thunk), composeWithDevTools()));
const store = configureStore({ reducer, middleware: [thunk], preloadedState: {} })

export default store;