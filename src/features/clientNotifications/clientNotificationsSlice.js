import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchClientNotifications = createAsyncThunk(
  "clientNotifications/fetchClientNotifications",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("api/client/notifications");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "clientNotifications/markNotificationRead",
  async (id, thunkAPI) => {
    try {
      await axios.post(`api/client/notifications/${id}/read`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "clientNotifications/markAllNotificationsRead",
  async (_, thunkAPI) => {
    try {
      await axios.post("api/client/notifications/read-all");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const markApplicationNotificationsRead = createAsyncThunk(
  "clientNotifications/markApplicationNotificationsRead",
  async (applicationId, thunkAPI) => {
    try {
      await axios.post(
        `api/client/notifications/read-by-application/${applicationId}`,
      );
      // Unread items may sit beyond the loaded page, so reload for an exact count.
      thunkAPI.dispatch(fetchClientNotifications());
      return applicationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const removeApplication = (state, applicationId) => {
  state.unreadApplicationIds = state.unreadApplicationIds.filter(
    (id) => id !== applicationId,
  );
};

export const clientNotificationsSlice = createSlice({
  name: "clientNotifications",
  initialState: {
    items: [],
    unreadCount: 0,
    unreadApplicationIds: [],
  },
  reducers: {
    // Payload is what Laravel broadcasts: toArray() fields + id + type.
    notificationReceived: (state, { payload }) => {
      const { id, type, ...data } = payload;
      if (state.items.some((n) => n.id === id)) return;
      state.items.unshift({
        id,
        data,
        read_at: null,
        created_at: new Date().toISOString(),
      });
      state.unreadCount += 1;
      if (!state.unreadApplicationIds.includes(data.application_id)) {
        state.unreadApplicationIds.push(data.application_id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientNotifications.fulfilled, (state, { payload }) => {
        state.items = payload.notifications?.data ?? [];
        state.unreadCount = payload.unread_count ?? 0;
        state.unreadApplicationIds = payload.unread_application_ids ?? [];
      })
      .addCase(markNotificationRead.fulfilled, (state, { payload: id }) => {
        const item = state.items.find((n) => n.id === id);
        if (!item || item.read_at) return;
        item.read_at = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        const appId = item.data?.application_id;
        const stillUnread = state.items.some(
          (n) => !n.read_at && n.data?.application_id === appId,
        );
        if (!stillUnread) removeApplication(state, appId);
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        const now = new Date().toISOString();
        state.items.forEach((n) => {
          if (!n.read_at) n.read_at = now;
        });
        state.unreadCount = 0;
        state.unreadApplicationIds = [];
      })
      // Hide the highlight right away; the refetch fixes the count.
      .addCase(
        markApplicationNotificationsRead.pending,
        (state, { meta }) => removeApplication(state, meta.arg),
      );
  },
});

export const { notificationReceived } = clientNotificationsSlice.actions;
