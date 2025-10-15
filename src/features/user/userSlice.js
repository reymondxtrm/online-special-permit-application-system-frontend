import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    if (typeof object[key] !== "object") formData.append(key, object[key]);
    else {
      if (key !== "uploadedID") {
        formData.append(key, JSON.stringify(object[key]));
      } else {
        formData.append(key, object[key][0]);
      }
    }
  });
  return formData;
}

export const loginUser = createAsyncThunk(
  "users/login",
  async ({ data, history }, thunkAPI) => {
    try {
      const res = await axios.post("/api/login", data);
      if (res.data.status === 200) {
        localStorage.setItem("authUser", JSON.stringify(res.data));
        localStorage.setItem("authToken", res.data.token);
        if (res.data.user.user_type === "client") {
          history.push("/client/services");
        } else {
          history.push("/admin/dashboard");
        }
        return { ...res.data };
      } else if (res.data.status === 403) {
        history.push("/email-verification");
      } else {
        return thunkAPI.rejectWithValue(res.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ data, history }, thunkAPI) => {
    try {
      var bodyFormData = getFormData(data);
      const res = await axios.post("/api/sign-up", bodyFormData);
      if (res.data.status === 200) {
        history.push("/email-verification");
        return { ...res.data };
      } else {
        return thunkAPI.rejectWithValue(res.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const specialPermitClientRegister = createAsyncThunk(
  "user/specialPermitClientRegister",
  async ({ params, history }, thunkAPI) => {
    try {
      const response = await axios({
        url: "api/registration",
        method: "POST",
        data: params,
      });
      if (response.status === 200) {
        history.push(`/email-verification/${params.email}`);
        return response;
      }
      return thunkAPI.rejectWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async ({ history, userType }, thunkAPI) => {
    try {
      const res = await axios.post("/api/logout");
      if (res.data.status === 200) {
        history.push("/home");
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        userSlice.actions.clearState();
      } else {
        return thunkAPI.rejectWithValue(res.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ history, data }, thunkAPI) => {
    try {
      const res = await axios.post("api/update-password", data);
      if (res.data.status === 200) {
        return { ...res.data };
      } else {
        return thunkAPI.rejectWithValue(res.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const postForgetPassword = createAsyncThunk(
  "user/postForgetPassword",
  async ({ email }, thunkAPI) => {
    try {
      const res = await axios.post("api/forget-password", { email: email });
      if (res.status === 200) {
        return { ...res.data };
      } else {
        return thunkAPI.rejectWithValue(res.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    id: "",
    roles: [],
    user_type: "",
    username: "",
    withCompanyDetails: "",
    isFetching: false,
    isSuccess: false,
    isLoginError: false,
    isSignUpError: false,
    isSignUpSuccess: false,
    isVerified: "",
    errorMessage: "",
    SignUpSuccessMessage: "",
    updatePasswordSuccessMessage: "",
    forgetError: "",
    forgetSuccessMsg: "",
    forgetIsFetching: false,
  },
  reducers: {
    clearState: (state) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isLoginError = false;
      state.isSignUpError = false;
      state.isSignUpSuccess = false;
      state.updatePasswordError = null;
      state.updatePasswordSuccessMessage = null;
      return state;
    },
    clearForgetPasswordState: (state) => {
      state.forgetSuccessMsg = "";
      state.forgetError = "";
    },
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSignUpError = false;
      state.isSignUpSuccess = true;
      state.SignUpSuccessMessage = payload.message;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isSignUpError = true;
      state.isSignUpSuccess = false;
      state.errorMessage = payload.message;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.name = payload.user.fname;
      state.email = payload.user.email;
      state.id = payload.user.id;
      state.user_type = payload.user.user_type;
      state.roles = payload.roles;
      state.username = payload.user.username;
      state.isFetching = false;
      state.isSuccess = true;
      state.isLoginError = false;
      state.errorMessage = "";
      state.isSignUpError = false;
      state.isSignUpSuccess = false;
      state.isVerified = payload.user.email_verified_at;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isLoginError = true;
      state.errorMessage = payload.message;
      state.isSignUpError = false;
      state.isSignUpSuccess = false;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [logoutUser.fulfilled]: (state) => {
      state.name = "";
      state.id = "";
      state.role = "";
      state.sex = "";
      state.is_password_reset = 0;
      state.position = "";
      state.user_name = "";
      state.isFetching = false;
      state.isSuccess = false;
      state.isLoginError = false;
      state.isSignUpError = false;
      state.isSignUpSuccess = false;
      state.errorMessage = "";
    },
    [logoutUser.rejected]: (state, { payload }) => {
      state.name = "";
      state.id = "";
      state.role = "";
      state.sex = "";
      state.is_password_reset = 0;
      state.position = "";
      state.user_name = "";
      state.isFetching = false;
      state.isSuccess = false;
      state.isLoginError = false;
      state.isSignUpError = false;
      state.isSignUpSuccess = false;
      state.errorMessage = "";
    },
    [updatePassword.pending]: (state) => {
      state.isFetching = true;
    },
    [updatePassword.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.is_password_reset = 0;
      state.updatePasswordError = null;
      state.updatePasswordSuccessMessage = payload.message;
    },
    [updatePassword.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.updatePasswordError = payload.message;
      state.updatePasswordSuccessMessage = null;
    },
    [specialPermitClientRegister.pending]: (state) => {
      state.isFetching = true;
    },
    [specialPermitClientRegister.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSignUpSuccess = true;
    },
    [specialPermitClientRegister.rejected]: (state) => {
      state.isFetching = false;
      state.isSignUpError = true;
    },
    [postForgetPassword.pending]: (state) => {
      state.forgetIsFetching = true;
    },
    [postForgetPassword.fulfilled]: (state, { payload }) => {
      state.forgetIsFetching = false;
      state.forgetSuccessMsg = payload.message;
    },
    [postForgetPassword.rejected]: (state, { payload }) => {
      state.forgetIsFetching = false;
      state.forgetError = payload.message;
    },
  },
});
