import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getFinalReleased = createAsyncThunk(
  "finalReleaser/getFinalReleased",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/final-releaser/dashboard",
        method: "GET",
        params: filters,
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

export const getForFinalReleasing = createAsyncThunk(
  "finalReleaser/getForFinalReleasing",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/final-releaser/dashboard",
        method: "GET",
        params: filters,
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
export const getForPrinting = createAsyncThunk(
  "finalReleaser/getForPrinting",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/final-releaser/dashboard",
        method: "GET",
        params: filters,
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

export const finalReleaserSlice = createSlice({
  name: "finalReleaser",
  initialState: {
    finalReleased: [],
    forPrinting: [],
    forAction: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.finalReleased = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.finalReleased = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataForReceiving: (state, action) => {
      state.forAction = action.payload;
    },
    setDataForPrinting: (state, action) => {
      state.forPrinting = action.payload;
    },
  },
  extraReducers: {
    [getFinalReleased.pending]: (state) => {
      state.isFetching = true;
    },
    [getFinalReleased.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getFinalReleased.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.finalReleased = payload;
    },
    [getForFinalReleasing.pending]: (state) => {
      state.isFetching = true;
    },
    [getForFinalReleasing.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getForFinalReleasing.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.forAction = payload;
    },
    [getForPrinting.pending]: (state) => {
      state.isFetching = true;
    },
    [getForPrinting.fulfilled]: (state, { payload }) => {
      state.forPrinting = payload;
      state.isFetching = false;
      state.errors = "";
    },
    [getForPrinting.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
  },
});
