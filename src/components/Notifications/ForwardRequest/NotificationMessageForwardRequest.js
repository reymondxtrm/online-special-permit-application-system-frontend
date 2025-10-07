import React from 'react'
import { Badge } from 'reactstrap';
const NotificationMessageForwardRequest = ({ props }) => {
  return (
    <div>
      Forwarded Service Request<br />
      <i style={{ fontSize: '10px' }}>
        Ticket Number: {props.ticket_number}
      </i><br />
      <i style={{ fontSize: '10px' }}>
        To: {props.divisions.division}
      </i>
    </div>
  )
}

export default NotificationMessageForwardRequest