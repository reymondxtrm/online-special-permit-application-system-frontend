import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import echo from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Common/echo";
import {
  fetchClientNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  notificationReceived,
} from "features/clientNotifications/clientNotificationsSlice";

const STATUS_ICONS = {
  returned: "bx bx-undo text-warning",
  declined: "bx bx-x-circle text-danger",
  for_payment: "bx bx-wallet text-primary",
  issued: "bx bx-badge-check text-success",
};

const ClientNotificationDropdown = ({ userId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [menu, setMenu] = useState(false);
  const { items, unreadCount } = useSelector(
    (state) => state.clientNotifications,
  );

  useEffect(() => {
    if (!userId) return;
    // DB is the source of truth; realtime only adds on top of it.
    dispatch(fetchClientNotifications());
    const channelName = `App.Models.User.${userId}`;
    echo
      .private(channelName)
      .notification((n) => dispatch(notificationReceived(n)));
    return () => echo.leave(channelName);
  }, [userId, dispatch]);

  const open = (n) => {
    if (!n.read_at) dispatch(markNotificationRead(n.id));
    setMenu(false);
    history.push("/client/applications");
  };

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="dropdown d-inline-block"
      tag="li"
    >
      <DropdownToggle
        className="btn header-item noti-icon"
        tag="button"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <i className={`bx bx-bell ${unreadCount ? "bx-tada" : ""}`} />
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-pill">{unreadCount}</span>
        )}
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">Notifications</h6>
            </Col>
            {unreadCount > 0 && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0"
                  onClick={() => dispatch(markAllNotificationsRead())}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </Row>
        </div>

        <SimpleBar style={{ maxHeight: "300px" }}>
          {items.length === 0 ? (
            <h6 className="text-center text-muted py-3">No notifications</h6>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => open(n)}
                className={`text-reset notification-item d-block w-100 text-start border-0 ${
                  n.read_at ? "bg-transparent" : "bg-light"
                }`}
              >
                <div className="d-flex p-3">
                  <i
                    className={`${
                      STATUS_ICONS[n.data?.status] || "bx bx-info-circle"
                    } font-size-20 me-3`}
                  />
                  <div className="flex-grow-1">
                    <h6 className={`mb-1 ${n.read_at ? "" : "fw-bold"}`}>
                      {n.data?.message}
                    </h6>
                    {n.data?.remarks && (
                      <p className="mb-1 font-size-12 text-muted">
                        Remarks: {n.data.remarks}
                      </p>
                    )}
                    <p className="mb-0 font-size-11 text-muted">
                      {n.created_at && new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </SimpleBar>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ClientNotificationDropdown;
