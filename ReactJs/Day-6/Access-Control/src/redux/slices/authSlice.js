import { createSlice } from '@reduxjs/toolkit'

const loadAuthFromStorage = () => {
    try {
        const data = localStorage.getItem('auth')
        return data ? JSON.parse(data) : { isAuthenticated: false, user: null }
    } catch {
        return { isAuthenticated: false, user: null }
    }
}

const saveAuthToStorage = (state) => {
    localStorage.setItem('auth', JSON.stringify(state))
}

const initialState = loadAuthFromStorage()

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true
            state.user = action.payload
            saveAuthToStorage(state)
        },

        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            saveAuthToStorage(state)
        },

        restoreUser: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated
            state.user = action.payload.user
        }
    }
})

export const { login, logout, restoreUser } = authSlice.actions
export default authSlice.reducer