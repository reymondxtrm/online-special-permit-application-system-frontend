import React from 'react'
import moment from "moment";
import { Badge } from "reactstrap";
import { useDispatch } from 'react-redux';
import { userModalSlice } from 'features/modal/userModalSlice';
import { notificationMarkAsRead } from 'features/notifications/userNotificationsSlice';
import axios from 'axios';
const NewUserSignup = ({ items, notificationID, date, readAt }) => {
  const dispatch = useDispatch()
  const getSpecificUserDetails = (id) => {
    dispatch(userModalSlice.actions.openModal())
    axios.post('api/admin/get-specific-user-details', {
      'id': id,
    }).then(res => {
      dispatch(userModalSlice.actions.setModalData(res.data))

    }, error => {
      console.log(error.response.data.message)
      if (error.response.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: error.response.data.message,
          showConfirmButton: true,
        }).then(function () {

        });
      }
      else if (error.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: error.response.data.message,
          showConfirmButton: true,
        }).then(function () {

        });
      }
      else {
        Swal.fire({
          icon: 'warning',
          title: 'Something went wrong, please try again',
          showConfirmButton: true,
        }).then(function () {

        });
      }

    })
    if (!readAt) {
      dispatch(notificationMarkAsRead({ 'data': notificationID }))
    }
  }
  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={() => { getSpecificUserDetails(items.data.content.id) }} className="text-reset notification-item">
        <div className="d-flex">
          <div className="avatar-xs me-3">
            <span className="avatar-title bg-warning rounded-circle font-size-16">
              <i className="bx bx bx-user" />
            </span>
          </div>
          <div className="flex-grow-1">
            <h6 className="mt-0 mb-1">
              New User Signup
            </h6>
            <div className="font-size-12 text-muted">
              <p className="mb-1">
                Name:<b> {items.data.content.first_name + ' ' + (items.data.content.middle_name ? (items.data.content.middle_name.charAt(0) + '. ') : '') + items.data.content.last_name + (items.data.content.suffix ? ', ' + items.data.content.suffix : '')}</b> <br />
                Status: <Badge color={items.data.content.status.color}>
                  {items.data.content.status.status_description}
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

export default NewUserSignup