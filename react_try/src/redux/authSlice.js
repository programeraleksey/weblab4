import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: "loading",
        user: null,
        error: null
    },
    reducers: {
        setLoading(state) {
            state.status = "loading";
            state.error = null;
        },
        setUser(state, action) {
            state.user = action.payload;
            state.status = "ready";
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
            state.status = "ready";
        },
        clearUser(state) {
            state.user = null;
            state.status = "ready";
            state.error = null;
        },
    },
});

export const { setLoading, setUser, setError, clearUser } = authSlice.actions;
export default authSlice.reducer;
