import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getBusinessStageData = createAsyncThunk(
  "admin/getBusinessStageData",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/permit-status",
        params: { business_id: params.business_id },
        method: "GET",
      });
      if (response.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.reponse.data);
    }
  }
);
export const getGovernmentProperty = createAsyncThunk(
  "admin/getGovernmentProperty",
  async (thunkAPI) => {
    try {
      const response = await axios({
        url: "api/get-government-property",
        method: "GET",
      });
      if (!response) {
        return thunkAPI.rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const AdminSlice = createSlice({
  name: "batsAdmin",
  initialState: {
    businessStagesData: [],
    errors: null,
    getBusinessStageDataIsFetching: false,
    governmentProperty: [],
    getGovernmentPropertyIsFetching: false,
  },
  extraReducers: {
    [getBusinessStageData.pending]: (state) => {
      state.getBusinessStageDataIsFetching = true;
    },
    [getBusinessStageData.fulfilled]: (state, { payload }) => {
      state.getBusinessStageDataIsFetching = false;
      state.businessStagesData = payload;
    },
    [getBusinessStageData.rejected]: (state, { payload }) => {
      state.getBusinessStageDataIsFetching = false;
      state.errors = payload;
    },
    [getGovernmentProperty.pending]: (state) => {
      state.getGovernmentPropertyIsFetching = true;
    },
    [getGovernmentProperty.fulfilled]: (state, { payload }) => {
      state.getGovernmentPropertyIsFetching = false;
      state.governmentProperty = payload;
    },
    [getGovernmentProperty.rejected]: (state, { payload }) => {
      state.getGovernmentPropertyIsFetching = false;
      state.errors = payload;
    },
  },
});
