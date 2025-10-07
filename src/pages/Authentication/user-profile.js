import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  CardTitle,
  Spinner,
  UncontrolledAlert,
  Table,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";
// when you dont want to include this page in the layout
// import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb2";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import profileImg from "../../assets/images/4565-removebg-preview.png";
import { updatePassword, userSlice } from "../../features/user/userSlice";
const UserProfile = (props) => {
  //meta title

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(userSlice.actions.clearState());
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Please Enter Your Old Password"),

      newPassword: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Must be atleast 8 characters"),

      confirmPassword: Yup.string()
        .required("Please Confirm Your Password")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: (values, { resetForm }) => {
      // return
      dispatch(updatePassword({ data: values, history: props.history }));
      resetForm();
    },
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Profile" breadcrumbItems={[]} />
          <Row>
            {userDetails.is_password_reset === 1 ? (
              <Alert color="danger">
                Please update your password to proceed.
              </Alert>
            ) : (
              ""
            )}

            <Col lg="5">
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Profile Information</p>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <Row>
                    <Col sm="4">
                      <div className="avatar-md profile-user-wid  d-flex align-items-center">
                        <img
                          src={avatar1}
                          alt=""
                          className="img-thumbnail rounded-circle"
                        />
                        <h5 className="font-size-15 ">{userDetails.name}</h5>
                      </div>

                      <p className="text-muted mb-0 text-truncate">
                        <b>{userDetails.role}</b>
                      </p>
                    </Col>

                    {/* <Col sm="8">
                      <div className="pt-4">
                        <Row>
                          <Col xs="12">
                            <h5 className="font-size-15">{userDetails.name}</h5>
                            <p className="text-muted mb-0">
                              {userDetails.position}
                            </p>
                          </Col>
                        </Row>
                        <div className="mt-4"></div>
                      </div>
                    </Col> */}
                  </Row>
                  {/* <p style={{ fontStyle: "italic" }}>
                    {userDetails.division?.division}
                  </p> */}
                  <Row className="mt-2">
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td className="fw-bold">EMAIL</td>
                          <td>{userDetails.username}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">BIRTHDAY</td>
                          <td>{userDetails.username}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">BIRTHPLACE</td>
                          <td>{userDetails.username}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">EDUCATIONAL ATTAINMENT</td>
                          <td>{userDetails.username}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">ADDRESS</td>
                          <td>{userDetails.username}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="7">
              <Card>
                <CardTitle>
                  <div className="bg-soft">
                    <Row>
                      <Col xs="7">
                        <div className="text-primary p-3">
                          <h5 className="text-primary"> Update Password</h5>
                          <p></p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardTitle>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="row mb-4">
                      <Label
                        htmlFor="horizontal-firstname-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Username
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="text"
                          className="form-control"
                          id="horizontal-firstname-Input"
                          value={userDetails.username}
                          disabled
                        />
                      </Col>
                    </div>

                    <div className="row mb-4">
                      <Label
                        htmlFor="horizontal-oldpassword-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Old Password
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="password"
                          className="form-control"
                          id="horizontal-oldpassword-Input"
                          placeholder="Enter Your Old Password"
                          name="oldPassword"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.oldPassword || ""}
                          invalid={
                            validation.touched.oldPassword &&
                            validation.errors.oldPassword
                              ? true
                              : false
                          }
                        />
                        {validation.touched.oldPassword &&
                        validation.errors.oldPassword ? (
                          <FormFeedback type="invalid">
                            {validation.errors.oldPassword}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </div>

                    <div className="row mb-4">
                      <Label
                        htmlFor="horizontal-newpassword-Input"
                        className="col-sm-3 col-form-label"
                      >
                        New Password
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="password"
                          className="form-control"
                          id="horizontal-newpassword-Input"
                          placeholder="Enter Your New Password"
                          name="newPassword"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.newPassword || ""}
                          invalid={
                            validation.touched.newPassword &&
                            validation.errors.newPassword
                              ? true
                              : false
                          }
                        />
                        {validation.touched.newPassword &&
                        validation.errors.newPassword ? (
                          <FormFeedback type="invalid">
                            {validation.errors.newPassword}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </div>

                    <div className="row mb-4">
                      <Label
                        htmlFor="horizontal-confirmpassword-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Confirm Password
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="password"
                          className="form-control"
                          id="horizontal-confirmpassword-Input"
                          placeholder="Confirm Your Password"
                          name="confirmPassword"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmPassword || ""}
                          invalid={
                            validation.touched.confirmPassword &&
                            validation.errors.confirmPassword
                              ? true
                              : false
                          }
                        />
                        {validation.touched.confirmPassword &&
                        validation.errors.confirmPassword ? (
                          <FormFeedback type="invalid">
                            {validation.errors.confirmPassword}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </div>

                    <div className="row justify-content-end">
                      <Col sm={9}>
                        <div>
                          {userDetails.updatePasswordSuccessMessage &&
                          !userDetails.isFetching ? (
                            <UncontrolledAlert
                              color="success"
                              className="alert-dismissible fade show"
                              role="alert"
                            >
                              <i className="mdi mdi-lock-check me-2"></i>
                              {userDetails.updatePasswordSuccessMessage}
                            </UncontrolledAlert>
                          ) : userDetails.updatePasswordError &&
                            !userDetails.isFetching ? (
                            <UncontrolledAlert
                              color="danger"
                              className="alert-dismissible fade show"
                              role="alert"
                            >
                              <i className="mdi mdi-lock-open-alert me-2"></i>
                              {userDetails.updatePasswordError}
                            </UncontrolledAlert>
                          ) : null}
                        </div>
                        <div>
                          {!userDetails.isFetching ? (
                            <Button
                              type="submit"
                              color="primary"
                              className="w-md"
                            >
                              Submit
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              color="primary"
                              className="w-md"
                              disabled
                            >
                              <Spinner size="sm">Loading...</Spinner>
                              <span> ...</span>
                            </Button>
                          )}
                        </div>
                      </Col>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
