import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const pusherSlice = createSlice({
  name: 'pusher',
  initialState: {

  },
  reducers: {
    setPusherData: (state,action) => {
      state = action.payload;
      return state;
    }
  }
})