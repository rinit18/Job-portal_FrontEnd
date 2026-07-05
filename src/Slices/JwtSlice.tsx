import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Validate and return token from localStorage — clears expired/invalid ones
const getInitialToken = (): string => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return "";
        const decoded: any = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return "";
        }
        return token;
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return "";
    }
};

const jwtSlice = createSlice({
    name: 'jwt',
    initialState: getInitialToken(),
    reducers: {
        setJwt: (state, action) => {
            localStorage.setItem("token", action.payload);
            state = action.payload;
            return state;
        },
        removeJwt: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state = "";
            return state;
        }
    }
});
export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;