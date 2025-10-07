import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAssessmentReceived = createAsyncThunk(
  "assessmentReceiver/getAssessmentReceived",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/assessment-receiver/dashboard",
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

export const getForAssessmentReceiving = createAsyncThunk(
  "assessmentReceiver/getForAssessmentReceiving",
  async (filters, params, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/assessment-receiver/dashboard",
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

export const assessmentReceiverSlice = createSlice({
  name: "assessmentReceiver",
  initialState: {
    assessmentReceived: [],
    forAction: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.assessmentReceived = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.assessmentReceived = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataForReceiving: (state, action) => {
      state.forAction = action.payload;
    },
  },
  extraReducers: {
    [getAssessmentReceived.pending]: (state) => {
      state.isFetching = true;
    },
    [getAssessmentReceived.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getAssessmentReceived.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.assessmentReceived = payload;
    },
    [getForAssessmentReceiving.pending]: (state) => {
      state.isFetching = true;
    },
    [getForAssessmentReceiving.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getForAssessmentReceiving.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.forAction = payload;
    },
  },
});
