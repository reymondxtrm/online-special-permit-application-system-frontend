import React from 'react'
import { Table, Badge } from 'reactstrap';
import moment from 'moment';
const RequestHistoryModalTable = ({
  modalData
}) => {
  return (
    <div style={{height:'70vh'}} className="tableFixHead" >
      <Table className="table mb-0">
        <thead>
          <tr>
            <th style={{
              width: '20%'
            }}>
              Status
            </th>

            <th style={{
              width: '35%'
            }}>
              Date
            </th>

            <th style={{
              width: '50%'
            }}>
              Action/Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {
            modalData.request_history.map((history) => (

              <tr key={history.request_history_id + 'history'}>
                <td>
                  {
                    <Badge color={history.status?.color}>
                      {history.status?.status_description}
                    </Badge>
                  }
                </td>
                <td>
                  {
                    <Badge>
                      {moment(history.created_at).format('MMMM D, YYYY h:mm a')}
                    </Badge>

                  }
                </td>
                <td style={{ whiteSpace: 'pre-line' }}>
                  {
                    history.action
                  }
                </td>
              </tr>

            ))
          }
        </tbody>
      </Table>
    </div>
  )
}

export default RequestHistoryModalTable