import React from 'react'
import moment from "moment";
import { useDispatch } from 'react-redux';
import { requestModalSlice, getSpecificRequestDetails } from 'features/modal/requestModalSlice';
import { notificationMarkAsRead } from 'features/notifications/userNotificationsSlice';

const NewServiceRequest = ({ items, notificationID, date, readAt }) => {
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
              New Service Request
            </h6>
            <div className="font-size-12 text-muted">
              <p className="mb-1">
                Ticket Number:<b>{items.ticket_number}</b><br />
                Requested by: <b>{items.tbl_users.first_name + ' ' + (items.tbl_users.middle_name ? (items.tbl_users.middle_name.charAt(0) + '. ') : '') + items.tbl_users.last_name + (items.tbl_users.suffix ? ', ' + items.tbl_users.suffix : '')}</b>
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

export default NewServiceRequest