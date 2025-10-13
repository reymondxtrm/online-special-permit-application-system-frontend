import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { requestedServiceSlice } from "features/filters/requestedServiceSlice";
import {
  getUnreadUserNotifications,
  getNotificationStatus,
  getAllUserNotifications,
} from "features/notifications/userNotificationsSlice";
import { getPersonnel } from "features/user/userListSlice";
import { Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import { notificationSlice } from "features/filters/notificationSlice";
import { connect } from "react-redux";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import "./assets/css/tableStyle.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom/";
import Notifications from "components/Notifications";

const App = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const httpsAgent = new https.Agent({
  //   rejectUnauthorized: false, // Disables SSL certificate validation
  // });
  axios.defaults.baseURL =
    window.location.protocol + "//" + process.env.REACT_APP_API;
  // process.env.REACT_APP_API;
  // axios.defaults.baseURL = "https://172.16.0.162/bats_backend/public";
  // axios.defaults.baseURL =
  //   "https://test.butuan.gov.ph/itsm_version3_backend/public";
  // axios.defaults.httpsAgent = httpsAgent;
  axios.defaults.headers.post["Accept"] = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("authToken");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        // window.location.href = '/logout';
        // window.location.href = "/pages-forbidden";
        history.replace("/pages-forbidden");
      } else if (error.response.status === 503) {
        // window.location.href = '/pages-maintenance';
        // history.replace("/pages-forbidden");
        console.log(error.response.status);
      }
      return Promise.reject(error);
    }
  );
  const userDetails = useSelector((state) => state.user);
  const isVerified = !!userDetails?.isVerified;
  const requestParams = useSelector((state) => state.requestFilter.params);

  const notificationParams = useSelector(
    (state) => state.notificationFilter.params
  );
  function getLayout() {
    let layoutCls = VerticalLayout;
    return layoutCls;
  }
  const Layout = getLayout();
  return (
    <React.Fragment>
      <Router basename="/">
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              isVerified={isVerified}
              exact
            />
          ))}
          {/* <Redirect to="/admin/dashboard" /> */}
          <Redirect to="/home" />
        </Switch>
      </Router>

      <Notifications />
    </React.Fragment>
  );
};
App.propTypes = {
  layout: PropTypes.any,
};
const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(mapStateToProps, null)(App);
