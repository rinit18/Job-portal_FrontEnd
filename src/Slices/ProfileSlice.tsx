import {  createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: 'profile',
    initialState:  {},
    reducers: {
        changeProfile: (state, action) => {
            return action.payload;
        },
        setProfile: (state, action) => {
            return action.payload;
        }
    }
});
export const { changeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;