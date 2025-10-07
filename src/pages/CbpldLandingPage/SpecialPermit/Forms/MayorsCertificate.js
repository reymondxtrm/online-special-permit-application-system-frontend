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
function MayorsCertificate() {
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
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "65%",
                  borderRight: "2px solid",
                  borderColor: "#f0f3f7",
                  paddingRight: "15px",
                }}
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
                        // onChange={(selectedOptions) => {
                        //   if (selectedOptions.length === 0) {
                        //     props.setFieldValue("sector", null);
                        //     selectedSectorHandler([]);
                        //     // Clear all offices when sector is changed
                        //     props.setFieldValue("ppaDetails", [
                        //       {
                        //         ppaName: "",
                        //         officeDetails: [],
                        //       },
                        //     ]);
                        //     officeStateHandler();
                        //   } else {
                        //     props.setFieldValue(
                        //       `ppaDetails.${index}.sector`,
                        //       selectedOptions
                        //     );
                        //     selectedSectorHandler(selectedOptions); // Update selected sectors
                        //     officeStateHandler();
                        //   }
                        // }}
                        // onBlur={() => {
                        //   props.handleBlur({
                        //     target: {
                        //       name: " `ppaDetails.${index}.sector`",
                        //     },
                        //   });
                        // }}
                        // options={sectorOptions}
                        // value={props.values.ppaDetails.sector || []}
                        // classNamePrefix="select2-selection"
                        // invalid={
                        //   props.touched.ppaDetails &&
                        //   props.touched.ppaDetails[index] &&
                        //   props.touched.ppaDetails[index].sector &&
                        //   !!props.errors.ppaDetails &&
                        //   !!props.errors.ppaDetails[index] &&
                        //   !!props.errors.ppaDetails[index].sector
                        // }
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
              </div>
              <div style={{ width: "35%", paddingLeft: "15px" }}>
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
                      <Label for="exampleFile">Fiscal Clearance</Label>
                      <Input id="exampleFile" name="file" type="file" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleFile">Court Clearance</Label>
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
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default MayorsCertificate;
