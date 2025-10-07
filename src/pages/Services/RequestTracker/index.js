import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from "formik";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from 'components/Common/Breadcrumb';
import Pagination from 'components/Pagination';
import { getRequestDetailsList, requestDetailsSlice } from 'features/request/requestDetailsSlice';
import RequestDetailsTable from 'components/Tables/RequestDetailsTable';
import RequestFilter from 'components/Filters/RequestFilter';
const RequestTracker = (props) => {
  const dispatch = useDispatch();
  const requestData = useSelector((state) => state.requestDetails)
  const [isLoading, setIsLoading] = useState(false)

  const setDataProps = (data) => {
    setIsLoading(true)
    dispatch(requestDetailsSlice.actions.setListState(data.data))
  }
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      requestStatus: { 'label': 'OPEN', 'value': 4 },
      requestDetails: ''
    },

    onSubmit: (values) => {
      dispatch(getRequestDetailsList({ 'history': props.history, 'filter': values }))
    }
  });
  useEffect(() => {
    dispatch(getRequestDetailsList({ 'history': props.history, 'filter': validation.values }))
  }, [])
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Services"
            breadcrumbItem="Request Tracker"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <RequestFilter
                    validation={validation}
                  />
                </CardHeader>
                <CardBody>
                  <RequestDetailsTable
                    requestData={requestData}
                    isLoading={isLoading}
                    props={props}
                    validation={validation}
                  />
                  <span>
                    <Pagination
                      dataProps={requestData.requestList}
                      setDataProps={setDataProps}
                      setShowLoading={setIsLoading}
                      isLoading={requestData.isFetching
                        ||
                        isLoading
                        ?
                        true
                        :
                        false}
                      params={validation.values} />
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default RequestTracker