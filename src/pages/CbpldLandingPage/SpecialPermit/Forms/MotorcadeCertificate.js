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
function MotorcadeCertificate() {
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
              {/* 1st main Col */}
              <Col
                md={8}
                style={{ borderRight: "2px solid", borderColor: "#f0f3f7" }}
              >
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="nameOfRequestor">
                        Name of Requestor / Organization
                      </Label>
                      <Input
                        id="nameOfRequestor"
                        name="nameOfRequestor"
                        placeholder="Enter Name of Requestor / Organization"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="nameOfEvent">Name of Event</Label>
                      <Input
                        id="nameOfEvent"
                        name="nameOfEvent"
                        placeholder="Enter Name of Event"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dateOfEvent">Date of Event</Label>
                      <Input id="dateOfEvent" name="dateOfEvent" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="timeOfEvent">Time of Event</Label>
                      <Input id="timeOfEvent" name="timeOfEvent" />
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
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress2">Email Address</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Email Address"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress2">Contact No.</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Contact No."
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
              {/* 2nd Main Col */}
              <Col>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">
                        Request Letter Stamped (Received by Office of the City
                        Mayor)
                      </Label>
                      <Input id="exampleFile" name="file" type="file" />
                      {/* <FormText>
                        This is some placeholder block-level help text for the
                        above input. It‘s a bit lighter and easily wraps to a
                        new line.
                      </FormText> */}
                    </FormGroup>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">
                        Route Plan approved by CTTMD
                      </Label>
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
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default MotorcadeCertificate;
