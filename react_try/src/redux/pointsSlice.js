import { createSlice } from "@reduxjs/toolkit";

const pointsSlice = createSlice({
    name: "points",
    initialState: {
        items: [],
    },
    reducers: {
        addPoint: (state, action) => {
            state.items.push(action.payload);
        },

        setPoints: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const { addPoint, setPoints } = pointsSlice.actions;
export default pointsSlice.reducer;
