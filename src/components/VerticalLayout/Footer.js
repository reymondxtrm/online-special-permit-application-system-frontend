import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={8}>Powered by BPLD. All rights reserved.</Col>
            <Col md={4}>
              <div className="text-sm-end d-none d-sm-block">
                <b>Version</b> 2.0
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
