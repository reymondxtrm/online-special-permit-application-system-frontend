import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "reactstrap";

const CedulaApplicationForm = () => {
  return (
    <Row>
      <Col>
        <Card>
          <CardHeader>
            <p
              style={{
                fontWeight: "bold",
                letterSpacing: ".2rem",
                fontSize: "18pt",
                margin: 0,
                padding: 0,
                color: "#368be0",
              }}
            >
              Cedula Application Forms
            </p>
          </CardHeader>
          <CardBody>
            <div className="form-container">
              <div className="form-header">
                <div>
                  <img />
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div>
              <Button color="primary">Print</Button>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};
export default CedulaApplicationForm;
