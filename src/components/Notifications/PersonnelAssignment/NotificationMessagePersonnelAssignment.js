import React from 'react'

const NotificationMessagePersonnelAssignment = ({props}) => {
  return (
    <div>
      Personnel Assigned <br />
      <i style={{ fontSize: '10px' }}>
        Ticket Number: {props.ticket_number}
      </i><br />
      <i style={{ fontSize: '10px' }}>
        Division: {props.divisions.division}
      </i>
    </div>
  )
}

export default NotificationMessagePersonnelAssignment