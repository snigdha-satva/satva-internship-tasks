import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './slices/layoutSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        theme: themeReducer
    }
})