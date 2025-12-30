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
      return (
        <Route
          {...rest}
          render={(props) => {
            const storedUser = localStorage.getItem("authUser");
            const authUser = storedUser ? JSON.parse(storedUser) : null;
            const isAuthenticated = !!authUser;
            if (isAuthProtected && !isAuthenticated) {
              return (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: props.location },
                  }}
                />
              );
            }

            if (isAuthProtected && !isVerified) {
              return <Redirect to="/email-verification" />;
            }

            if (!isAuthProtected && isAuthenticated) {
              if (authUser.user.user_type === "admin")
                return <Redirect to="/admin/dashboard" />;
              if (authUser.user.user_type === "client")
                return <Redirect to="/client/services" />;
            }

            return (
              <Layout>
                <Component {...props} />
              </Layout>
            );
          }}
        />
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
