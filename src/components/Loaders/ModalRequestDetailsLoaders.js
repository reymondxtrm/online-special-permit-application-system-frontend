import React from 'react'
import { Table } from 'reactstrap';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const ModalRequestDetailsLoaders = () => {
  return (
    <Table className="table mb-0">
      <tbody>
        <tr>
          <th scope="row">Date & Time Requested:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Current Status:</th>
          <td>
            <Skeleton width={200} />
          </td>
        </tr>
        <tr>
          <th scope="row">Assigned Division:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Assigned Personnel(s):</th>
          <td><Skeleton width={200} /></td>
        </tr>

        <tr>
          <th scope="row">Requestor:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Office:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Request Type:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Service Requested:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr style={{ whiteSpace: 'pre-line' }}>
          <th scope="row">Request Description:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Level:</th>
          <td><Skeleton width={200} /></td>
        </tr>
        <tr>
          <th scope="row">Attached Screenshots:</th>
          <td>
            <Skeleton width={200} />

          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default ModalRequestDetailsLoaders