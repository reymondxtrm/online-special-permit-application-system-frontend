import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getRequestTypes = createAsyncThunk(
    'requestTypes/getRequestTypes',
    async ({ history }, thunkAPI) => {
        try {
            const res = await axios.get('api/get-request-types');
            if (res.data.status === 200) {
                return { ...res.data }
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(erro.response.data)

        }
    }
)

export const requestTypeSlice = createSlice({
    name: 'requestType',
    initialState: {
        requestTypes: [],
        errors: ''
    },
    reducers: {
        clearState: (state) => {
            state.requestTypes = [];
            state.errors = '';

            return state;
        },
    },
    extraReducers: {
        [getRequestTypes.fulfilled]: (state, { payload }) => {
            state.requestTypes = payload.data;
        },
        [getRequestTypes.rejected]: (state, { payload }) => {
            state.errors = payload
        }
    }
})