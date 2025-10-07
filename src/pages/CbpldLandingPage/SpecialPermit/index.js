import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  UncontrolledAlert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import bg from "../../../assets/images/cgb-bg.jpg";
import LoginModal from "../Modals/LoginModal";
import SignupModal from "../Modals/SignupModal";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import { loginUser } from "../../../features/user/userSlice";
import { userSlice } from "../../../features/user/userSlice";

import { useHistory } from "react-router-dom";
function SpecialPermit({ props }) {
  const [loginModalState, setloginModalState] = useState(false);
  const [signupModalState, setsignupModalState] = useState(false);
  const [selectAccountTypeModal, setselectAccountTypeModal] = useState(false);

  const toggleAccountTypeModal = () => {
    setselectAccountTypeModal(!selectAccountTypeModal);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userSlice.actions.clearState());
  }, []);
  const loginStatus = useSelector((state) => state.user);

  const formikRef = useRef(null);
  const handleSubmit = useSubmit();
  const history = useHistory(); // Initialize useHistory
  const toggleLoginModal = () => {
    setloginModalState(!loginModalState);
  };

  const toggleSignUp = () => {
    setsignupModalState(!signupModalState);
  };
  const handleForgotPassword = () => {
    props.history.push("/forgot-password");
  };
  return (
    <React.Fragment>
      {/* <Modal
        isOpen={selectAccountTypeModal}
        toggle={toggleAccountTypeModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{
          // minHeight: "70vh",
          overflowY: "auto",
          // maxWidth: "1400px",
        }}
        unmountOnClose
      >
        <ModalHeader toggle={toggleAccountTypeModal}>
          <p
            style={{
              fontWeight: "bold",
              letterSpacing: ".2rem",
              fontSize: "18pt",
              margin: "0",
              padding: "0",
              color: "#368be0",
            }}
          >
            {"CHOOSE ACCOUNT TYPE"}
          </p>
        </ModalHeader>

        <ModalBody style={{ overflowX: "auto", minHeight: "10vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Button
              style={{
                backgroundColor: "#1a56db",
                fontWeight: "600",
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                color: "white",
                borderRadius: "10px",
              }}
            >
              INDIVIDUAL
            </Button>
            <Button
              style={{
                backgroundColor: "#1a56db",
                fontWeight: "600",
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                color: "white",
                borderRadius: "10px",
              }}
            >
              CORPORATION
            </Button>
          </div>
        </ModalBody>
      </Modal> */}
      <LoginModal
        openModal={loginModalState}
        toggleModal={toggleLoginModal}
        toggleSignUp={toggleSignUp}
      />
      <SignupModal
        openModal={signupModalState}
        toggleModal={toggleSignUp}
        props={props}
      />
      <section
        className="section hero-section bg-ico-hero"
        style={styles.section}
      >
        {/* <div className="bg-overlay bg-primary" /> */}
        <Container>
          <Row className="align-items-center">
            <Col md={5}>
              <Card
                style={{
                  borderRadius: "10px",
                  boxShadow: "10px 10px 30px ",
                  height: "auto",
                }}
              >
                <CardBody>
                  <p
                    style={{
                      fontWeight: "bold",
                      letterSpacing: ".2rem",
                      fontSize: "18pt",
                      margin: "0",

                      paddingBottom: "20px",
                      color: "#368be0",
                    }}
                  >
                    {"LOGIN"}
                  </p>
                  <Formik
                    innerRef={formikRef}
                    initialValues={{
                      username: "",
                      password: "",
                    }}
                    onSubmit={(values) => {
                      // console.log(values);
                      dispatch(
                        loginUser({ data: values, history: props.history })
                      );
                    }}
                  >
                    {(props) => (
                      <Form>
                        <Row>
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
                          <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                              id="username"
                              name={`username`}
                              placeholder="Username"
                              onChange={props.handleChange}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              name={`password`}
                              placeholder="Password"
                              onChange={props.handleChange}
                            />
                          </FormGroup>
                        </Row>
                        <Row>
                          <div className="text-end">
                            <p
                              style={{
                                color: "#368be0",
                                cursor: "pointer",
                                paddingLeft: "5px",
                                margin: 0,
                                paddingTop: "0px",
                                // fontWeight: "bold",
                                marginRight: "15px",
                              }}
                              onClick={() => handleForgotPassword()}
                            >
                              Forgot Password?
                            </p>
                          </div>
                        </Row>
                        <Row
                          style={{
                            paddingRight: "10px",
                            paddingLeft: "10px",
                            paddingTop: "10px",
                          }}
                        >
                          <div className="mt-3 d-grid">
                            {!loginStatus.isFetching ? (
                              <Button
                                style={{
                                  backgroundColor: "#1a56db",
                                  fontWeight: "600",
                                  fontFamily:
                                    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                                  color: "white",
                                }}
                                onClick={() => formikRef.current.handleSubmit()}
                              >
                                Sign in
                              </Button>
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
                        </Row>
                        <Row>
                          <div className="mt-3 text-center">
                            <p>
                              Don&apos;t have an account ?
                              <span
                                style={{
                                  color: "#368be0",
                                  cursor: "pointer",
                                  paddingLeft: "5px",
                                }}
                                onClick={() => {
                                  // toggleAccountTypeModal();
                                  toggleSignUp();
                                }}
                              >
                                Signup now
                              </span>
                            </p>
                          </div>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
            <Col md={2}></Col>
            <Col lg="5">
              <div className="text-black-50">
                <h1 className="text-black font-weight-semibold mb-3 hero-title">
                  SPECIAL PERMIT
                </h1>
                <p
                  className="font-size-16"
                  style={{ color: "black", textAlign: "justify" }}
                >
                  A special permit is an authorization granted by a government
                  or regulatory authority allowing an individual or organization
                  to engage in activities that are otherwise restricted or
                  regulated.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
}

// Styles object
const styles = {
  section: {
    backgroundPosition: "100%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${bg})`,
    backgroundSize: "100%",
  },
  card: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#0d6dfc",
    color: "white",
    fontWeight: "bold",
    letterSpacing: ".2rem",
    minHeight: "60px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#144071",
  },
};

export default SpecialPermit;
