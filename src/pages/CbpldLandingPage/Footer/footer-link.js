import React from "react";
import { Row, Col } from "reactstrap";

//Import Images
import logolight from "../../../assets/images/logo-light.png";

const FooterLink = () => {
  return (
    <React.Fragment>
      <Row>
        <Col lg="6">
          <div>
            <p
              style={{
                color: "white",
                letterSpacing: ".2rem",
                fontWeight: "600",
                fontSize: "16pt",
              }}
            >
              BPLD
            </p>
          </div>

          <p className="mb-2">
            {new Date().getFullYear()} © Powered by Business Permits and
            Licenses Department. All rights reserved.
          </p>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FooterLink;
