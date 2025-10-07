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
function OccupationalPermit() {
  return (
    <React.Fragment>
      {" "}
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
                  <Col md={2}>
                    <FormGroup>
                      <Label for="exampleAddress">M.I</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="M.I"
                      />
                    </FormGroup>
                  </Col>

                  <Col md={2}>
                    <FormGroup>
                      <Label for="exampleAddress">Suffix</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Ext"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress">Date of Birth</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Ext"
                        type="date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress">Place of Birth</Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="Place of Birth"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Civil Status</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Email Address"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Sex</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Contact No."
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleAddress2">Contact Number</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Contact No."
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="exampleAddress2">Email Address</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Email Address"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress2">
                        Educational Attainment
                      </Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Educational Attainment"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="exampleAddress2">Occupation</Label>
                      <Input
                        id="exampleAddress2"
                        name="address2"
                        placeholder="Enter Occupation"
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
                      <Label for="exampleFile">Certificate of Employment</Label>
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
                      <Label for="exampleFile">ID Picture</Label>
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
                      <Label for="exampleFile">Health Certificate</Label>
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
                      <Label for="exampleFile">Training Certificate</Label>
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

export default OccupationalPermit;
