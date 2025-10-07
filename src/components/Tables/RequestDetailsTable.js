import React from 'react'
import TableLoaders from 'components/Loaders/TableLoaders'
import { Table, Badge, Button } from "reactstrap";
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { requestModalSlice } from 'features/modal/requestModalSlice';
import { getSpecificRequestDetails } from 'features/modal/requestModalSlice';
const RequestDetailsTable = ({
  requestData,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const toggle = (data) => {
    dispatch(getSpecificRequestDetails({ 'data': data.request_details_id }))
    dispatch(requestModalSlice.actions.openModal())
  };
  return (
    <>
      <Table
        hover
        responsive>
        <thead>
          <tr>
            <th style={{
              width: '20%'
            }}>
              Ticket Number
            </th>
            <th style={{
              width: '40%'
            }}>
              Request Type
            </th>
            <th style={{
              width: '20%'
            }}>
              Date Requested
            </th>
            <th style={{
              width: '10%'
            }}>
              Status
            </th>
            <th style={{
              width: '10%',
              textAlign: "center"
            }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {
            requestData.isFetching || isLoading ? (
              <TableLoaders
                row={5}
                col={10}
              />
            ) : (
              requestData.requestList.data && (
                requestData.requestList.data.length === 0 ? (
                  <tr >
                    <td colSpan={5} style={{
                      textAlign: "center"
                    }}>
                      No record found
                    </td>
                  </tr>
                ) : (
                  requestData.requestList.data.map((request, index) => {
                    return (
                      <tr key={request.ticket_number}>
                        <td>
                          {request.ticket_number}
                        </td>
                        <td>
                          {request.service_request?.service_request_description}<br/>
                          <i>
                            ({request.divisions?.division})

                          </i>
                        </td>
                        <td>
                          {moment(request.created_at).format('MMMM D, YYYY')}
                        </td>
                        <td>
                          {
                            <Badge color={request.status?.color}>
                              {request.status?.status_description}
                            </Badge>
                          }
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => { toggle(request) }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )
              )
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default RequestDetailsTable