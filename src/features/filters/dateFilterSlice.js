import { createSlice } from "@reduxjs/toolkit";

export const dateFilterSlice = createSlice({
  name: "requestFilter",
  initialState: {
    searchMode: 0,
    searchParams: {
      keyword: "",
      date_from: "",
      date_to: "",
      status: [],
    },
    advanceSearchParams: {
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
      year: "",
    },
  },
  reducers: {
    clearState: (state) => {
      state.searchParams = {
        keyword: "",
        date_from: "",
        date_to: "",
        status: [],
      };
      state.advanceSearchParams = {
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
        year: "",
      };
    },
    setParams: (state, action) => {
      state.searchParams = action.payload;
      return state;
    },
    setAdvanceParams: (state, action) => {
      state.advanceSearchParams = action.payload;
      return state;
    },
    setSearchMode: (state) => {
      state.searchMode = state.searchMode === 0 ? 1 : 0;
      return state;
    },
  },
});
