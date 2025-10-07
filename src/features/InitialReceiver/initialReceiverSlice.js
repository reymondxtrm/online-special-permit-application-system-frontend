import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getInitialReceived = createAsyncThunk(
  "initialReceiver/getInitialReceived",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/initial-receiver/dashboard",
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

export const gerForInitialReceiving = createAsyncThunk(
  "initialReceiver/gerForInitialReceiving",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/initial-receiver/dashboard",
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

export const initialReceiverSlice = createSlice({
  name: "initialReceiver",
  initialState: {
    initialReceived: [],
    forAction: [],
    errors: "",
    isFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.initialReceived = [];
      state.errors = "";
      state.isFetching = false;
    },
    setDataProps: (state, action) => {
      state.initialReceived = action.payload;
    },
    setDataPropsForAction: (state, action) => {
      state.forAction = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: {
    [getInitialReceived.pending]: (state) => {
      state.isFetching = true;
    },
    [getInitialReceived.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [getInitialReceived.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.initialReceived = payload;
    },
    [gerForInitialReceiving.pending]: (state) => {
      state.isFetching = true;
    },
    [gerForInitialReceiving.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload;
    },
    [gerForInitialReceiving.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = "";
      state.initialReceived = payload;
    },
  },
});

// Selector
export const getInitialReceivedList = (state) =>
  state.initialReceiver.initialReceived;
