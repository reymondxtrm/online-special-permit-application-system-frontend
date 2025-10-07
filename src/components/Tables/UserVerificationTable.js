import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Table, Badge, Button } from "reactstrap";
import TableLoaders from 'components/Loaders/TableLoaders';
import { userModalSlice } from 'features/modal/userModalSlice';
const UserVerificationTable = ({
  userList,
  isLoading,
  props
}) => {
  const dispatch = useDispatch()
  const setModalData = (data) => {
    dispatch(userModalSlice.actions.setModalData(data))
  }
  const toggle = (data) => {
    setModalData(data)
    dispatch(userModalSlice.actions.toggleModal())
  };
  return (
    <>
      <Table hover responsive>
        <thead>
          <tr>
            <th style={{
              width: '30%'
            }}>
              Full Name
            </th>
            <th style={{
              width: '40%'
            }}>
              Office
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
            userList.isFetching || isLoading ? (
              <TableLoaders
                row={4}
                col={10}
              />
            ) : (
              userList.users.data && (

                userList.users.data.length === 0 ? (
                  <tr >
                    <td colSpan={4} style={{
                      textAlign: "center"
                    }}>
                      No record found
                    </td>
                  </tr>
                ) : (
                  userList.users.data.map((items, index) => {
                    return (
                      <tr key={items.id}>
                        <td>
                          {items.first_name + ' ' + (items.middle_name ? (items.middle_name.charAt(0) + '. ') : '') + items.last_name + (items.suffix ? ', ' + items.suffix : '')}
                        </td>
                        <td>
                          {items.offices.office_description}
                        </td>
                        <td>
                          {
                            items.status_id === 1 ? (
                              <Badge color="success">
                                Approved
                              </Badge>
                            ) : items.status_id === 2 ? (
                              <Badge color="danger">
                                Disapproved
                              </Badge>
                            ) : items.status_id === 3 ? (
                              <Badge color="warning">
                                Pending
                              </Badge>
                            ) : ''
                          }

                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => { toggle(items) }}
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

export default UserVerificationTable