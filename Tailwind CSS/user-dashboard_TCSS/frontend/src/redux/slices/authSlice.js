import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token,
            state.user = action.payload.user,
            state.isAuthenticated = true

            localStorage.setItem("authToken", action.payload.token)
        },
        logout: (state) => {
            state.token = null,
            state.user = null,
            state.isAuthenticated = false
            localStorage.removeItem("authToken")
        }
    }
});

export const { login, logout } = authSlice.actions
export default authSlice.reducer