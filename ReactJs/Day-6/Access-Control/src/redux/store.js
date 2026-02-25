import { configureStore  } from "@reduxjs/toolkit";
import authenticationReducer from './slices/authSlice'

export const store = configureStore({
    reducer: {
        auth: authenticationReducer
    }
})