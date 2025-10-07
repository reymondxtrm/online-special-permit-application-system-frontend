import { createSlice } from "@reduxjs/toolkit";

export const advanceSearchSlice = createSlice({
  name: "advanceSearch",
  initialState: {
    control_no: "",
    business_name: "",
    type: "",
    gender_type: "",
    business_code: "",
    business_permit: "",
    plate_no: "",
    owner: "",
    status: "",
    date: null,
  },
  reducers: {
    setState: (state, { payload }) => {
      return payload;
    },
    clearState: (state) => {
      state.control_no = "";
      state.business_name = "";
      state.type = "";
      state.gender_type = "";
      state.business_code = "";
      state.business_permit = "";
      state.plate_no = "";
      state.owner = "";
      state.status = "";
      state.date = null;
    },
  },
});
