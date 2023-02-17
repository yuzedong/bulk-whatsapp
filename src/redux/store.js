import { configureStore } from "@reduxjs/toolkit";
import actionReducer from './ActionSlice'
import modalReducer from './ModalSlice'
import sessionSlice from "./SessionSlice";

export const store = configureStore({

    reducer: {
        action: actionReducer,
        modal: modalReducer,
        session: sessionSlice,
    },
    devTools: process.env.NODE_ENV === 'development',

})