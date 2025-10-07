import React, { useState, useRef, useEffect } from "react";
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
} from "reactstrap";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";

function OccupationalPermitModal({ openModal, toggleModal }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const purposeOptions = [
    { value: 1, label: "Local Employment" },
    { value: 2, label: "International Employment" },
  ];

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]); // Directly append files
      } else if (Array.isArray(object[key])) {
        object[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (typeof object[key] === "object" && object[key] !== null) {
        formData.append(key, JSON.stringify(object[key]));
      } else {
        formData.append(key, object[key]);
      }
    });
    return formData;
  };

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="xl"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          maxWidth: "1400px",
        }}
        unmountOnClose
      >
        <ModalHeader toggle={toggleModal}>
          <p
            style={{
              fontWeight: "bold",
              letterSpacing: ".2rem",
              fontSize: "18pt",
              margin: "0",
              padding: "0",
              color: "#368be0",
            }}
          >
            {"OCCUPATIONAL PERMIT"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              type: "occupational_permit",
              surname: "",
              first_name: "",
              middle_initial: "",
              suffix: "",
              date_of_birth: "",
              place_of_birth: "",
              civil_status: "",
              sex: "",
              contact_no: "",
              email: "",
              educational_attainment: "",
              occupation: "",
              province: "",
              city: "",
              barangay: "",
              additional_address: "",
              certificate_of_employment: "",
              community_tax_certificate: "",
              id_picture: "",
              health_certificate: "",
              training_certificate: "",
              official_receipt: "",
              or_no: "",
              paid_amount: "",
            }}
            onSubmit={handleSubmit}
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
                          <Label for="surname">Surname</Label>
                          <Input
                            id="surname"
                            name={"surname"}
                            placeholder="Enter Surname"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name={"first_name"}
                            placeholder="Enter First Name"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label for="middleInitial">M.I</Label>
                          <Input
                            id="middleInitial"
                            name={`middle_initial`}
                            placeholder="M.I"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={2}>
                        <FormGroup>
                          <Label for="suffix">Suffix</Label>
                          <Input
                            id="suffix"
                            name={"suffix"}
                            placeholder="Ext"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            name={"date_of_birth"}
                            placeholder="Ext"
                            onChange={props.handleChange}
                            type="date"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="placeOfBirth">Place of Birth</Label>
                          <Input
                            id="placeOfBirth"
                            name={"place_of_birth"}
                            placeholder="Place of Birth"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="civilStatus">Civil Status</Label>
                          <Input
                            id="civilStatus"
                            name={"civil_status"}
                            placeholder="Civil Status"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="sex">Sex</Label>
                          <Input
                            id="sex"
                            name={"sex"}
                            placeholder="Sex"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="contactNo">Contact Number</Label>
                          <Input
                            id="contactNo"
                            name={"contact_no"}
                            placeholder="Enter Contact No."
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="email">Email Address</Label>
                          <Input
                            id="email"
                            name={"email"}
                            placeholder="Enter Email Address"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="educationalAttainment">
                            Educational Attainment
                          </Label>
                          <Input
                            id="educationalAttainment"
                            name={"educational_attainment"}
                            placeholder="Educational Attainment"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name={"occupation"}
                            placeholder="Enter Occupation"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="province">Province</Label>
                          <Select
                            name={"province"}
                            // isMulti
                            isClearable={true}
                            placeholder="Select Province"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="province">City</Label>
                          <Select
                            name={"city"}
                            // isMulti
                            isClearable={true}
                            placeholder="Select City"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="province">Barangay</Label>
                          <Select
                            name={"barangay"}
                            // isMulti
                            isClearable={true}
                            placeholder="Select Barangay"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="additionalAddress">
                            Additional Address
                          </Label>
                          <Input
                            id="additionalAddress"
                            name={"additional_address"}
                            placeholder="Enter Additional Address"
                            onChange={props.handleChange}
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
                          <Label for="certificateOfEmployment">
                            Certificate of Employment
                          </Label>
                          <Input
                            id="certificateOfEmployment"
                            name={`certificate_of_employment`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "certificate_of_employment",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                          />
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
                          <Label for="taxCert">Community Tax Certificate</Label>
                          <Input
                            id="taxCert"
                            name={`community_tax_certificate`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "community_tax_certificate",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                          />
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
                          <Label for="idPicture">ID Picture</Label>
                          <Input
                            id="idPicture"
                            name={`id_picture`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "id_picture",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="healthCertificate">
                            Health Certificate
                          </Label>
                          <Input
                            id="healthCertificate"
                            name={`health_certificate`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "health_certificate",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="trainingCertificate">
                            Training Certificate
                          </Label>
                          <Input
                            id="trainingCertificate"
                            name={`training_certificate`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "training_certificate",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="orNo">Official Receipt (OR)</Label>
                          <Input
                            id="orNo"
                            name={`orNo`}
                            onChange={props.handleChange}
                            placeholder="Enter O.R No."
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label for="amountPaid">Amount Paid</Label>
                          <Input
                            id="amountPaid"
                            name={`paid_amount`}
                            onChange={props.handleChange}
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
                            name={`official_receipt`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "official_receipt",
                                event.currentTarget.files[0]
                              );
                            }}
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
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              const formik = formikRef.current.values;
              // console.log(formik);
              // console.log(formik.amountPaid);
              // var bodyFormData = getFormData(formik);
              const formData = getFormData(formik);
              console.log(formData);
              handleSubmit(
                {
                  url: "api/client/special-permit/occupational-permit",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: formData,
                },
                [],
                [toggleModal]
              );
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default OccupationalPermitModal;
