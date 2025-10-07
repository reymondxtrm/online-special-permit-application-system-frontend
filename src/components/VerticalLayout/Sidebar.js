import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logo from "../../assets/images/bg_logo.svg";
import logoCicto from "../../assets/images/itsm_logo.png";
import logoITSM from "../../assets/images/itsm_logo_word.png";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          {/* <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoCicto} alt="" height="30" />
            </span>
            <span className="logo-lg">
              <img src={logoITSM} alt="" height="40" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoCicto} alt="" height="30" />
            </span>
            <span className="logo-lg">
              <img src={logoITSM} alt="" height="40" />
            </span>
          </Link> */}
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
