import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAnalyticsData = createAsyncThunk(
  "analytics/getAnalyticsData",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/analytics",
        method: "GET",
        params: filters,
      });
      if (response.data) {
        // console.log(response.data.gender.female);
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    analyticsData: {},
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.analyticsData = {};
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.analyticsData = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: {
    [getAnalyticsData.pending]: (state) => {
      state.isFetching = true;
    },
    [getAnalyticsData.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getAnalyticsData.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.analyticsData = payload;
    },
  },
});
