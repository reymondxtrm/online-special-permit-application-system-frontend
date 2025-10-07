import { createSlice } from "@reduxjs/toolkit";

export const onlineUserSlice = createSlice({
  name: 'onlineUsers',
  initialState: {
    users: []
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload
      return state;
    }
  }
})