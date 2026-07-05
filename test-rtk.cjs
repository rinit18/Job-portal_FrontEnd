import { configureStore, createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: 'profile',
    initialState: {},
    reducers: {
        setProfile: (state, action) => {
            state = action.payload;
            return state;
        }
    }
});

const store = configureStore({
    reducer: {
        profile: profileSlice.reducer
    }
});

console.log("Initial state:", store.getState());
store.dispatch(profileSlice.actions.setProfile({ id: 2, name: "Test" }));
console.log("After dispatch:", store.getState());
