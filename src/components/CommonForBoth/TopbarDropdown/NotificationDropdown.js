import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Badge } from "reactstrap";
import SimpleBar from "simplebar-react";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { requestModalSlice } from "features/modal/requestModalSlice";
import Swal from 'sweetalert2';

//i18n
import { withTranslation } from "react-i18next";
import { userModalSlice } from "features/modal/userModalSlice";
import { useEffect } from "react";

import NewUserSignup from "./NotificationComponents/NewUserSignup";
import NewServiceRequest from "./NotificationComponents/NewServiceRequest";
import UpdateRequestStatus from "./NotificationComponents/UpdateRequestStatus";
import ForwardServiceRequest from "./NotificationComponents/ForwardServiceRequest";
import PersonnelAssignment from "./NotificationComponents/PersonnelAssignment";
const NotificationDropdown = props => {
  const userNotifications = useSelector((state) => state.userNotifications.unreadNotifications)
  const dispatch = useDispatch()
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">{userNotifications.length}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <a href="#" className="small">
                  {" "}
                  {/* View All */}
                </a>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {
              userNotifications.length !== 0 ? (
                userNotifications.map((items) => (
                  <div key={items.id}>
                    {
                      items.data.type === 'New User' ? (
                        <NewUserSignup items={items} notificationID={items.id} date={items.created_at} />
                      ) : items.data.type === 'New Service Request' ? (
                        <NewServiceRequest items={items.data.content} notificationID={items.id} date={items.created_at} />
                      ) : items.data.type === 'Update Service Request' ? (
                        <UpdateRequestStatus items={items.data.content} notificationID={items.id} date={items.created_at} />
                      ) : items.data.type === 'Forward Service Request' ? (
                        <ForwardServiceRequest items={items.data.content} notificationID={items.id} date={items.created_at} />
                      ) : items.data.type === 'Personnel Assignment' ? (
                        <PersonnelAssignment items={items.data.content} notificationID={items.id} date={items.created_at} />
                      ) : (
                        <>
                          
                        </>
                      )
                    }

                  </div>
                ))
              ) : (
                <h6 style={{ textAlign: 'center' }}>
                  No new notification
                </h6>
              )
            }
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link className="btn btn-sm btn-link font-size-14 text-center" to="/notification/view-all">
              <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">{props.t("View All..")}</span>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};