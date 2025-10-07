import React from 'react'
import TableLoaders from 'components/Loaders/TableLoaders'
import { Table, Badge, Button } from "reactstrap";
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { requestModalSlice } from 'features/modal/requestModalSlice';
import { getSpecificRequestDetails } from 'features/modal/requestModalSlice';
import NewUserSignup from 'components/CommonForBoth/TopbarDropdown/NotificationComponents/NewUserSignup';
import NewServiceRequest from 'components/CommonForBoth/TopbarDropdown/NotificationComponents/NewServiceRequest';
import UpdateRequestStatus from 'components/CommonForBoth/TopbarDropdown/NotificationComponents/UpdateRequestStatus';
import ForwardServiceRequest from 'components/CommonForBoth/TopbarDropdown/NotificationComponents/ForwardServiceRequest';
import PersonnelAssignment from 'components/CommonForBoth/TopbarDropdown/NotificationComponents/PersonnelAssignment';
import SimpleBar from "simplebar-react";
const NotificationsTable = ({
  userNotifications,
  isLoading,
}) => {
  return (
    <>
      <Table hover responsive>
        <thead>
          <tr>
            <th style={{
              width: '40%'
            }}>
              Notification Details
            </th>
            <th style={{
              width: '20%'
            }}>
              Status
            </th>

          </tr>
        </thead>
        <tbody>
          {
            userNotifications.isFetching || isLoading ? (
              <TableLoaders
                row={2}
                col={10}
              />
            ) : (
              userNotifications.allNotifications?.data?.length !== 0 ? (
                userNotifications.allNotifications?.data?.map((items) => (
                  <tr key={items.id}>
                    <td>
                      {
                        items.data.type === 'New User' ? (
                          <NewUserSignup items={items} notificationID={items.id} date={items.created_at} readAt={items.read_at} />
                        ) : items.data.type === 'New Service Request' ? (
                          <NewServiceRequest items={items.data.content} notificationID={items.id} date={items.created_at} readAt={items.read_at} />
                        ) : items.data.type === 'Update Service Request' ? (
                          <UpdateRequestStatus items={items.data.content} notificationID={items.id} date={items.created_at} readAt={items.read_at} />
                        ) : items.data.type === 'Forward Service Request' ? (
                          <ForwardServiceRequest items={items.data.content} notificationID={items.id} date={items.created_at} readAt={items.read_at} />
                        ) : items.data.type === 'Personnel Assignment' ? (
                          <PersonnelAssignment items={items.data.content} notificationID={items.id} date={items.created_at} readAt={items.read_at} />
                        ) : (
                          <>
                          </>
                        )
                      }
                    </td>
                    <td>
                      {
                        items.read_at ? (
                          <>
                            Viewed on <Badge>
                              {moment(items.read_at).format('MMMM D, YYYY h:mm a')}
                            </Badge>
                          </>
                        ) : (
                          <>
                            Unread
                          </>
                        )
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ textAlign: 'center' }}>
                  <td colSpan="2">
                    No new notification
                  </td>
                </tr>
              )
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default NotificationsTable