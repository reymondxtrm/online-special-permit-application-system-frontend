import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { userSlice } from "../features/user/userSlice";
import { officeSlice } from "features/office/officeSlice";
import { userListSlice } from "features/user/userListSlice";
import { statusSlice } from "features/status/statusSlice";
import { requestTypeSlice } from "features/request/requestTypeSlice";
import { requestDetailsSlice } from "features/request/requestDetailsSlice";
import { requestModalSlice } from "features/modal/requestModalSlice";
import { requestedServiceSlice } from "features/filters/requestedServiceSlice";
import { notificationSlice } from "features/filters/notificationSlice";
import { userModalSlice } from "features/modal/userModalSlice";
import { userNotificationsSlice } from "features/notifications/userNotificationsSlice";
import { pusherSlice } from "features/pusher/pusherSlice";
import { onlineUserSlice } from "features/user/onlineUserSlice";
import Layout from "store/layout/reducer";
import Account from "store/auth/register/reducer";
import { initialReceiverSlice } from "features/InitialReceiver/initialReceiverSlice";
import { analyticsSlice } from "features/Analytics/analyticsSlice";
import { assessmentReceiverSlice } from "features/AssessmentReceiver/assessmentReceiverSlice";
import { completeReceiverSlice } from "features/CompleteReceiver/completeReceiverSlice";
import { assessmentReleaserSlice } from "features/AssessmentReleaser/assessmentReleaserSlice";
import { finalReleaserSlice } from "features/FinalReleaser/finalReleaserSlice";
import { dateFilterSlice } from "features/filters/dateFilterSlice";
import { summarySlice } from "features/Summary/summarySlice";
import { advanceSearchSlice } from "features/AdvanceSearch";
// Authentication
import ForgetPassword from "store/auth/forgetpwd/reducer";
import Profile from "store/auth/profile/reducer";

import rootSaga from "../store/sagas";
import createSagaMiddleware from "redux-saga";
import { AdminSlice } from "features/AdminSlice/AdminSlice";

const sagaMiddleware = createSagaMiddleware();
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducers = combineReducers({
  user: userSlice.reducer,
  summary: summarySlice.reducer,
  analytics: analyticsSlice.reducer,
  initialReceiver: initialReceiverSlice.reducer,
  assessmentReceiver: assessmentReceiverSlice.reducer,
  assessmentReleaser: assessmentReleaserSlice.reducer,
  completeReceiver: completeReceiverSlice.reducer,
  finalReleaser: finalReleaserSlice.reducer,
  dateFilter: dateFilterSlice.reducer,
  office: officeSlice.reducer,
  userList: userListSlice.reducer,
  status: statusSlice.reducer,
  requestType: requestTypeSlice.reducer,
  requestDetails: requestDetailsSlice.reducer,
  requestModal: requestModalSlice.reducer,
  requestFilter: requestedServiceSlice.reducer,
  notificationFilter: notificationSlice.reducer,
  userModal: userModalSlice.reducer,
  userNotifications: userNotificationsSlice.reducer,
  pusher: pusherSlice.reducer,
  onlineUsers: onlineUserSlice.reducer,
  advanceSearch: advanceSearchSlice.reducer,
  batsAdmin: AdminSlice.reducer,
  Layout,
  Account,
  ForgetPassword,
  Profile,
});
const rootReducer = (state, action) => {
  if (
    action.type === "user/logoutUser/fulfilled" ||
    action.type === "user/logoutUser/rejected"
  ) {
    state = undefined;
  }
  return reducers(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).prepend(sagaMiddleware);
  },
});
sagaMiddleware.run(rootSaga);
