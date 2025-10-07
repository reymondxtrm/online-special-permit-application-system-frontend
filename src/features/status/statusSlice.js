import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getStatusList = createAsyncThunk(
    'status/getStatusList',
    async ({ history }, thunkAPI) => {
        try {
            const res = await axios.get('api/get-status-list')
            if (res.data.status === 200) {
                return { ...res.data }
            } else {
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(res.data)
        }
    }
)

export const getRequestStatusList = createAsyncThunk(
    'status/getRequestStatusList',
    async ({ history }, thunkAPI) => {
        try {
            const res = await axios.get('api/get-request-status-list');
            if (res.data.status === 200) {
                return { ...res.data }
            } else {
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const statusSlice = createSlice({
    name: 'status',
    initialState: {
        statusList: [],
        requestStatusList: [],
        error: ''
    },
    reducers: {
        clearState: (state) => {
            state.statusList = [];
            state.error = '';
            return state;
        }
    },
    extraReducers: {
        [getStatusList.fulfilled]: (state, { payload }) => {
            state.statusList = payload.data
        },
        [getStatusList.rejected]: (state, { payload }) => {
            state.error = payload
        },
        [getRequestStatusList.fulfilled]: (state, { payload }) => {
            state.requestStatusList = payload.data
        },
        [getRequestStatusList.rejected]: (state, { payload }) => {
            state.requestStatusList = payload
        },
    }
})