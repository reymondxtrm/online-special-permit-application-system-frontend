import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserList, userListSlice } from 'features/user/userListSlice';
import UserVerificationTable from 'components/Tables/UserVerificationTable';
import { Container, Row, Col, Card, CardBody, CardHeader} from "reactstrap";
// Formik Validation
import { useFormik } from "formik";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb2";
import Pagination from 'components/Pagination';
import UserVerificationFilters from 'components/Filters/UserVerificationFilters';
const Verification = (props) => {
  const userList = useSelector((state) => state.userList)
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false)

  const setDataProps = (data) => {
    setIsLoading(true)
    dispatch(userListSlice.actions.setListState(data.data))
  }

  useEffect(() => {
    dispatch(getUserList({ 'history': props.history }))
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [userList.users])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: '',
      fullName: ''
    },

    onSubmit: (values) => {
      dispatch(getUserList({ 'history': props.history, 'filter': values }))
    }
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Verification"
            breadcrumbItems={[{ title: "User Management" }, { title: "User Controls" }, { title: "Verification" }]}
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <UserVerificationFilters
                    props={props}
                  />
                </CardHeader>
                <CardBody>
                  <UserVerificationTable
                    userList={userList}
                    isLoading={isLoading}
                  />
                  <span>
                    <Pagination dataProps={userList.users} setDataProps={setDataProps} setShowLoading={setIsLoading} isLoading={userList.isFetching || isLoading ? true : false} params={validation.values} />
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* <UserDetails modal={userModal.modal} setModal={setModal} toggle={toggle} modalData={modalData} setModalData={setModalData} history={props.history} params={validation.values}/> */}
      </div>
    </React.Fragment>
  )
}

export default Verification