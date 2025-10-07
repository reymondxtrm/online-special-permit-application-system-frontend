import React from 'react'

const NotificationMessageNewRequest = ({ props }) => {
  return (
    <div>
      New Service Request <br />
      <i style={{ fontSize: '10px' }}>Requested by: {props && (
        props.tbl_users.first_name + ' ' + (props.tbl_users.middle_name ? (props.tbl_users.middle_name.charAt(0) + '. ') : '') + props.tbl_users.last_name + (props.tbl_users.suffix ? ', ' + props.tbl_users.suffix : '')
      )}</i><br />
      <i style={{ fontSize: '10px' }}>Office: {props && props.tbl_users.offices.office_description}</i>
    </div>
  )
}

export default NotificationMessageNewRequest