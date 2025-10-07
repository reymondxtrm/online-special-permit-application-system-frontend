import { createSlice } from '@reduxjs/toolkit'

export const userModalSlice = createSlice({
    name: 'userModal',
    initialState: {
        modal: false,
        modalData: ''
    },
    reducers: {
        clearState: (state) => {
            state.modal = false;
            state.modalData = '';
            return state;
        },
        setModalData: (state, action) => {
            state.modalData = action.payload;
            return state;
        },
        toggleModal: (state) => {
            state.modal = !state.modal;
            return state;
        },
        closeModal: (state) => {
            state.modal = false;
            return state;
        },
        openModal: (state) => {
            state.modal = true;
            return state;
        }
    }
})