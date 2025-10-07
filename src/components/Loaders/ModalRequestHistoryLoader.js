import React from 'react'
import { Table } from 'reactstrap';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const ModalRequestHistoryLoader = () => {
  return (
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


        <tr>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>


      </tbody>
    </Table>
  )
}

export default ModalRequestHistoryLoader