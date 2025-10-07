import React from 'react'
import { Badge } from 'reactstrap';
const NotificationMessageUpdateRequest = ({ props }) => {
  return (
    <div>
      Updated Service Request Status<br />
      <i style={{ fontSize: '10px' }}>Ticket Number: {props.ticket_number}</i><br />
      <i style={{ fontSize: '10px' }}>Status: <Badge color={props.status.color}>
        {props.status.status_description}
      </Badge></i>
    </div>
  )
}

export default NotificationMessageUpdateRequest