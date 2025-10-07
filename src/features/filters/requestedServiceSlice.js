import { createSlice } from "@reduxjs/toolkit";

export const requestedServiceSlice = createSlice({
    name: 'requestFilter',
    initialState:{
        params:''
    },
    reducers:{
        setParams:(state,action)=>{
            state.params = action.payload
            return state;
        }
    }
})