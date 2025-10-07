import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSummary = createAsyncThunk(
  "summary/getSummary",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/summary",
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

export const summarySlice = createSlice({
  name: "summary",
  initialState: {
    summaryDashboard: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.summaryDashboard = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.summaryDashboard = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataForReceiving: (state, action) => {
      state.forAction = action.payload;
    },
  },
  extraReducers: {
    [getSummary.pending]: (state) => {
      state.isFetching = true;
    },
    [getSummary.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getSummary.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.summaryDashboard = payload;
    },
  },
});
