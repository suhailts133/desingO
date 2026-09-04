import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { aiDesignApi } from "../api/aiDesignApi";
import authReducer from "./authSlice";
import aiDesignUIReducer from "../features/aiDesign/store/aiDesignSlice"

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [aiDesignApi.reducerPath]: aiDesignApi.reducer,
        auth: authReducer,
        aiDesignUI: aiDesignUIReducer, 
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(baseApi.middleware)
        .concat(aiDesignApi.middleware) 
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;