import { faBullseye } from "@fortawesome/free-solid-svg-icons";
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
export const getExemptedCases = createAsyncThunk(
  "admin/getExemptedCases",
  async (thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/exempted-cases",
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
export const getPurpose = createAsyncThunk(
  "admin/getPurpose",
  async (thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get/purposes",
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
export const getClearances = createAsyncThunk(
  "admin/getClearances",
  async (thunkAPI) => {
    try {
      const response = await axios({
        url: "api/get-clearances",
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
    exemptedCases: [],
    getExemptedCaseIsFetching: false,
    governmentProperty: [],
    getGovernmentPropertyIsFetching: false,
    purposes: [],
    getPurposeIsFetching: false,
    clearances: [],
    getClearancesIsFetching: false,
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
    [getExemptedCases.pending]: (state) => {
      state.getExemptedCaseIsFetching = true;
    },
    [getExemptedCases.fulfilled]: (state, { payload }) => {
      state.getExemptedCaseIsFetching = false;
      state.exemptedCases = payload;
    },
    [getExemptedCases.rejected]: (state, { payload }) => {
      state.getExemptedCaseIsFetching = false;
      state.errors = payload;
    },
    [getPurpose.pending]: (state) => {
      state.getPurposeIsFetching = true;
    },
    [getPurpose.fulfilled]: (state, { payload }) => {
      state.getPurposeIsFetching = false;
      state.purposes = payload;
    },
    [getPurpose.rejected]: (state, { payload }) => {
      state.getPurposeIsFetching = false;
      state.errors = payload;
    },
    [getClearances.pending]: (state) => {
      state.getClearancesIsFetching = true;
    },
    [getClearances.fulfilled]: (state, { payload }) => {
      state.getClearancesIsFetching = false;
      state.clearances = payload;
    },
    [getClearances.rejected]: (state, { payload }) => {
      state.getClearancesIsFetching = false;
      state.errors = payload;
    },
  },
});
