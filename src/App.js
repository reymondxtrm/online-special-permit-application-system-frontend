import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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

// Pages are lazy-loaded, but these global (non-module) styles leak between
// printables/modals, so keep them loaded up front and before the theme, as before.
import "sweetalert2/dist/sweetalert2.min.css";
import "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Modals/Common/RoutePlanViewer.css";
import "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Printables/MayorsAndGoodMoralRequestForm.css";
import "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Printables/OccupationalRequestForm.css";
import "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Printables/RequestForm.css";
import "pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Modals/PaymentModal.css";
import "pages/CbpldLandingPage/SpecialPermit/Printables/CedulaApplicationForm/cedulaApplicationForm.css";
import "pages/CbpldLandingPage/SpecialPermit/Printables/Certification/style.css";
import "pages/CbpldLandingPage/SpecialPermit/Printables/Events/style.css";
import "pages/CbpldLandingPage/SpecialPermit/Printables/OccupationalCertificate/OccupationalCertificate.css";
import "pages/CbpldLandingPage/SpecialPermit/SpecialPermitDetailsQr/style.css";

// Import scss
import "./assets/scss/theme.scss";
import "./assets/css/tableStyle.css";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom/";
import { setUnauthorizedHandler } from "helpers/axiosSetup";
import Notifications from "components/Notifications";
import echo from "../src/pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Common/echo";

const App = (props) => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const history = useHistory();
  // axios defaults, token and error normalization: helpers/axiosSetup.js
  // (registered once at startup instead of on every render)
  useEffect(() => {
    setUnauthorizedHandler(() => history.replace("/pages-forbidden"));
    return () => setUnauthorizedHandler(null);
  }, [history]);
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
  useEffect(() => {
    if (!echo?.connector?.pusher?.connection) return;

    const connection = echo.connector.pusher.connection;

    const handleConnected = () => {
      console.log("Pusher Connected!");
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      console.log("Pusher Disconnected!");
      setIsConnected(false);
    };

    connection.bind("connected", handleConnected);
    connection.bind("disconnected", handleDisconnected);

    return () => {
      connection.unbind("connected", handleConnected);
      connection.unbind("disconnected", handleDisconnected);
    };
  }, []);

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
          <Redirect to="home" />
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
