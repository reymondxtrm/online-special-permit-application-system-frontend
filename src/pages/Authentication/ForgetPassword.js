import PropTypes from "prop-types";
import React from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Button,
  Spinner,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import cgbLogo from "../../assets/images/cgbLogo.png";
import { postForgetPassword, userSlice } from "features/user/userSlice";
import UserDetails from "components/Modals/UserDetails";

const ForgetPasswordPage = (props) => {
  //meta title
  document.title = "Forget Password | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      dispatch(userSlice.actions.clearForgetPasswordState());
      dispatch(postForgetPassword({ email: values.email }));
    },
  });

  const { forgetError, forgetSuccessMsg, isFetching } = useSelector(
    (state) => ({
      forgetError: state.user.forgetError,
      forgetSuccessMsg: state.user.forgetSuccessMsg,
      isFetching: state.user.forgetIsFetching,
    })
  );

  console.log("her", forgetError, "her", forgetSuccessMsg);
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div
                  className="bg-priamry bg-softbg-soft-primary"
                  style={{ backgroundColor: "#D4DBF9" }}
                >
                  <Row>
                    <Col xs={7}>
                      <div className="p-4">
                        <h5 className="text-primary">Forgot Password</h5>
                        <p className="text-primary">
                          Received your new password using email
                        </p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={cgbLogo}
                            alt="City Government of Butuan"
                            className="rounded-circle"
                            height="34"
                            style={{
                              height: "80px",
                              width: "80px",
                              objectFit: "cover",
                            }}
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          {isFetching && isFetching ? (
                            <Button color="primary" disabled>
                              <Spinner size="sm">Loading...</Spinner>
                              <span> Loading</span>
                            </Button>
                          ) : (
                            <button
                              className="btn btn-primary w-md "
                              type="submit"
                            >
                              Reset
                            </button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="/home" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>© {new Date().getFullYear()} City Goverment of Butuan</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
