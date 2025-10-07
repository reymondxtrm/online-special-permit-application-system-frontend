import React from 'react'

const NotificationMessageNewUser = ({props}) => {
  return (
    <div>
      New User Registration <br />
      <i style={{ fontSize: '10px' }}>Name: {props && (
        props.first_name + ' ' + (props.middle_name ? (props.middle_name.charAt(0) + '. ') : '') + props.last_name + (props.suffix ? ', ' + props.suffix : '')
      )}</i><br />
      <i style={{ fontSize: '10px' }}>Office: {props && props.offices.office_description}</i>
    </div>
  )
}

export default NotificationMessageNewUser