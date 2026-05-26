import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

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
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faFileSignature } from "@fortawesome/free-solid-svg-icons";

import Signature from "./Signature";
import WebCam from "./WebCam";

import { getForFinalReleasing } from "features/FinalReleaser/finalReleaserSlice";
import useSubmit from "hooks/Common/useSubmit";

const DEFAULT_SERVICE = "signature";

const validationSchema = Yup.object({
  receiver_name: Yup.string().required("Receiver name is required"),
  receiver_relationship_to_owner: Yup.string().nullable(),

  receiver_phone_no: Yup.string().nullable(),
  receiver_id_type: Yup.string()
    .trim()
    .required("Receiver ID type is required"),

  receiver_other_id_type: Yup.string().nullable(),

  receiver_id_no: Yup.string()
    .trim()
    .required("Receiver ID number is required"),

  receiver_signature: Yup.string().required("Receiver signature is required"),

  receiver_picture: Yup.string().required("Receiver picture is required"),

  date: Yup.date().required("Received date is required"),

  time: Yup.string().required("Received time is required"),
});

const ReleaseModal = ({
  isOpen,
  toggle,
  toggleRefresh,
  // api,
  selectedItem,
}) => {
  const dispatch = useDispatch();

  const [selectedService, setSelectedService] = useState(DEFAULT_SERVICE);
  const [idTypes, setIdTypes] = useState([]);
  const handleSubmit = useSubmit();
  const initialValues = useMemo(
    () => ({
      control_number: "",
      receiver_name: "",
      receiver_relationship_to_owner: "",
      receiver_phone_no: "",
      receiver_email: "",
      receiver_id_type: "",
      receiver_other_id_type: "",
      receiver_id_no: "",
      receiver_signature: "",
      receiver_picture: "",
      date: new Date().toISOString().split("T")[0],

      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),
    [idTypes],
  );
  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const response = await axios.get("api/get-primary-id-type");
        setIdTypes(() =>
          response.data.map((item) => ({ value: item.id, label: item.name })),
        );
      } catch (error) {
        console.error("Failed to fetch permit types", error);
      }
    };

    fetchIdTypes();
  }, []);
  const handleClose = useCallback(() => {
    validation.resetForm();
    setSelectedService(DEFAULT_SERVICE);
    toggle?.();
  }, [toggle]);
  // const handleSubmit = useCallback(
  //   async (values, { resetForm, setSubmitting }) => {
  //     try {
  //       const result = await Swal.fire({
  //         title: "Confirm Release",
  //         text: "Are you sure you want to release this document?",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes, Release",
  //         cancelButtonText: "Cancel",
  //         reverseButtons: true,
  //         allowOutsideClick: false,
  //       });

  //       if (!result.isConfirmed) {
  //         return;
  //       }

  //       Swal.fire({
  //         title: "Processing...",
  //         text: "Please wait while releasing the document.",
  //         allowOutsideClick: false,
  //         showConfirmButton: false,
  //         didOpen: () => {
  //           Swal.showLoading();
  //         },
  //       });

  //       const payload = {
  //         offline_transaction_id: selectedItem,
  //         receiver_name: values.receiver_name,
  //         receiver_relationship_to_owner: values.receiver_relationship_to_owner,
  //         receiver_phone_no: values.receiver_phone_no,
  //         receiver_email: values.receiver_email,
  //         receiver_id_type: values.receiver_id_type,
  //         receiver_other_id_type: values.receiver_other_id_type,
  //         receiver_id_no: values.receiver_id_no,
  //         receiver_signature: values.receiver_signature,
  //         receiver_picture: values.receiver_picture,
  //         received_date: values.date,
  //         received_time: values.time,
  //       };

  //       await axios.post("/api/admin/release-offline-transaction", payload, {
  //         withCredentials: true,
  //       });

  //       dispatch(
  //         getForFinalReleasing({
  //           for_action: 1,
  //         }),
  //       );

  //       toggleRefresh?.();

  //       Swal.fire({
  //         icon: "success",
  //         title: "Document Released Successfully",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });

  //       resetForm();
  //       handleClose();
  //     } catch (error) {
  //       console.error(error);

  //       const errorMessage =
  //         error?.response?.data?.message || "Something went wrong.";

  //       Swal.fire({
  //         icon: "error",
  //         title: "Release Failed",
  //         text: errorMessage,
  //       });
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   },
  //   [selectedItem, dispatch, handleClose, toggleRefresh],
  // );

  const validation = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        offline_transaction_id: selectedItem,
        receiver_name: values.receiver_name,
        receiver_relationship_to_owner: values.receiver_relationship_to_owner,
        receiver_phone_no: values.receiver_phone_no,
        receiver_email: values.receiver_email,
        receiver_id_type: values.receiver_id_type,
        receiver_other_id_type: values.receiver_other_id_type,
        receiver_id_no: values.receiver_id_no,
        receiver_signature: values.receiver_signature,
        receiver_picture: values.receiver_picture,
        received_date: values.date,
        received_time: values.time,
      };
      handleSubmit(
        {
          url: "/api/admin/release-offline-transaction",
          message: {
            title: "Are you sure you want to submit?",
            failedTitle: "FAILED",
            success: "Success!",
            error: "Unknown error occurred",
          },
          params: payload,
        },
        [],
        [toggle, toggleRefresh],
      );
    },
  });

  const renderPreview = (src, alt) => (
    <div
      className="w-100 h-100 overflow-hidden d-flex align-items-center justify-content-center border rounded bg-light"
      style={{
        minHeight: "220px",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="img-fluid w-100 h-100"
          style={{
            objectFit: "contain",
          }}
        />
      ) : (
        <span className="text-muted fw-semibold">No Data</span>
      )}
    </div>
  );

  const getFieldError = (field) =>
    validation.touched[field] && Boolean(validation.errors[field]);
  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      fullscreen
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader toggle={handleClose}>Release Document</ModalHeader>

      <ModalBody className="bg-light">
        <Form onSubmit={validation.handleSubmit} noValidate>
          <Row>
            <Col lg={9}>
              <Card className="shadow-sm border-0">
                <CardBody style={{ height: "900px" }}>
                  <Row style={{ height: "75%" }} className="h-75">
                    <Col className="h-100 rounded-1">
                      <Row className="h-5 text-center mb-2 ">
                        <Col className="d-flex justify-content-center gap-2">
                          <Button
                            type="button"
                            color={
                              selectedService === "takePicture"
                                ? "danger"
                                : "outline-danger"
                            }
                            onClick={() => setSelectedService("takePicture")}
                          >
                            <FontAwesomeIcon icon={faCamera} className="me-2" />
                            Camera
                          </Button>

                          <Button
                            type="button"
                            color={
                              selectedService === "signature"
                                ? "warning"
                                : "outline-warning"
                            }
                            onClick={() => setSelectedService("signature")}
                          >
                            <FontAwesomeIcon
                              icon={faFileSignature}
                              className="me-2"
                            />
                            Signature
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
                            alt="Receiver Signature"
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
              <Card className="shadow-sm border-0 mb-3">
                <CardBody>
                  <FormGroup className="mb-3">
                    <Label>Receiver Name</Label>

                    <Input
                      name="receiver_name"
                      placeholder="Ex. John Doe"
                      value={validation.values.receiver_name}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("receiver_name")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_name}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Label>Receiver Relationship to Owner</Label>

                    <Input
                      name="receiver_relationship_to_owner"
                      placeholder="Ex. Son"
                      value={validation.values.receiver_relationship_to_owner}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("receiver_relationship_to_owner")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_relationship_to_owner}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Receiver ID Type</Label>

                    <Input
                      type="select"
                      name="receiver_id_type"
                      value={validation.values.receiver_id_type}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.receiver_id_type &&
                        Boolean(validation.errors.receiver_id_type)
                      }
                    >
                      <option value="">Select ID Type</option>

                      {idTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Input>

                    <FormFeedback>
                      {validation.errors.receiver_id_type}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Receiver ID Number</Label>

                    <Input
                      name="receiver_id_no"
                      placeholder="Ex. 123456789`"
                      value={validation.values.receiver_id_no}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("receiver_id_no")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_id_no}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Label>Receiver Phone No.</Label>

                    <Input
                      name="receiver_phone_no"
                      placeholder="Ex. 0912312"
                      value={validation.values.receiver_phone_no}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("receiver_phone_no")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_phone_no}
                    </FormFeedback>
                  </FormGroup>

                  <Row className="g-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label>Date</Label>

                        <Input
                          type="date"
                          name="date"
                          value={validation.values.date}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={getFieldError("date")}
                        />

                        <FormFeedback>{validation.errors.date}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Time</Label>

                        <Input
                          type="time"
                          name="time"
                          value={validation.values.time}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={getFieldError("time")}
                        />

                        <FormFeedback>{validation.errors.time}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="shadow-sm border-0">
                <CardBody className="d-flex flex-column gap-2">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={validation.isSubmitting}
                  >
                    {validation.isSubmitting ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>

                  <Button
                    type="button"
                    color="secondary"
                    onClick={handleClose}
                    disabled={validation.isSubmitting}
                  >
                    Cancel
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ReleaseModal;
