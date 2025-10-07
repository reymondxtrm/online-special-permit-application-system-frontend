import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSpecificRequestDetails = createAsyncThunk(
    'requestModal/getSpecificRequestDetails',
    async ({ data, history }, thunkAPI) => {
        try {
            const res = await axios.post('api/service/get-specific-request-details', { 'id': data })
            if (res.status === 200) {
                return { ...res.data }
            } else {
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(e.res.data)
        }
    }
)
export const requestModalSlice = createSlice({
    name: 'requestModal',
    initialState: {
        modal: false,
        modalData: '',
        errors: ''
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
    },
    extraReducers: {
        [getSpecificRequestDetails.fulfilled]: (state, { payload }) => {
            state.modalData = payload;
            // requestModalSlice.caseReducers.setModalData(payload)
        },
        [getSpecificRequestDetails.rejected]: (state, { payload }) => {
            state.errors = payload;
        },
        [getSpecificRequestDetails.pending]: (state) => {

        },
    }
})