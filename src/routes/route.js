import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isVerified,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      const isAuthenticated = localStorage.getItem("authUser");
      const path = rest.path;
      if (isAuthProtected && !isAuthenticated) {
        if (path.startsWith("/client")) {
          return <Redirect to="/home" />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }
      } else if (isAuthProtected && !isVerified) {
        return <Redirect to="/email-verification" />;
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  isVerified: PropTypes.bool,
};

export default Authmiddleware;
