import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from "formik";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from 'components/Common/Breadcrumb';
import Pagination from 'components/Pagination';
import { getRequestDetailsList, requestDetailsSlice } from 'features/request/requestDetailsSlice';
import { requestedServiceSlice } from 'features/filters/requestedServiceSlice';
import RequestDetailsTable from 'components/Tables/RequestDetailsTable';
import RequestFilter from 'components/Filters/RequestFilter';
const RequestedServices = (props) => {
  const requestData = useSelector((state) => state.requestDetails)
  const requestParams = useSelector((state) => state.requestFilter.params)
  const [isLoading, setIsLoading] = useState(false)



  const dispatch = useDispatch();
  // const [modalData, setModalData] = useState()
  useEffect(() => {
    requestParams && (
      dispatch(getRequestDetailsList({ 'history': props.history, 'filter': requestParams }))
    )
  }, [requestParams])

  const setDataProps = (data) => {
    setIsLoading(true)
    dispatch(requestDetailsSlice.actions.setListState(data.data))
  }
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      requestStatus: requestParams.requestStatus,
      requestDetails: requestParams.requestDetails
    },

    onSubmit: (values) => {
      // dispatch(getUserList({ 'history': props.history, 'filter': values }))
      dispatch(requestedServiceSlice.actions.setParams(values))
      dispatch(getRequestDetailsList({ 'history': props.history, 'filter': values }))
    }
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Components"
            breadcrumbItem="Requested Services"
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

export default RequestedServices