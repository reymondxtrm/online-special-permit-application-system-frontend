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

export const SpecialPermitClientSlice = createSlice({
  name: "specialPermitClient",
  initialState: {
    clientTableData: [],
    getTableDataIsFetching: false,

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
  },
});
