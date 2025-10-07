import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getRequestDetailsList = createAsyncThunk(
  'requestDetails/getRequestDetailsList',
  async ({ history, filter }, thunkAPI) => {
    try {
      const res = await axios({
        url: 'api/service/get-request-details-list',
        method: 'GET',
        params: filter
      });
      if (res.data.status === 200) {
        return { ...res.data };
      }
      else {
        return thunkAPI.rejectWithValue(res.data)
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }

  }
)

export const requestDetailsSlice = createSlice({
  name: 'requestDetails',
  initialState: {
    requestList: [],
    errors: '',
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.requestList = [];
      state.errors = '';
      state.isFetching = false;
      return state;
    },
    setListState: (state, action) => {
      state.requestList = action.payload;
      return state;
    },
    addItem: (state, action) => {
      // state.requestList.data.pop()
      state.requestList.data.unshift(action.payload)
      return state;
    }

  },
  extraReducers: {
    [getRequestDetailsList.fulfilled]: (state, { payload }) => {
      state.requestList = payload.data;
      state.isFetching = false;
      state.errors = '';
    },
    [getRequestDetailsList.rejected]: (state, { payload }) => {
      state.errors = payload;
      state.isFetching = false;
    },
    [getRequestDetailsList.pending]: (state) => {
      state.isFetching = true;
    },
  }
})