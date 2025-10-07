import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAssessmentReleased = createAsyncThunk(
  "assessmentReleaser/getAssessmentReleased",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/assessment-releaser/dashboard",
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

export const getForAssessmentReleasing = createAsyncThunk(
  "assessmentReleaser/getForAssessmentReleasing",
  async (filters, params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/assessment-releaser/dashboard",
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

export const assessmentReleaserSlice = createSlice({
  name: "assessmentReleaser",
  initialState: {
    assessmentReleased: [],
    forAction: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.assessmentReleased = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.assessmentReleased = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataForReceiving: (state, action) => {
      state.forAction = action.payload;
    },
  },
  extraReducers: {
    [getAssessmentReleased.pending]: (state) => {
      state.isFetching = true;
    },
    [getAssessmentReleased.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getAssessmentReleased.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.assessmentReleased = payload;
    },
    [getForAssessmentReleasing.pending]: (state) => {
      state.isFetching = true;
    },
    [getForAssessmentReleasing.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getForAssessmentReleasing.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.forAction = payload;
    },
  },
});
