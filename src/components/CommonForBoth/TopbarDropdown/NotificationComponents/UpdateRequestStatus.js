import React from 'react'
import moment from "moment";
import { Badge } from "reactstrap";
import { useDispatch } from 'react-redux';
import { requestModalSlice, getSpecificRequestDetails } from 'features/modal/requestModalSlice';
import { notificationMarkAsRead } from 'features/notifications/userNotificationsSlice';
const UpdateRequestStatus = ({ items, notificationID, date, readAt }) => {
  const dispatch = useDispatch()
  const getRequestDetails = (id) => {
    dispatch(getSpecificRequestDetails({ 'data': id }))
    dispatch(requestModalSlice.actions.openModal())
    if (!readAt) {
      dispatch(notificationMarkAsRead({ 'data': notificationID }))
    }
  }
  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={() => { getRequestDetails(items.request_details_id) }} className="text-reset notification-item">
        <div className="d-flex">
          <div className="avatar-xs me-3">
            <span className="avatar-title bg-info rounded-circle font-size-16">
              <i className="bx bx-info-circle" />
            </span>
          </div>
          <div className="flex-grow-1">
            <h6 className="mt-0 mb-1">
              Updated Status
            </h6>
            <div className="font-size-12 text-muted">
              <p className="mb-1">
                Ticket Number: <b> {items.ticket_number}</b> <br />
                Status: <Badge color={items.status.color}>
                  {items.status.status_description}
                </Badge>
              </p>
              <p className="mb-0">
                <i className="mdi mdi-clock-outline" />{" "}
                {moment(date).fromNow()}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateRequestStatus