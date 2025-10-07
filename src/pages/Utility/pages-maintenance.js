import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
//Import Cards
import CardMaintenance from "./card-maintenance";

//Import Images
import maintenance from "../../assets/images/maintenance.svg";
import logoDPWH from "../../assets/images/itsm_logo_word.png";
const PagesMaintenance = () => {
  //meta title
  document.title = "Maintenance | BPLD Document Tracker";

  return (
    <React.Fragment>
      <section className="my-5 pt-sm-5">
        <Container>
          <Row>
            <Col xs="12" className="text-center">
              <div className="home-wrapper">
                <div className="mb-5">
                  <Link to="/dashboard" className="d-block auth-logo">
                    <img src={logoDPWH} alt="logo" height="50" />
                  </Link>
                </div>

                <Row className="justify-content-center">
                  <Col sm={4}>
                    <div className="maintenance-img">
                      <img
                        src={maintenance}
                        alt=""
                        className="img-fluid mx-auto d-block"
                      />
                    </div>
                  </Col>
                </Row>
                <h3 className="mt-5">Site is Under Maintenance</h3>
                <p style={{ marginBottom: "5px" }}>
                  Please check back in sometime.
                </p>
                <Row>
                  <Link to="/login" className="font-weight-bold text-primary">
                    Go to Login
                  </Link>
                </Row>

                <Row>
                  <CardMaintenance>
                    <i className="bx bx-broadcast mb-4 h1 text-primary" />
                    <h5 className="font-size-15 text-uppercase">
                      Why is the Site Down?
                    </h5>
                    <p className="text-muted mb-0">
                      The website is currently being fixed and upgraded.
                    </p>
                  </CardMaintenance>

                  <CardMaintenance>
                    <i className="bx bx-time-five mb-4 h1 text-primary" />
                    <h5 className="font-size-15 text-uppercase">
                      What is the Downtime?
                    </h5>
                    <p className="text-muted mb-0">
                      The server downtime is currently undetermined. Please bare
                      with us. Thank you.
                    </p>
                  </CardMaintenance>

                  <CardMaintenance>
                    <i className="bx bx-envelope mb-4 h1 text-primary" />
                    <h5 className="font-size-15 text-uppercase">
                      Do you need Support?
                    </h5>
                    <p className="text-muted mb-0">
                      If you concerns, please contact the developers.
                    </p>
                  </CardMaintenance>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default PagesMaintenance;
