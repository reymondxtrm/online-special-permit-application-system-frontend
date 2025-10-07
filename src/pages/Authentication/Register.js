import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  UncontrolledAlert,
  Spinner,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { userSlice } from "../../features/user/userSlice";
// action
import { signupUser } from "../../features/user/userSlice";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/itsm_logo.png";

import BasicInputField from "components/Forms/BasicInputField";
import Select2InputField from "components/Forms/select2InputField";
import FileUpload from "components/Forms/fileUpload";

const Register = (props) => {
  //meta title
  document.title = "BPLD Document Tracker";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userSlice.actions.clearState());
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      office: "",
      position: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      // middleName: Yup.string().required("Please Enter Your Middle Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      contactNumber: Yup.string().required("Please Enter Your Contact Number"),
      position: Yup.string().required("Please Enter Your Position"),
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Invalid Email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Must be atleast 8 characters"),
      confirmPassword: Yup.string()
        .required("Please Confirm Your Password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      office: Yup.object().shape({
        label: Yup.string().required("Please Enter Your Office"),
      }),
    }),
    onSubmit: (values) => {
      // return
      if (uploadError) {
        return;
      }
      if (selectedFiles.length === 0) {
        setSubmitError("Please upload proof of Identity");
        return;
      }
      values["uploadedID"] = selectedFiles;
      dispatch(signupUser({ data: values, history: props.history }));
    },
  });

  const signupStatus = useSelector((state) => state.user);
  const offices = useSelector((state) => state.office.offices);

  //**DROPZONE */
  const [submitError, setSubmitError] = useState(null);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState();

  return (
    <React.Fragment>
      {/* <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div> */}
      <div className="account-pages my-4 pt-sm-4">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={8} xl={8}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Register</h5>
                        <p>Register and wait to be verified, to access ITSM.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoImg}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        <BasicInputField
                          col={"4"}
                          label={"First Name"}
                          id={"firstName"}
                          placeholder={"Enter First Name"}
                          validation={validation}
                          type={"text"}
                        />
                        <BasicInputField
                          col={"3"}
                          label={"Middle Name"}
                          id={"middleName"}
                          placeholder={"Enter Middle Name"}
                          validation={validation}
                          type={"text"}
                        />
                        <BasicInputField
                          col={"3"}
                          label={"Last Name"}
                          id={"lastName"}
                          placeholder={"Enter Last Name"}
                          validation={validation}
                          type={"text"}
                        />
                        <BasicInputField
                          col={"2"}
                          label={"Suffix"}
                          id={"suffix"}
                          placeholder={""}
                          validation={validation}
                          type={"text"}
                        />
                      </Row>
                      <Row>
                        <BasicInputField
                          col={"6"}
                          label={"Contact Number"}
                          id={"contactNumber"}
                          placeholder={"Enter Contact Number"}
                          validation={validation}
                          type={"text"}
                        />
                        <BasicInputField
                          col={"6"}
                          label={"Position"}
                          id={"position"}
                          placeholder={"Enter Position"}
                          validation={validation}
                          type={"text"}
                        />
                      </Row>
                      <Row>
                        <BasicInputField
                          col={"12"}
                          label={"Email"}
                          id={"email"}
                          placeholder={"Enter Email"}
                          validation={validation}
                          type={"email"}
                        />
                      </Row>
                      <Row>
                        <Select2InputField
                          col={"12"}
                          label={"Office"}
                          id={"office"}
                          placeholder={"Select Office"}
                          validation={validation}
                          options={offices}
                          onChangeFunctions={(offices) => {
                            validation.setFieldValue("office", offices);
                          }}
                        />
                      </Row>
                      <Row>
                        <BasicInputField
                          col={"6"}
                          label={"Password"}
                          id={"password"}
                          placeholder={"Enter Password"}
                          validation={validation}
                          type={"password"}
                        />
                        <BasicInputField
                          col={"6"}
                          label={"Confirm Password"}
                          id={"confirmPassword"}
                          placeholder={"Confirm Password"}
                          validation={validation}
                          type={"password"}
                        />
                      </Row>
                      <Row>
                        <FileUpload
                          selectedFiles={selectedFiles}
                          uploadError={uploadError}
                          submitError={submitError}
                          setselectedFiles={setselectedFiles}
                          setUploadError={setUploadError}
                          setSubmitError={setSubmitError}
                          label={"Upload Proof of Identity"}
                        />
                      </Row>
                      <div className="mt-4">
                        <Row>
                          <Col md="2">
                            {!signupStatus.isFetching ? (
                              <button
                                className="btn btn-primary btn-block "
                                type="submit"
                              >
                                Register
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-block "
                                disabled
                              >
                                <Spinner size="sm">Loading...</Spinner>
                                <span> ...</span>
                              </button>
                            )}
                          </Col>
                          <Col md="10">
                            {signupStatus.isSignUpSuccess &&
                            !signupStatus.isFetching ? (
                              <UncontrolledAlert
                                color="success"
                                className="alert-dismissible fade show"
                                role="alert"
                              >
                                <i className="mdi mdi-account-check me-2"></i>
                                {signupStatus.SignUpSuccessMessage}
                              </UncontrolledAlert>
                            ) : signupStatus.isSignUpError &&
                              !signupStatus.isFetching ? (
                              <UncontrolledAlert
                                color="danger"
                                className="alert-dismissible fade show"
                                role="alert"
                              >
                                <i className="mdi mdi-account-cancel me-2"></i>
                                {signupStatus.errorMessage}
                              </UncontrolledAlert>
                            ) : null}
                          </Col>
                        </Row>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the ITSM{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
                    Login
                  </Link>{" "}
                </p>
                <p>
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
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
