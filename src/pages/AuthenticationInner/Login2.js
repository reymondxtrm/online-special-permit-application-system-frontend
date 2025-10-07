import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../features/user/userSlice";

import { Link } from "react-router-dom";
import {
  Col,
  Container,
  Form,
  Row,
  Input,
  Label,
  FormFeedback,
  UncontrolledAlert,
  Spinner,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
import itsmLogo from "../../assets/images/itsm_logo_word.png";
import cictoLogo from "../../assets/images/itsm_logo.png";
import { Carousel } from "react-responsive-carousel";
import login from "store/auth/login/reducer";

const Login2 = (props) => {
  //meta title
  document.title = "BPLD Document Tracker";
  const dispatch = useDispatch();

  const loginStatus = useSelector((state) => state.user);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your User"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      console.log(loginStatus);
      dispatch(loginUser(values));
    },
  });
  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col xl={9}>
              <div className="auth-full-bg pt-lg-5 p-4">
                <div className="w-100">
                  <div className="bg-overlay"></div>
                  <div className="d-flex h-100 flex-column">
                    <div className="p-4 mt-auto">
                      <div className="row justify-content-center">
                        <div className="col-lg-12">
                          <div className="text-center">
                            <h4 className="mb-3">
                              <img
                                src={cictoLogo}
                                alt=""
                                height="40"
                                className="auth-logo-light"
                              />
                              <span className="text-primary">
                                Information Technology Service Management
                              </span>
                            </h4>
                            <div dir="ltr">
                              <div>
                                <div className="item">
                                  <div className="py-3">
                                    <p className="font-size-16 mb-4">
                                      Designed to provide functions,
                                      maintenance, and support of information
                                      technology devices, or services including
                                      but not limited to computer systems
                                      application development and maintenance;
                                      systems integration and interoperability;
                                      operating systems maintenance and design;
                                      computer systems programming; computer
                                      systems software support; planning and
                                      security relating to information
                                      technology devices; data management
                                      consultation; information technology
                                      education and consulting; information
                                      technology planning and standards; and
                                      establishment of local area network and
                                      workstation management standards.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img
                          src={itsmLogo}
                          alt=""
                          height="50"
                          className="auth-logo-dark"
                        />
                        <img
                          src={itsmLogo}
                          alt=""
                          height="50"
                          className="auth-logo-light"
                        />
                      </Link>
                    </div>
                    <div className="my-auto">
                      <div>
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p className="text-muted">Sign in to continue.</p>
                        {loginStatus.isError && !loginStatus.isFetching && (
                          <UncontrolledAlert
                            color="danger"
                            className="alert-dismissible fade show"
                            role="alert"
                          >
                            <i className="mdi mdi-block-helper me-2"></i>
                            {loginStatus.errorMessage}
                          </UncontrolledAlert>
                        )}
                      </div>

                      <div className="mt-4">
                        <Form
                          className="form-horizontal"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <div className="mb-3">
                            <Label className="form-label">Username</Label>
                            <Input
                              name="username"
                              className="form-control"
                              placeholder="Enter username"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.username || ""}
                              invalid={
                                validation.touched.username &&
                                validation.errors.username
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.username &&
                            validation.errors.username ? (
                              <FormFeedback type="invalid">
                                {validation.errors.username}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label className="form-label">Password</Label>
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type="password"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="auth-remember-check"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="auth-remember-check"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="mt-3 d-grid">
                            {!loginStatus.isFetching ? (
                              <button
                                className="btn btn-primary btn-block "
                                type="submit"
                              >
                                Log In
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-block "
                                disabled
                              >
                                <Spinner size="sm">Loading...</Spinner>
                                <span> Logging in...</span>
                              </button>
                            )}
                          </div>
                        </Form>

                        <div className="mt-5 text-center">
                          <p>
                            Don&apos;t have an account ?
                            <Link
                              to="register"
                              className="fw-medium text-primary"
                            >
                              Signup now
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © Powered by{" "}
                        <a
                          href="https://systems.butuan.gov.ph"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          City Information and Communications Technology Office
                        </a>
                        . All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login2;
