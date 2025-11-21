import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTableData = createAsyncThunk(
  "specialPermitAdmin/getTableData",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/special-permit/applications",
        method: "GET",
        params: { ...params },
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
export const getCompanyOccupatinalData = createAsyncThunk(
  "specialPermitAdmin/getCompanyOccupatinalData",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get-companies-occupational-applications",
        method: "GET",
        params: { ...params },
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
export const getIndividualOccupationalApplications = createAsyncThunk(
  "specialPermitAdmin/getIndividualOccupationalApplications",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get-individual-occupational-applications",
        method: "GET",
        params: { ...params },
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
export const SpecialPermitAdminSlice = createSlice({
  name: "specialPermitAdmin",
  initialState: {
    tableData: [],
    getTableDataIsFetching: false,
    companyOccupational: [],
    individualOccupational: [],
    getCompanyOccupationalData: false,
    getIndividualOccupationalData: false,

    params: {},
  },
  reducers: {
    setDataProps: (state, action) => {
      state.tableData = action.payload;
    },
    setShowLoading: (state, action) => {
      state.getTableDataIsFetching = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
  },
  extraReducers: {
    [getTableData.pending]: (state) => {
      state.getTableDataIsFetching = true;
    },
    [getTableData.fulfilled]: (state, { payload }) => {
      state.getTableDataIsFetching = false;
      state.tableData = payload;
    },
    [getTableData.rejected]: (state, { payload }) => {
      state.getTableDataIsFetching = false;
      state.errors = payload.data;
    },
    [getCompanyOccupatinalData.pending]: (state) => {
      state.getCompanyOccupationalData = true;
    },
    [getCompanyOccupatinalData.fulfilled]: (state, action) => {
      state.getCompanyOccupationalData = false;
      state.companyOccupational = action.payload;
    },
    [getCompanyOccupatinalData.rejected]: (state, action) => {
      state.getCompanyOccupationalData = false;
      state.errors = action.payload;
    },
    [getIndividualOccupationalApplications.pending]: (state) => {
      state.getIndividualOccupationalData = true;
    },
    [getIndividualOccupationalApplications.fulfilled]: (state, action) => {
      state.getIndividualOccupationalData = false;
      state.individualOccupational = action.payload;
    },
    [getIndividualOccupationalApplications.rejected]: (state, action) => {
      state.getIndividualOccupationalData = false;
      state.errors = action.payload;
    },
  },
});
