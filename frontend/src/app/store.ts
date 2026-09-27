import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { aiDesignApi } from "../api/aiDesignApi";
import authReducer from "./authSlice";
import aiDesignUIReducer from "../features/aiDesign/store/aiDesignSlice"
import { listenerMiddleware } from "./listnerMiddleware";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [aiDesignApi.reducerPath]: aiDesignApi.reducer,
        auth: authReducer,
        aiDesignUI: aiDesignUIReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(baseApi.middleware)
        .concat(aiDesignApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;