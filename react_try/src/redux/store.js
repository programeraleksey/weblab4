import { configureStore } from "@reduxjs/toolkit";
import pointsReducer from "./pointsSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        points: pointsReducer,
        auth: authReducer,
    },
});