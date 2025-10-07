import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faFileSignature } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {
  Button,
  Form,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormFeedback,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { getForFinalReleasing } from "features/FinalReleaser/finalReleaserSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Signature from "./Signature";
import WebCam from "./WebCam";
import BasicInputField from "components/Forms/BasicInputField";
const ReleaseButton = ({
  id,
  api,
  incomplete,
  businessPermit,
  plateNo,
  businessCode,
  status,
  options,
}) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [selectedService, setSelectedService] = useState("signature");

  const dispatch = useDispatch();
  const params = {
    for_action: 1,
  };

  const releaseDocument = () => {
    toggleModal();
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      business_permit: businessPermit,
      business_code: businessCode,
      plate_no: plateNo,
      receiver_name: "",
      receiver_relationship_to_owner: "",
      receiver_id_type: null,
      receiver_other_id_type: "",
      receiver_id_no: "",
      receiver_phone_no: "",
      receiver_signature: "",
      receiver_picture: "",
      receiver_email: null,
    },

    validationSchema: Yup.object({
      plate_no: Yup.string().notRequired(),
      business_code: Yup.string().when([], {
        is: () => !isBusinessCode,
        then: Yup.string().required("Business Code is Required"),
        otherwise: Yup.string().notRequired(),
      }),
      business_permit: Yup.string().when([], {
        is: () => !isBusinessPermit,
        then: Yup.string().required("Business Permit is Required"),
        otherwise: Yup.string().notRequired(),
      }),
      receiver_name: Yup.string().required("Please Enter Receiver FullName"),
      receiver_relationship_to_owner: Yup.string().notRequired(),
      receiver_picture: Yup.string().required(),
      receiver_signature: Yup.string().required(),
      receiver_phone_no: Yup.string().required(
        "Receiver phone number is required"
      ),
      receiver_id_type: Yup.string().required("Receiver ID type is required"),
      receiver_id_no: Yup.string().required("Receiver ID number is required"),
      receiver_other_id_type: Yup.string().notRequired(),
      receiver_email: Yup.string()
        .email("Email should be valid")
        .notRequired()
        .nullable(),
    }),

    onSubmit: (values, { resetForm }) => {
      Swal.fire({
        title: "Are you sure you want to submit?",
        icon: "warning",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(function (result) {
        if (result.value) {
          Swal.fire({
            title: "Releasing...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
          axios
            .post(
              api,
              {
                business_id: id,
                business_code: values.business_code,
                business_permit: values.business_permit,
                plate_no: values.plate_no,
                receiver_phone_no: values.receiver_phone_no,
                receiver_id_no: values.receiver_id_no,
                receiver_id_type: values.receiver_id_type,
                receiver_name: values.receiver_name,
                receiver_signature: values.receiver_signature,
                receiver_other_id_type: values.receiver_other_id_type,
                receiver_picture: values.receiver_picture,
                receiver_relationship_to_owner:
                  values.receiver_relationship_to_owner,
                receiver_email: values.receiver_email,
              },
              {
                credentials: "include",
              }
            )
            .then(
              (res) => {
                resetForm();
                dispatch(getForFinalReleasing(params));
                Swal.fire({
                  icon: "success",
                  title: "Document Successfully Released",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              },
              (error) => {
                if (error.response.status === 401) {
                }
                console.log(error.response.data.message);
                Swal.fire({
                  icon: "warning",
                  title: "Release Failed",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              }
            );
        } else {
          console.log("cancel");
        }
      });
    },
  });
  console.log(validation.errors);
  const handleServiceClick = (service) => {
    if (selectedService != service) {
      setSelectedService(service);
      return;
    }
    return;
  };
  const isPlateNo = !!plateNo;
  const isBusinessCode = !!businessCode;
  const isBusinessPermit = !!businessPermit;

  return (
    <>
      <Modal isOpen={modal} toggle={toggleModal} fullscreen>
        <ModalHeader
          toggle={toggleModal}
          style={{ backgroundColor: "#222433" }}
        >
          <p className="text-light"> Final Release</p>
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "#1B1823" }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col lg={9}>
                <Card>
                  <CardBody style={{ height: "900px" }}>
                    <Row style={{ height: "75%" }} className="h-75">
                      <Col className="h-100 rounded-1">
                        <Row className="h-5 text-center mb-2">
                          <Col className="">
                            <Button
                              onClick={() => handleServiceClick("takePicture")}
                              style={{
                                borderColor: "#dc3545",
                                color: "#dc3545",
                                width: "100px",
                                height: "60px",
                              }}
                              className="border border-danger me-2"
                              outline
                            >
                              <FontAwesomeIcon
                                icon={faCamera}
                                style={{ color: "#dc3545", fontSize: "2rem" }}
                              />
                            </Button>
                            <Button
                              onClick={() => handleServiceClick("signature")}
                              style={{
                                borderColor: "orange",
                                color: "orange",
                                width: "100px",
                                height: "60px",
                              }}
                              outline
                            >
                              <FontAwesomeIcon
                                icon={faFileSignature}
                                style={{ color: "orange", fontSize: "2rem" }}
                              />
                            </Button>
                          </Col>
                        </Row>
                        {selectedService === "signature" ? (
                          <Signature validation={validation} />
                        ) : (
                          <WebCam validation={validation} />
                        )}
                      </Col>
                    </Row>
                    <Row style={{ height: "25%", minHeight: 0 }}>
                      <Col style={{ height: "100%", minHeight: 0 }}>
                        <div
                          className="w-100 h-100 overflow-hidden d-flex align-items-center justify-content-center"
                          style={{
                            height: "100%",
                            background: validation.values.receiver_signature
                              ? "none"
                              : "#6c757d",
                            borderRadius: "0.5rem",
                            minHeight: 0,
                          }}
                        >
                          {validation.values.receiver_signature ? (
                            <img
                              src={validation.values.receiver_signature}
                              className="img-fluid w-100 h-100 border border-secondary"
                              style={{
                                objectFit: "contain",
                                maxHeight: "100%",
                                maxWidth: "100%",
                                height: "100%",
                              }}
                              alt="Receiver Signat"
                            />
                          ) : (
                            <h3 className="text-white m-0">No Data</h3>
                          )}
                        </div>
                      </Col>
                      <Col style={{ height: "100%", minHeight: 0 }}>
                        <div
                          className="w-100 h-100 overflow-hidden d-flex align-items-center justify-content-center"
                          style={{
                            height: "100%",
                            background: validation.values.receiver_picture
                              ? "none"
                              : "#6c757d",
                            borderRadius: "0.5rem",
                            minHeight: 0,
                          }}
                        >
                          {validation.values.receiver_picture ? (
                            <img
                              src={validation.values.receiver_picture}
                              className="img-fluid w-100 h-100 border border-secondary"
                              style={{
                                objectFit: "contain",
                                maxHeight: "100%",
                                maxWidth: "100%",
                                height: "100%",
                              }}
                              alt="Receiver Picture"
                            />
                          ) : (
                            <h3 className="text-white m-0">No Data</h3>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={3}>
                <Card>
                  <CardBody>
                    <Col md="12">
                      <BasicInputField
                        label={"Business Code:"}
                        name={"business_code"}
                        validation={validation}
                        // disable={isBusinessCode}
                        placeholder={"Enter Business Code."}
                        col={12}
                        value={
                          validation.values?.business_code?.toUpperCase() || ""
                        }
                        errors={validation.errors.business_code}
                        type={"text"}
                        touched={validation.touched.business_code}
                        required={true}
                      />
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <BasicInputField
                          label={"Business Permit No:"}
                          name={"business_permit"}
                          validation={validation}
                          disabled={isBusinessPermit}
                          placeholder={"Enter Business Permit No."}
                          col={12}
                          value={validation.values?.business_permit?.toUpperCase()}
                          errors={validation.errors.business_permit}
                          type={"text"}
                          touched={validation.touched.business_permit}
                          required={true}
                        />
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <BasicInputField
                          label={"Plate No:"}
                          name={"plate_no"}
                          validation={validation}
                          disabled={isPlateNo}
                          placeholder={"Enter Business Plate No."}
                          col={12}
                          value={validation.values?.plate_no?.toUpperCase()}
                          errors={validation.errors.plate_no}
                          type={"text"}
                          touched={validation.touched.plate_no}
                          required={false}
                        />
                      </div>
                    </Col>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Receiver information</CardHeader>
                  <CardBody>
                    <Col md="12">
                      <div className="mb-3">
                        <BasicInputField
                          col={12}
                          name={"receiver_name"}
                          placeholder={"Enter Receiver Fullname"}
                          label={"Receiver Fullname"}
                          value={
                            validation.values?.receiver_name?.toUpperCase() ||
                            ""
                          }
                          touched={validation.touched.receiver_name}
                          errors={validation.errors.receiver_name}
                          type={"text"}
                          validation={validation}
                          required={true}
                        />
                        <BasicInputField
                          col={12}
                          name={"receiver_relationship_to_owner"}
                          placeholder={"Enter Relationship to the owner"}
                          label={"Relationship"}
                          value={
                            validation.values?.receiver_relationship_to_owner?.toUpperCase() ||
                            ""
                          }
                          touched={
                            validation.touched.receiver_relationship_to_owner
                          }
                          errors={
                            validation.errors.receiver_relationship_to_owner
                          }
                          type={"text"}
                          validation={validation}
                          required={true}
                        />

                        <label>Receiver ID:</label>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                          required={true}
                        >
                          <label>
                            ID Type:
                            <span style={{ color: "red" }}>&nbsp;*</span>
                          </label>
                          <Select
                            value={
                              options.find(
                                (option) =>
                                  option.value ===
                                  validation.values.receiver_id_type
                              ) || null
                            }
                            onChange={(selected) => {
                              validation.setFieldValue(
                                "receiver_id_type",
                                selected?.value
                              );
                            }}
                            options={options}
                            isSearchable={true}
                            className="receiver_id_type"
                            name="receiver_id_type"
                            invalid={
                              validation.touched.receiver_id_type &&
                              validation.errors.receiver_id_type
                            }
                          />
                          {validation.touched.receiver_id_type &&
                          validation.errors.receiver_id_type ? (
                            <FormFeedback>ID Type is required</FormFeedback>
                          ) : null}

                          {validation.values.receiver_id_type === 22 ? (
                            <BasicInputField
                              col={12}
                              name={"receiver_other_id_type"}
                              placeholder={"Enter ID Name"}
                              label={"ID Name:"}
                              value={
                                validation.values.receiver_other_id_type || ""
                              }
                              touched={
                                validation.touched.receiver_other_id_type
                              }
                              errors={validation.errors.receiver_other_id_type}
                              type={"text"}
                              validation={validation}
                              required={true}
                            />
                          ) : null}
                          <BasicInputField
                            col={12}
                            name={"receiver_id_no"}
                            placeholder={"Enter ID no"}
                            label={"ID No:"}
                            value={validation.values.receiver_id_no || ""}
                            touched={validation.touched.receiver_id_no}
                            errors={validation.errors.receiver_id_no}
                            type={"text"}
                            validation={validation}
                            required={true}
                          />
                        </div>

                        <BasicInputField
                          style={{ marginTop: "-5px" }}
                          col={12}
                          name={"receiver_phone_no"}
                          placeholder={"e.g., 09171234567"}
                          label={"Receiver Phone No:"}
                          value={
                            validation?.values?.receiver_phone_no?.toUpperCase() ||
                            ""
                          }
                          touched={validation?.touched?.receiver_phone_no}
                          errors={validation?.errors?.receiver_phone_no}
                          type={"text"}
                          validation={validation}
                          required={true}
                        />

                        <BasicInputField
                          col={12}
                          name={"receiver_email"}
                          placeholder={"Enter receiver email"}
                          label={"Receiver Email:"}
                          value={validation?.values?.receiver_email || ""}
                          touched={validation?.touched?.receiver_email}
                          errors={validation?.errors?.receiver_email}
                          type={"email"}
                          validation={validation}
                        />
                      </div>
                    </Col>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="gap-3">
                    <Col>
                      <Button
                        color="primary"
                        onClick={validation.submitForm}
                        className="w-100 mb-2"
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        color="secondary"
                        onClick={toggleModal}
                        className="w-100"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      {status === "final_released" ? (
        <>
          <Button
            type="button"
            color="warning"
            className="btn-sm btn-rounded"
            onClick={(e) => {
              e.preventDefault();
              releaseDocument();
            }}
            style={{ marginBottom: "2px" }}
          >
            Reissue{" "}
            {/* hide this for the future use depending into the userrole that can be decide in the future */}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          color="primary"
          className="btn-sm btn-rounded"
          onClick={(e) => {
            e.preventDefault();
            releaseDocument();
          }}
          style={{ marginBottom: "2px" }}
        >
          Release
        </Button>
      )}
    </>
  );
};

export default ReleaseButton;
