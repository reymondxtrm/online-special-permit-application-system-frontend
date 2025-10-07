import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: 'notificationFilter',
  initialState: {
    params: {
      notificationStatus: { 'label': 'ALL', 'value': 10 },
      notificationDetails: ""
    }
  },
  reducers: {
    setParams: (state, action) => {
      state.params = action.payload
      return state;
    }
  }
})