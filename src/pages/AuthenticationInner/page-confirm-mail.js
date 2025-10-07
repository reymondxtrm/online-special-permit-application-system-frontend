import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import axios from "axios";
// import images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import cgbLogo from "../../assets/images/cgbLogo.png";

const ConfirmMail = () => {
  //meta title
  document.title = "Confirm Mail | Skote - React Admin & Dashboard Template";
  const history = useHistory();
  const [message, setMessage] = useState("Verifying your email...");
  const [isFetching, setIsFetching] = useState(false);
  const query = new URLSearchParams(location.search);
  const verificationUrl = decodeURIComponent(query.get("url"));
  const parts = verificationUrl?.split("/");
  const id = parts[parts?.length - 2];
  const hash = parts[parts?.length - 1].split("?")[0];

  useEffect(() => {
    setIsFetching(true);
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`api/email/verify/${id}/${hash}`, {
          withCredentials: true,
        });
        setMessage("✅ Email verified successfully!");
        setTimeout(() => history.push("/home"), 2000); // redirect to login after 2s
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        setMessage("❌ Verification link is invalid or expired.");
      }
    };

    if (verificationUrl) {
      verifyEmail();
    }
  }, [verificationUrl, history]);

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
                    alt=""
                    height="100"
                    className="auth-logo-dark mx-auto"
                  />
                  <img
                    src={cgbLogo}
                    alt=""
                    height="100"
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
                          <i className="bx bx-mail-send h1 mb-0 text-primary"></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <div className="mt-4">
                          {isFetching ? (
                            <Button color="primary" disabled>
                              <Spinner size="sm">Loading...</Spinner>
                              <span> Loading</span>
                            </Button>
                          ) : (
                            <Link to="/home" className="btn btn-success">
                              Back to Home
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
                  © {new Date().getFullYear()} OSPAS
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

export default ConfirmMail;
