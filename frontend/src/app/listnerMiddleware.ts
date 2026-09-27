import { createListenerMiddleware } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { aiDesignApi } from "../api/aiDesignApi";
import { logOut } from "./authSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: logOut,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(baseApi.util.resetApiState());
    listenerApi.dispatch(aiDesignApi.util.resetApiState());
  },
});
