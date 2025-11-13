import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPersonnel = createAsyncThunk(
  "users/getPersonnel",
  async ({ history }, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/get-personnel",
        method: "GET",
      });
      if (response.data.status === 200) {
        return { ...response.data };
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserList = createAsyncThunk(
  "users/getUserList",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get-OSPAS-users",
        method: "GET",
        params: filters,
      });
      if (response.data) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getCompanyListUnvalidated = createAsyncThunk(
  "users/getCompanyListUnvalidated",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get-OSPAS-users",
        method: "GET",
        params: { ...filters },
      });

      if (response.data) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserListControls = createAsyncThunk(
  "users/getUserListsControls",
  async (filters, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/admin/get-user-list-controls",
        method: "GET",
        params: { ...filters },
      });
      if (response.data.status === 200) {
        return { ...response.data };
      } else {
        return thunkAPI.rejectWithValue(response.data.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserRoles = createAsyncThunk(
  "users/getUserRoles",
  async ({ history }, thunkAPI) => {
    try {
      const response = await axios.get("api/admin/get-user-roles");
      if (response.data.status === 200) {
        return { ...response.data };
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
    unvalidatedUser: [],
    divisions: [],
    userRoles: [],
    personnel: [],
    errors: "",
    isFetching: false,
    getCompanyListUnvalidatedIsFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.users = [];
      state.state.divisions = [];
      state.userRoles = [];
      state.personnel = [];
      state.errors = "";
      state.isFetching = false;
      state.unvalidatedUser;
      return state;
    },
    setListState: (state, action) => {
      state.users = action.payload;
      return state;
    },
    setDataProps: (state, action) => {
      state.users = action.payload;
    },
    setShowLoading: (state, action) => {
      state.isFetching = action.payload;
    },
    setDataUnvalidatedUserProps: (state, action) => {
      state.users = action.payload;
    },
    setShowUnvalidatedIsLoading: (state, action) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: {
    [getUserList.fulfilled]: (state, { payload }) => {
      state.users = payload;
      state.isFetching = false;
      state.errors = "";
    },
    [getUserList.rejected]: (state, { payload }) => {
      state.errors = payload;
      state.isFetching = false;
    },
    [getUserList.pending]: (state) => {
      state.isFetching = true;
    },
    [getUserListControls.fulfilled]: (state, { payload }) => {
      state.users = payload.data;
      state.isFetching = false;
      state.errors = "";
    },
    [getUserListControls.rejected]: (state, { payload }) => {
      state.errors = payload;
      state.isFetching = false;
    },
    [getUserListControls.pending]: (state) => {
      state.isFetching = true;
    },

    [getUserRoles.pending]: (state) => {
      state.isFetching = true;
    },
    [getUserRoles.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.userRoles = payload.data;
    },
    [getUserRoles.rejected]: (state, { payload }) => {
      state.isFetching = false;
    },
    [getPersonnel.pending]: (state) => {
      state.isFetching = true;
    },
    [getPersonnel.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.personnel = payload.data;
    },
    [getPersonnel.rejected]: (state, { payload }) => {
      state.isFetching = false;
    },
    [getCompanyListUnvalidated.pending]: (state) => {
      state.isFetching = true;
    },
    [getCompanyListUnvalidated.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.unvalidatedUser = payload;
    },
    [getCompanyListUnvalidated.rejected]: (state, { payload }) => {
      state.isFetching = false;
    },
  },
});
