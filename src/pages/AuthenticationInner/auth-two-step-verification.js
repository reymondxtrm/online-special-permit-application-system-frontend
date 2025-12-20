import React, { useState } from "react";

//Verification code package
import AuthCode from "react-auth-code-input";
import cgbLogo from "../../assets/images/cgbLogo.png";

import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
  Spinner,
} from "reactstrap";

// import images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "features/user/userSlice";
import axios from "axios";
import Swal from "sweetalert2";
const TwostepVerification = (props) => {
  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  document.title =
    "Two Step Verification | Skote - React Admin & Dashboard Template";
  const clickSubmitHandle = () => {
    dispatch(
      sendOtp({ data: { otp: otp, email: email }, history: props.history })
    );
  };
  const resendHandle = async () => {
    try {
      Swal.fire({
        title: "Resending your OTP...",
        // text: "Please wait a moment",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios({
        url: "api/login/resend-otp",
        method: "POST",
        params: { email },
      });

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: `An OTP has been sent to your email: ${email}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send OTP",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5 text-muted">
                <Link to="/home" className="d-block auth-logo">
                  <img
                    src={cgbLogo}
                    alt=""
                    height="250"
                    className="auth-logo-dark mx-auto"
                  />
                </Link>
                <p
                  className="mt-3"
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  ONLINE SPECIAL PERMIT APPLICATION SYSTEMS
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12} lg={12} xl={7}>
              <Card style={{ width: "100%" }}>
                <CardBody>
                  <div className="p-2">
                    <div className="text-center">
                      <div className="avatar-md mx-auto">
                        <div className="avatar-title rounded-circle bg-light">
                          <i className="mdi mdi-shield-check h1 mb-0 text-success"></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>Verify your OTP</h4>
                        <p>
                          We’ve sent a one-time password (OTP) to your email
                          address:
                          <span className="font-weight-semibold">{email}</span>
                        </p>

                        <Form>
                          {user?.errorMessage && (
                            <Row>
                              <Col>
                                <div
                                  style={{
                                    backgroundColor: "#c01e341c",
                                    width: "100%",
                                    height: "60px",
                                    borderRadius: "10px",
                                    border: "2px solid #c01e34fd",
                                    marginBottom: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <i
                                    className="mdi mdi-information-outline fs-2"
                                    style={{
                                      color: "#eb1834fd",
                                      margin: "5px",
                                    }}
                                  ></i>
                                  <p
                                    className="p-0 m-0"
                                    style={{ color: "#eb1834fd" }}
                                  >
                                    {user?.errorMessage}{" "}
                                    <Link
                                      to="/login"
                                      style={{
                                        textDecoration: "underline",
                                        color: "#1838ebfd",
                                      }}
                                    >
                                      back to login
                                    </Link>
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          )}
                          <Row>
                            <Col xs={12}>
                              <FormGroup className="verification">
                                <label
                                  htmlFor="digit1-input"
                                  className="sr-only"
                                >
                                  Dight 1
                                </label>
                                <AuthCode
                                  characters={6}
                                  className="form-control form-control-lg text-center"
                                  allowedCharacters="^[0-9]"
                                  inputStyle={{
                                    width: "76px",
                                    height: "42px",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    textAlign: "center",
                                    marginRight: "15px",
                                    border: "1px solid #ced4da",
                                    textTransform: "uppercase",
                                  }}
                                  onChange={(otp) => setOtp(otp)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>

                        <div className="mt-4">
                          {user?.isFetching ? (
                            <Button color="success" disabled>
                              <Spinner size="sm">Confirming......</Spinner>
                              <span> Confirming...</span>
                            </Button>
                          ) : (
                            <Link
                              to="dashboard"
                              className="btn btn-success w-md"
                              onClick={(e) => {
                                e.preventDefault();
                                clickSubmitHandle();
                              }}
                            >
                              Confirm
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Did&apos;t receive a code ?{" "}
                  <a
                    href="#"
                    className="fw-medium text-primary"
                    onClick={resendHandle}
                  >
                    {" "}
                    Resend{" "}
                  </a>{" "}
                </p>
                <p>© {new Date().getFullYear()} Powered by CBPLD</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default TwostepVerification;
