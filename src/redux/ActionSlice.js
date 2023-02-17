
import { createSlice } from "@reduxjs/toolkit";

export const ActionSlice = createSlice({
    name: 'action',
    initialState: {
        pending: false,
        error: false,
    },
    reducers: {

        actionStart: (state) => {
            state.pending = true;
        },

        actionSuccess: (state) => {
            state.pending = false;
        },

        actionFailed: (state) => {
            state.error = true;
            state.pending = false;
        },
        closeMessage: (state) => {
            state.error = false;
        },

    },

})

export const { actionStart, actionSuccess, actionFailed, closeMessage, selectRows } = ActionSlice.actions
export default ActionSlice.reducer