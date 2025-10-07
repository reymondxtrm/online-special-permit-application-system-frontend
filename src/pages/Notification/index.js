import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useFormik } from "formik";
import Breadcrumbs from 'components/Common/Breadcrumb';
import Pagination from 'components/Pagination';
import NotificationsTable from 'components/Tables/NotificationsTable';
import { userNotificationsSlice, getAllUserNotifications } from 'features/notifications/userNotificationsSlice';
import { notificationSlice } from 'features/filters/notificationSlice';
import NotificationFilters from 'components/Filters/NotificationFilters';
const NotificationsPage = (props) => {
  const requestData = useSelector((state) => state.userNotifications)
  const notificationParams = useSelector((state) => state.notificationFilter.params)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();
  // const [modalData, setModalData] = useState()

  const setDataProps = (data) => {
    setIsLoading(true)
    dispatch(userNotificationsSlice.actions.setListState(data.data))
  }
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      notificationStatus: { 'label': 'ALL', 'value': 10 },
      notificationDetails: ""
    },

    onSubmit: (values) => {
      dispatch(getAllUserNotifications({
        'history': props.history,
        'filter': values
      }))
      dispatch(notificationSlice.actions.setParams(values))

    }
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title=""
            breadcrumbItem="Notifications"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <NotificationFilters
                    props={props}
                    validation={validation}
                  />
                </CardHeader>
                <CardBody>
                  <NotificationsTable
                    userNotifications={requestData}
                    isLoading={isLoading}
                    props={props}
                  />
                  {
                    requestData.allNotifications.data && (
                      <span>
                        <Pagination
                          dataProps={requestData.allNotifications}
                          setDataProps={setDataProps}
                          setShowLoading={setIsLoading}
                          isLoading={requestData.isFetching
                            ||
                            isLoading
                            ?
                            true
                            :
                            false}
                          params={validation.values}
                        />
                      </span>
                    )
                  }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default NotificationsPage