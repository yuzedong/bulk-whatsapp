import { createSlice } from "@reduxjs/toolkit";

export const SessionSlice = createSlice({
    name: 'session',
    initialState: {
        user: null,
        token: null,
        loggedIn: false,
    },
    reducers: {

        setUserInfo: (state, action) => {
            state.user = action.payload
        },
        setLoginState: (state, action) => {
            state.loggedIn = action.payload
        },
        setUserToken: (state, action) => {
            state.token = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = ''
            state.loggedIn = false
        },
        
    },

})

export const { setUserInfo, setUserToken, setLoginState, logout } = SessionSlice.actions
export default SessionSlice.reducer