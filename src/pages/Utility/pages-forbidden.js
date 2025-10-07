import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Countdown
import Countdown from "react-countdown";

//Import Images
import logo from "../../assets/images/itsm_logo_word.png";
import maintanence from "../../assets/images/Forbidden-Page.png";

const PagesComingsoon = () => {
  //meta title
  document.title = "Forbidden";

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-white">
          <i className="fas fa-home h2" />
        </Link>
      </div>

      <div className="my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center">
                <Link to="/dashboard" className="d-block auth-logo">
                  <p
                    style={{
                      fontWeight: "bold",
                      letterSpacing: ".2rem",
                      fontSize: "18pt",
                      margin: "0",
                      // padding: "0",
                      paddingBottom: "20px",
                      color: "#368be0",
                    }}
                  >
                    {"CBPLD"}
                  </p>
                </Link>
                <Row className="justify-content-center mt-5">
                  <Col sm="4">
                    <div className="maintenance-img">
                      {/* <img
                        src={maintanence}
                        alt=""
                        className="img-fluid mx-auto d-block"
                      /> */}
                    </div>
                  </Col>
                </Row>
                <h4 className="mt-5">UNAUTHORIZED ACCESS</h4>
                <p className="text-muted">
                  This page is not accessible, please go back.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PagesComingsoon;
