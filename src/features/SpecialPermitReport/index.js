import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getReportByType = createAsyncThunk(
  "specialPermitReport/getReportByType",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/receiving-logbook",
        method: "GET",
        params: {
          ...params,
          type: params.type?.value,
          transaction_type: "online",
          // The preview table has no pagination control (it scrolls instead),
          // so request every matching row up front. The endpoint still
          // paginates server-side until that's removed on the backend.
          per_page: 10000,
        },
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
    filter_date_from: "",
    filter_date_to: "",
    filter_type: {},
  },
  reducers: {
    setDataProps: (state, action) => {
      state.reportData = action.payload;
    },
    setShowLoading: (state, action) => {
      state.getReportByTypeIsFetching = action.payload;
    },
    setFilters: (state, { payload }) => {
      state.filter_date_from = payload.date_from;
      state.filter_date_to = payload.date_to;
      state.filter_type = payload.type;
    },
  },
  extraReducers: {
    [getReportByType.pending]: (state) => {
      state.getReportByTypeIsFetching = true;
    },
    [getReportByType.fulfilled]: (state, { payload }) => {
      state.getReportByTypeIsFetching = false;
      state.reportData = payload;
    },
    [getReportByType.rejected]: (state, { payload }) => {
      state.getReportByTypeIsFetching = false;
      state.errors = payload;
    },
  },
});
