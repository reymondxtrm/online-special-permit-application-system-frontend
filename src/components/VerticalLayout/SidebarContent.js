import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const ref = useRef();
  const userDetails = useSelector((state) => state.user);
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;
    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item?.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El?.classList.add("mm-show");
    }

    if (parent) {
      parent?.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  const checkUserType = (userType) => {
    if (userType.includes(userDetails.user_type)) {
      return true;
    }
    return false;
  };

  const checkRole = (roles) => {
    var allowAccess = false;
    roles.map((role) => {
      if (userDetails.roles.includes(role)) {
        return (allowAccess = true);
      }
    });

    return allowAccess;
  };

  // const checkRole = (roles = [], userType) => {
  //   if (userDetails.user_type === userType) {
  //     if (roles.length === 0) {
  //       return true;
  //     } else {
  //       roles.map((role) => {
  //         if (userDetails.roles.includes(role)) {
  //           return true;
  //         }
  //       });
  //     }
  //   }

  //   return false;
  // };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          {checkUserType(["client"]) && (
            <ul className="metismenu list-unstyled" id="side-menu">
              <>
                <li>
                  <Link to="/client/services">
                    <i className=" mdi mdi-package-variant fs-2"></i>
                    <span>{props.t("Services")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/client/dashboard">
                    <i className="mdi mdi-view-dashboard fs-2"></i>
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/client/pending">
                    <i className="mdi mdi-progress-clock fs-2"></i>
                    <span>{props.t("Pending")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="mdi mdi-currency-usd fs-2"></i>
                    <span>{props.t("Payment")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/client/for-payment/approval">
                        {props.t("For Approval")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/client/for-payment/dashboard">
                        {props.t("For Payment")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/client/returned/dashboard">
                        {props.t("Returned Payment")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/client/for-signature">
                    <i className="mdi mdi-file-check fs-2"></i>
                    <span>{props.t("For Final Approval")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/client/declined">
                    <i className="mdi mdi-file-cancel fs-2"></i>
                    <span>{props.t("Returned Application")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/client/profile">
                    <i className="bx bxs-user-detail fs-2"></i>
                    <span>{props.t("Profile")}</span>
                  </Link>
                </li>
              </>
            </ul>
          )}
          {checkUserType(["admin"]) && checkRole(["special_permit_admin"]) && (
            <>
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <p
                    style={{
                      color: "white",
                      marginTop: "20px",
                      marginLeft: "10px",
                    }}
                  >
                    {props.t("ONLINE TRANSACTION")}
                  </p>
                </li>
                <li>
                  <Link to="/admin/analytics">
                    <i className="mdi mdi-view-dashboard fs-2"></i>
                    <span>{props.t("Analytics")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/dashboard">
                    <i className="mdi mdi-view-dashboard fs-2"></i>
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/pending">
                    <i className="mdi mdi-progress-clock fs-2"></i>
                    <span>{props.t("Pending")}</span>{" "}
                  </Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="mdi mdi-currency-usd fs-2"></i>
                    <span>{props.t("Payment")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/admin/for-payment/approval">
                        {props.t("For Approval")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/for-payment/dashboard">
                        {props.t("For Payment ")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/returned/dashboard">
                        {props.t("Returned Payment")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/admin/declined">
                    <i className="mdi mdi-file-cancel fs-a2"></i>
                    <span>{props.t("Returned Application")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/for-signature">
                    <i className="mdi mdi-file-check fs-2"></i>
                    <span> {props.t("For Final Approval")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/controls">
                    <i className="mdi mdi-shield-account fs-2"></i>
                    <span>{props.t("Admin Controls")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/user-control">
                    <i className="mdi mdi-account-circle fs-2"></i>
                    <span>{props.t("User Control")}</span>
                  </Link>
                </li>
                {checkRole(["super_admin"]) && (
                  <li>
                    <Link to="/super-admin">
                      <i className="mdi mdi-robot-angry fs-2"> </i>
                      <span>{props.t("Super Admin Config")}</span>
                    </Link>
                  </li>
                )}
                <li>
                  <p
                    style={{
                      color: "white",
                      marginTop: "20px",
                      marginLeft: "10px",
                    }}
                  >
                    {props.t("OFFLINE TRANSACTION")}
                  </p>
                </li>
                <li>
                  <Link to="/offline-transaction/dashboard">
                    <i className="bx bxs-user-detail fs-2"></i>
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/offline-transaction/release">
                    <i className="bx bxs-user-detail fs-2"></i>
                    <span>{props.t("For Releasing")}</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
