import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCompleteReceived = createAsyncThunk(
  "completeReceiver/getCompleteReceived",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/complete-receiver/dashboard",
        method: "GET",
        params: filters,
      });
      if (response.data) {
        // console.log(response);
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getForCompleteReceiving = createAsyncThunk(
  "completeReceiver/getForCompleteReceiving",
  async (filters, params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/complete-receiver/dashboard",
        method: "GET",
        params: filters,
      });
      if (response.data) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const completeReceiverSlice = createSlice({
  name: "completeReceiver",
  initialState: {
    completeReceived: [],
    forAction: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.completeReceived = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.completeReceived = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataForReceiving: (state, action) => {
      state.forAction = action.payload;
    },
  },
  extraReducers: {
    [getCompleteReceived.pending]: (state) => {
      state.isFetching = true;
    },
    [getCompleteReceived.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getCompleteReceived.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.completeReceived = payload;
    },
    [getForCompleteReceiving.pending]: (state) => {
      state.isFetching = true;
    },
    [getForCompleteReceiving.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getForCompleteReceiving.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.forAction = payload;
    },
  },
});
