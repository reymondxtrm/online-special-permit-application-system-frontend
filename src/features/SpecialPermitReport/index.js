import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getReportByType = createAsyncThunk(
  "specialPermitReport/getReportByType",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/reports",
        method: "GET",
        params: { ...params },
      });
      if (response) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const SpecialPermitReport = createSlice({
  name: "specialPermitReport",
  initialState: {
    reportData: [],
    getReportByTypeIsFetching: false,
    errors: null,
  },

  extraReducers: {
    [getReportByType.pending]: (state) => {
      state.getReportByTypeIsFetching = true;
    },
    [getReportByType.fulfilled]: (state, { payload }) => {
      state.getReportByTypeIsFetching = false;
      state.reportData = payload;
    },
    [getReportByType.pending]: (state, { payload }) => {
      state.getReportByTypeIsFetching = false;
      state.errors = payload;
    },
  },
});
