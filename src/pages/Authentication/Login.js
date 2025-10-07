import React, { useEffect } from "react";
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
import { userSlice } from "../../features/user/userSlice";
import BasicInputField from "components/Forms/BasicInputField";
// import images
import itsmLogo from "../../assets/images/itsm_logo_word.png";

import CarouselPage from "./CarouselPage";

const Login = (props) => {
  //meta title
  document.title = "BPLD Document Tracker";
  const dispatch = useDispatch();
  // console.log(props);
  useEffect(() => {
    dispatch(userSlice.actions.clearState());
  }, []);
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
      dispatch(loginUser({ data: values, history: props.history }));
    },
  });
  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <CarouselPage />
            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <h3>
                        <span className="text-primary">DOCUMENT TRACKER</span>
                      </h3>
                    </div>
                    <div className="my-auto">
                      <div>
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p className="text-muted">Sign in to continue.</p>
                        {loginStatus.isLoginError && !loginStatus.isFetching && (
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
                          <BasicInputField
                            col={"12"}
                            label={"Username"}
                            name={"username"}
                            placeholder={"Enter username"}
                            validation={validation}
                            type={"text"}
                            value={validation.values.username}
                          />
                          <BasicInputField
                            col={"12"}
                            label={"Password"}
                            name={"password"}
                            placeholder={"Enter Password"}
                            validation={validation}
                            type={"password"}
                            value={validation.values.password}
                          />
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
                              {" "}
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
                          Business Permits and Licenses Department
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

export default Login;
