import { configureStore, Middleware } from "@reduxjs/toolkit";
import { updateProfile } from "./Services/ProfileService";

import userReducer from "./Slices/UserSlice";
import profileReducer from "./Slices/ProfileSlice";
import filterReducer from "./Slices/FilterSlice";
import sortReducer from "./Slices/SortSlice";
import jwtReducer from "./Slices/JwtSlice";
import overlayReducer from "./Slices/OverlaySlice";
const profileUpdateMiddleware: Middleware = store => next => action => {
    const result = next(action);
    // When a profile change is dispatched, fire the async API call in the background
    if (typeof action === 'object' && action !== null && 'type' in action && action.type === 'profile/changeProfile') {
        updateProfile((action as any).payload).catch(err => console.error("Failed to sync profile update", err));
    }
    return result;
};

export default configureStore({
    reducer:{
        user:userReducer,
        profile:profileReducer,
        filter:filterReducer,
        sort:sortReducer,
        jwt:jwtReducer,
        overlay: overlayReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(profileUpdateMiddleware)
});