import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getNotificationStatus = createAsyncThunk(
  'userNotifications/getNotificationStatus',
  async ({ history }, thunkAPI) => {
    try {
      const response = await axios({
        url: 'api/notification/get-notification-status',
        method: 'GET'
      });
      if (response.status === 200) {
        return { ...response.data }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
)

export const getUnreadUserNotifications = createAsyncThunk(
  'userNotifications/getUserNotifications',
  async ({ history }, thunkAPI) => {
    try {
      const response = await axios({
        url: 'api/notification/get-user-notifications',
        method: 'GET'
      });
      if (response.status === 200) {
        return { ...response.data }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
)

export const getAllUserNotifications = createAsyncThunk(
  'userNotifications/getAllUserNotifications',
  async ({ history, filter }, thunkAPI) => {
    try {
      const response = await axios({
        url: 'api/notification/get-all-user-notifications',
        method: 'GET',
        params: filter
      });
      if (response.status === 200) {
        return { ...response.data }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
)

export const notificationMarkAsRead = createAsyncThunk(
  'userNotifications/notificationMarkAsRead',
  async ({ history, data }, thunkAPI) => {
    try {
      const response = await axios({
        url: 'api/notification/mark-as-read-notification',
        method: 'POST',
        data: { 'id': data }
      });
      if (response.status === 200) {
        return { ...response.data }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
)

export const notificationMarkAllAsRead = createAsyncThunk(
  'userNotifications/notificationMarkAllAsRead',
  async ({ history }, thunkAPI) => {
    try {
      const response = await axios({
        url: 'api/notification/mark-all-as-read-notification',
        method: 'POST',
      });
      if (response.status === 200) {
        return { ...response.data }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);

    }
  }
)

export const userNotificationsSlice = createSlice({
  name: 'userNotifications',
  initialState: {
    unreadNotifications: [],
    allNotifications: [],
    isFetching: false,
    status: '',
    errors: '',
  },
  reducers: {
    setListState: (state, action) => {
      state.allNotifications = action.payload;
      return state;
    },
    clearState: (state) => {
      state.unreadNotifications = [];
      state.allNotifications = [];
      state.isFetching = [];
      state.errors = '';
      state.status = ''
      return state;
    },
  },
  extraReducers: {
    [getNotificationStatus.pending]: (state) => {
      state.isFetching = true;
    },
    [getNotificationStatus.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload.data;
    },
    [getNotificationStatus.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = '';
      state.status = payload.data;
    },

    [getUnreadUserNotifications.pending]: (state) => {
      state.isFetching = true;
    },
    [getUnreadUserNotifications.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload.data;
    },
    [getUnreadUserNotifications.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = '';
      state.unreadNotifications = payload.data;
    },

    [notificationMarkAsRead.pending]: (state) => {
      state.isFetching = true;
    },
    [notificationMarkAsRead.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload.data;
    },
    [notificationMarkAsRead.fulfilled]: (state, { action, payload }) => {
      state.isFetching = false;
      state.errors = '';
      state.unreadNotifications = payload.data;
    },

    [getAllUserNotifications.pending]: (state) => {
      state.isFetching = true;
    },
    [getAllUserNotifications.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload.data;
    },
    [getAllUserNotifications.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = '';
      state.allNotifications = payload.data;
    },

    [notificationMarkAllAsRead.pending]: (state) => {
      state.isFetching = true;
    },
    [notificationMarkAllAsRead.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = payload.data;
    },
    [notificationMarkAllAsRead.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.errors = '';
      state.unreadNotifications = payload.data;
    },
  }
})