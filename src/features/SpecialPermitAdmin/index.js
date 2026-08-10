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
  },
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
  },
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
  },
);
export const getOccupationalDetails = createAsyncThunk(
  "specialPermitAdmin/getOccupationalDetails",
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
  },
);
export const getSpecialPermitAnalyticsData = createAsyncThunk(
  "specialPermitAdmin/getSpecialPermitAnalyticsData",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/analytics",
        method: "GET",
        params: { ...params, type: params.type.value },
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
export const getOfflineTransaction = createAsyncThunk(
  "specialPermitAdmin/getOfflineTransaction",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/offline-transactions",
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
export const getOfflineTransactionDetails = createAsyncThunk(
  "specialPermitAdmin/getOfflineTransactionDetails",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: `api/admin/get-single-offline-transaction/${params.id}`,
        method: "GET",
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

export const SpecialPermitAdminSlice = createSlice({
  name: "specialPermitAdmin",
  initialState: {
    tableData: [],
    getTableDataIsFetching: false,
    companyOccupational: [],
    individualOccupational: [],
    offlineTransaction: [],
    singleOfflineTransaction: [],
    analyticsData: [],
    errors: null,
    getAnalyticsDataIsFetching: false,
    getCompanyOccupationalData: false,
    getOfflineTransactionDetails: false,
    getIndividualOccupationalData: false,
    getOfflineTransaction: false,
    filter_date_from: "",
    filter_date_to: "",
    filter_type: {},
    status: "",
    permit_type: "",
    params: {},
    selectedApplicationId: [],
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
    setShowLoadingOfflineTable: (state, action) => {
      state.getOfflineTransaction = action.payload;
    },
    setDataPropsOfflineTable: (state, action) => {
      state.offlineTransaction = action.payload;
    },
    setDataPropsCompanyOccupational: (state, action) => {
      state.companyOccupational = action.payload;
    },
    setShowLoadingCompanyOccupational: (state, action) => {
      state.getCompanyOccupationalData = action.payload;
    },
    setDataPropsIndividualOccupational: (state, action) => {
      state.individualOccupational = action.payload;
    },
    setShowLoadingIndividualOccupational: (state, action) => {
      state.getIndividualOccupationalData = action.payload;
    },
    setFilters: (state, { payload }) => {
      state.filter_date_from = payload.date_from;
      state.filter_date_to = payload.date_to;
      state.filter_type = payload.type;
    },
    setApplicationIdsForPayment: (state, action) => {
      state.selectedApplicationId = action.payload;
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
    [getSpecialPermitAnalyticsData.pending]: (state) => {
      state.getAnalyticsDataIsFetching = true;
    },
    [getSpecialPermitAnalyticsData.fulfilled]: (state, { payload }) => {
      state.getAnalyticsDataIsFetching = false;
      state.analyticsData = payload;
    },
    [getSpecialPermitAnalyticsData.rejected]: (state, { payload }) => {
      state.getAnalyticsDataIsFetching = false;
      state.errors = payload;
    },
    [getOfflineTransaction.pending]: (state) => {
      state.getOfflineTransaction = true;
    },
    [getOfflineTransaction.fulfilled]: (state, { payload }) => {
      state.getOfflineTransaction = false;
      state.offlineTransaction = payload;
    },
    [getOfflineTransaction.rejected]: (state, { payload }) => {
      state.getOfflineTransaction = false;
      state.errors = payload;
    },
    [getOfflineTransactionDetails.pending]: (state) => {
      state.getOfflineTransactionDetails = true;
    },
    [getOfflineTransactionDetails.fulfilled]: (state, { payload }) => {
      state.getOfflineTransactionDetails = false;
      state.singleOfflineTransaction = payload;
    },
    [getOfflineTransactionDetails.rejected]: (state, { payload }) => {
      state.getOfflineTransactionDetails = false;
      state.errors = payload;
    },
  },
});
