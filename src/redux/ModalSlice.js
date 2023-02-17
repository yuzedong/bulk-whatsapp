import { createSlice } from "@reduxjs/toolkit";

export const ModalSlice = createSlice({
    name: 'modal',
    initialState: {
        create: false,
        view: false,
        edit: false,
        delete: false,
        filterQuery: ''

    },
    reducers: {

        openCreateModal: (state) => {
            state.create = true;
        },

        openViewModal: (state) => {
            state.view = true;
        },

        openDeleteModal: (state) => {
            state.delete = true;
        },

        setFilterQuery: (state, action) => {
            state.filterQuery = action.payload
        },

        clearFilterQuery: (state) => {
            state.filterQuery = ''
        },

        closeModal : (state) => {
            state.create = false;
            state.view = false;
            state.delete = false;
        },
        
    },

})

export const { openCreateModal, openViewModal, openDeleteModal, setFilterQuery, clearFilterQuery, closeModal } = ModalSlice.actions
export default ModalSlice.reducer