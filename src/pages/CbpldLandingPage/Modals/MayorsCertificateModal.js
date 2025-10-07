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
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";

function MayorsCertificateModal({ openModal, toggleModal }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [purposeOptions, setpurposeOptions] = useState();
  const [otherPurpose, setotherPurpose] = useState(false);
  const [proceed, setIsProceed] = useState(true);

  // const purposeOptions = [
  //   { value: 1, label: "Local Employment" },
  //   { value: 2, label: "International Employment" },
  // ];
  const setProceedHandle = () => {
    setIsProceed((prev) => !prev);
  };

  useEffect(() => {
    if (openModal) {
      axios
        .get("api/get-purpose", {
          params: { permit_type: "mayors_certificate" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));

            const updatedOptions = [{ value: 0, label: "Others" }, ...options];
            // options.push({ value: "others", label: "Others" });
            setpurposeOptions(updatedOptions);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal]);

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
  // const getFormData = (object) => {
  //   const formData = new FormData();
  //   Object.keys(object).forEach((key) => {
  //     if (object[key] instanceof File || object[key] instanceof Blob) {
  //       formData.append(key, object[key]); // Directly append files
  //     } else if (Array.isArray(object[key])) {
  //       object[key].forEach((item) => formData.append(`${key}[]`, item));
  //     } else if (typeof object[key] === "object" && object[key] !== null) {
  //       formData.append(key, JSON.stringify(object[key])); // Stringify objects
  //     } else {
  //       formData.append(key, object[key]); // Add other values
  //     }
  //   });
  //   return formData;
  // };

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={() => {
          toggleModal();
          setProceedHandle();
        }}
        fade={true}
        backdrop="static"
        // size="xl"
        size="m"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
        }}
        unmountOnClose
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
            setProceedHandle();
          }}
        >
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
            {"MAYOR'S CERTIFICATE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              type: "mayors_permit",
              purpose_id: "",
              other_purpose: "",

              police_clearance: "",
              community_tax_certificate: "",
              barangay_clearance: "",

              fiscal_clearance: "",
              court_clearance: "",
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Row>
                  {/* 1st main Col */}
                  {/* <Col
                    md={8}
                    style={{ borderRight: "2px solid", borderColor: "#f0f3f7" }}
                  >
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Purpose</Label>
                          <Select
                            isMulti
                            isClearable={true}
                            name={"purpose"}
                            onChange={props.handleChange}
                            placeholder="Select Purpose"
                            options={purposeOptions}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="surname">Surname</Label>
                          <Input
                            id="surname"
                            name={`surname`}
                            onChange={props.handleChange}
                            placeholder="Enter Surname"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="firstname">First Name</Label>
                          <Input
                            id="firstname"
                            name={`first_name`}
                            onChange={props.handleChange}
                            placeholder="Enter First Name"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label for="middleInitial">M.I</Label>
                          <Input
                            id="middleInitial"
                            name={`middle_initial`}
                            onChange={props.handleChange}
                            placeholder="M.I"
                          />
                        </FormGroup>
                      </Col>

                      <Col md={1}>
                        <FormGroup>
                          <Label for="suffix">Suffix</Label>
                          <Input
                            id="suffix"
                            name={`suffix`}
                            onChange={props.handleChange}
                            placeholder="Ext"
                          />
                        </FormGroup>
                      </Col>

                      <Col md={2}>
                        <FormGroup>
                          <Label>SEX</Label>
                          <Select
                            isMulti
                            isClearable={true}
                            name={"sex"}
                            onChange={props.handleChange}
                            placeholder="SEX"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="emailAddress">Email Address</Label>
                          <Input
                            id="emailAddress"
                            name={`email`}
                            onChange={props.handleChange}
                            placeholder="Enter Email Address"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="contactNo">Contact No.</Label>
                          <Input
                            id="contactNo"
                            name={`contact_no`}
                            onChange={props.handleChange}
                            placeholder="Enter Contact No."
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="date">Date</Label>
                          <Input
                            id="date"
                            name={`date`}
                            type="date"
                            onChange={props.handleChange}
                            placeholder="Enter Date"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Province</Label>
                          <Select
                            isMulti
                            isClearable={true}
                            placeholder="Select Province"
                            name={`province`}
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>City</Label>
                          <Select
                            isMulti
                            isClearable={true}
                            placeholder="Select City"
                            name={`city`}
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Barangay</Label>
                          <Select
                            isMulti
                            isClearable={true}
                            placeholder="Select Barangay"
                            name={"barangay"}
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
                            name={`additional_address`}
                            onChange={props.handleChange}
                            placeholder="Enter Additional Address"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col> */}
                  {/* 2nd Main Col */}
                  <Col>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Purpose</Label>
                          <Select
                            isClearable={true}
                            name={"purpose"}
                            // onChange={props.handleChange}
                            onChange={(selectedOption) => {
                              console.log(selectedOption.label);
                              if (selectedOption.label === "Others") {
                                setotherPurpose(true);
                              } else {
                                setotherPurpose(false);
                              }
                              props.setFieldValue("purpose_id", selectedOption);
                            }}
                            placeholder="Select Purpose"
                            options={purposeOptions}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {otherPurpose && (
                      <Col md={12}>
                        <FormGroup>
                          <Label>Specify Other Purpose</Label>
                          <Input
                            type="text"
                            name={`other_purpose`}
                            onChange={props.handleChange}
                            placeholder="Enter your purpose"
                          />
                        </FormGroup>
                      </Col>
                    )}

                    {/* <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Specify Other Purpose</Label>
                          <Input
                            type="text"
                            value={other_purpose}
                            name={`other_purpose`}
                            onChange={handleOtherPurposeChange}
                            placeholder="Enter your purpose"
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="policeClearance">Police Clearance</Label>
                          <Input
                            id="policeClearance"
                            name="police_clearance"
                            type="file"
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "police_clearance",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
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
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="exampleFile">
                            Barangay Clearance (As proof of Residency)
                          </Label>
                          <Input
                            id="exampleFile"
                            name={`barangay_clearance`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "barangay_clearance",
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
                          <Label for="fiscalClearance">Fiscal Clearance</Label>
                          <Input
                            id="fiscalClearance"
                            name={`fiscal_clearance`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "fiscal_clearance",
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
                          <Label for="courtClearance">Court Clearance</Label>
                          <Input
                            id="courtClearance"
                            name={`court_clearance`}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "court_clearance",
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
          <div className="d-flex gap-2">
            <div style={{ width: "30px" }}>
              <Input type="checkbox" onClick={setProceedHandle} />
            </div>
            <p>{USER_PRIVACY}</p>
          </div>
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
                  url: "api/client/special-permit/mayors-permit",
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
            disabled={proceed}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggleModal();
              setProceedHandle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default MayorsCertificateModal;
