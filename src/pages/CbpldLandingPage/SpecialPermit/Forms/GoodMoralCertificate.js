import { FieldArray, Formik } from "formik";
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  FormText,
} from "reactstrap";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
function GoodMoralCertificate() {
  return (
    <React.Fragment>
      <Formik
        initialValues={{ name: "jared" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Form>
            <Row>
              <Col
                md={8}
                style={{ borderRight: "2px solid", borderColor: "#f0f3f7" }}
              >
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="exampleEmail">Purpose</Label>
                      <Select
                        isMulti
                        isClearable={true}
                        // name={`ppaDetails.${index}.sector`}
                        placeholder="Select Purpose"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="nameOfEmployer">Name of Employer</Label>
                      <Input
                        id="nameOfEmployer"
                        name="nameOfEmployer"
                        placeholder="Enter Name of Employer"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress">Surname</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Enter Surname"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress">First Name</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Enter First Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Label for="exampleAddress">M.I</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="M.I"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={1}>
                    <FormGroup>
                      <Label for="exampleAddress">Suffix</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Ext"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={2}>
                    <FormGroup>
                      <Label for="exampleAddress">SEX</Label>
                      <Select isMulti isClearable={true} placeholder="SEX" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Email Address</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Email Address"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Contact No.</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Contact No."
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Date</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Date"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="province">Province</Label>
                      <Select
                        isMulti
                        isClearable={true}
                        placeholder="Select Province"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="province">City</Label>
                      <Select
                        isMulti
                        isClearable={true}
                        placeholder="Select City"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="province">Barangay</Label>
                      <Select
                        isMulti
                        isClearable={true}
                        placeholder="Select Barangay"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="additionalAddress">Additional Address</Label>
                      <Input
                        id="additionalAddress"
                        name="address"
                        placeholder="Enter Additional Address"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">Police Clearance</Label>
                      <Input id="exampleFile" name="file" type="file" />
                      {/* <FormText>
                        This is some placeholder block-level help text for the
                        above input. It‘s a bit lighter and easily wraps to a
                        new line.
                      </FormText> */}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">Community Tax Certificate</Label>
                      <Input id="exampleFile" name="file" type="file" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">
                        Barangay Clearance (As proof of Residency)
                      </Label>
                      <Input id="exampleFile" name="file" type="file" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="orNo">Official Receipt (OR)</Label>
                      <Input
                        id="orNo"
                        name="orNo"
                        placeholder="Enter O.R No."
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="amountPaid">Amount Paid</Label>
                      <Input
                        id="amountPaid"
                        name="amountPaid"
                        placeholder="Enter Amount"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="officialReceipt">Official Receipt</Label>
                      <Input
                        id="officialReceipt"
                        name="officialReceipt"
                        type="file"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div style={{ textAlign: "justify" }}>
                      <p>
                        <span style={{ color: "red" }}>NOTE: </span>
                        Magbayad usa sa Cashier para sa Official Receipt
                        (P140.00) adisir mo adto sa Hall of Justice(sa Barangay
                        Libertad) para sa Fiscal ug Court Clearances. Dapat
                        BUTUAN CITY ang Address nga ibutang sa dokumento sama sa
                        Fiscal, Court, ug Brgy. Clearance. Mubalik sa CBPLD og
                        ipakita ang tanan Original nga Dokumento (apil ang mga
                        photocopy) alang sa pag issue sa Certificate
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default GoodMoralCertificate;
