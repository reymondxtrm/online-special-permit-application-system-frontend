import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getClientTableData = createAsyncThunk(
  "specialPermitClient/getClientTableData",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/client/special-permit/applications",
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
export const getCompanyClientTable = createAsyncThunk(
  "specialPermitClient/getCompanyClientTable",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        // url: "api/client/special-permit/applications",
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
export const getUserDetailsForCedulaApplication = createAsyncThunk(
  "specialPermitClient/getUserDetailsForCedulaApplication",
  async (params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/client/get-user-details-for-cedula-application",
        method: "GET",
        params: { cedula_application_ids: params },
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

export const SpecialPermitClientSlice = createSlice({
  name: "specialPermitClient",
  initialState: {
    clientTableData: [],
    getTableDataIsFetching: false,
    clientCompanyTable: [],
    selectedApplicationId: [],
    getClientCompanyTableIsFetching: false,
    cedulaDetails: [],
    getUserDetailsForCedulaApplicationIsFetching: false,
    errors: "",
    params: {},
  },
  reducers: {
    setDataProps: (state, action) => {
      state.clientTableData = action.payload;
    },
    setShowLoading: (state, action) => {
      state.getTableDataIsFetching = action.payload;
    },
    setProps: (state, action) => {
      state.params = { ...action.payload };
    },
    setApplicationIdsForPayment: (state, action) => {
      state.selectedApplicationId = action.payload;
    },
  },
  extraReducers: {
    [getClientTableData.pending]: (state) => {
      state.getTableDataIsFetching = true;
    },
    [getClientTableData.fulfilled]: (state, action) => {
      state.getTableDataIsFetching = false;
      state.clientTableData = action.payload;
    },
    [getClientTableData.rejected]: (state, action) => {
      state.getTableDataIsFetching = false;
      state.errors = action.payload;
    },
    [getCompanyClientTable.pending]: (state) => {
      state.getClientCompanyTableIsFetching = true;
    },
    [getCompanyClientTable.fulfilled]: (state, action) => {
      state.getClientCompanyTableIsFetching = false;
      state.clientCompanyTable = action.payload;
    },
    [getCompanyClientTable.rejected]: (state, action) => {
      state.getClientCompanyTableIsFetching = false;
      state.errors = action.payload;
    },
    [getUserDetailsForCedulaApplication.pending]: (state) => {
      state.getUserDetailsForCedulaApplicationIsFetching = true;
    },
    [getUserDetailsForCedulaApplication.fulfilled]: (state, action) => {
      state.getUserDetailsForCedulaApplicationIsFetching = false;
      state.cedulaDetails = action.payload;
    },
    [getUserDetailsForCedulaApplication.rejected]: (state, action) => {
      state.getUserDetailsForCedulaApplicationIsFetching = false;
      state.errors = action.payload;
    },
  },
});
