import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getOffices = createAsyncThunk(
    'office/getOffice',
    async ({ history }, thunkAPI) => {
        try {
            const res = await axios.get('api/get-offices')
            if (res.data.status === 200) {
                return { ...res.data }
            } else {
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(e.res.data)
        }
    }
)
export const officeSlice = createSlice({
    name: 'office',
    initialState: {
        offices: [],
        errors: ''
    },
    reducers: {
        clearState: (state) => {
            state.offices = [];
            state.errors = '';

            return state;
        },
    },
    extraReducers: {
        [getOffices.fulfilled]: (state, { payload }) => {
            state.offices = payload.data;
        },
        [getOffices.rejected]: (state, { payload }) => {
            state.errors = payload
        }
    }
})