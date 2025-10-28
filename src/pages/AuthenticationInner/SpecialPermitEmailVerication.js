import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from "axios";

import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import cgbLogo from "../../assets/images/cgbLogo.png";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SpecialPermitEmailVerication = (props) => {
  document.title = "Email Verification";
  const history = useHistory();
  const user = useSelector((state) => state.user);

  const resendVerificationEmail = async () => {
    try {
      Swal.fire({
        title: "Sending verification email...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await axios.post("/api/email/resend", {
        email: email,
      });

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: response.data.message,
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonText: "OK",
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
                <Link to="dashboard" className="d-block auth-logo">
                  <img
                    src={cgbLogo}
                    alt="City Goverment of Butuan"
                    height="200"
                    className="auth-logo-dark mx-auto"
                  />
                  <img
                    src={cgbLogo}
                    alt="City Goverment of Butuan"
                    height="50"
                    className="auth-logo-light mx-auto"
                  />
                </Link>
                <p className="mt-3 fw-bold">
                  SPECIAL PERMIT APPLICATION SYSTEMS
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <CardBody>
                  <div className="p-2">
                    <div className="text-center">
                      <div className="avatar-md mx-auto">
                        <div className="avatar-title rounded-circle bg-light">
                          <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>Verify your email</h4>
                        <p>
                          We have sent you verification email, Please check it
                        </p>
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() => history.push("/home")}
                        >
                          Go to Login
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Did&apos;t receive an email ?{" "}
                  <a
                    href="#"
                    className="fw-medium text-primary"
                    onClick={() => resendVerificationEmail()}
                  >
                    {" "}
                    Resend{" "}
                  </a>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} BPLD
                  {/* <i className="mdi mdi-heart text-danger"></i> by Themesbrand */}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default SpecialPermitEmailVerication;
