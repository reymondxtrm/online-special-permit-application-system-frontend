import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
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
  receiver_name: Yup.string()
    .trim()
    .max(255)
    .required("Receiver name is required"),

  receiver_relationship_to_owner: Yup.string().trim().max(255).nullable(),

  receiver_phone_no: Yup.string().trim().max(20).nullable(),

  receiver_email: Yup.string().trim().email("Invalid email address").nullable(),

  receiver_id_type: Yup.string()
    .trim()
    .required("Receiver ID type is required"),

  receiver_other_id_type: Yup.string().trim().max(255).nullable(),

  receiver_id_no: Yup.string()
    .trim()
    .max(255)
    .required("Receiver ID number is required"),

  receiver_signature: Yup.string().required("Receiver signature is required"),

  receiver_picture: Yup.string().required("Receiver picture is required"),

  date: Yup.date().required("Received date is required"),

  time: Yup.string().required("Received time is required"),
});

const initialValues = {
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
};

const buildPayload = (values, selectedItem) => ({
  offline_transaction_id: selectedItem,

  receiver_name: values.receiver_name.trim(),

  receiver_relationship_to_owner:
    values.receiver_relationship_to_owner?.trim() || null,

  receiver_phone_no: values.receiver_phone_no?.trim() || null,

  receiver_email: values.receiver_email?.trim() || null,

  receiver_id_type: values.receiver_id_type,

  receiver_other_id_type: values.receiver_other_id_type?.trim() || null,

  receiver_id_no: values.receiver_id_no.trim(),

  receiver_signature: values.receiver_signature,
  receiver_picture: values.receiver_picture,

  received_date: values.date,
  received_time: values.time,
});

// const PreviewCard = ({ src, alt }) => (
//   <div
//     className="w-100 h-100 overflow-hidden d-flex align-items-center justify-content-center border rounded bg-light"
//     style={{
//       minHeight: "220px",
//     }}
//   >
//     {src ? (
//       <img
//         src={src}
//         alt={alt}
//         className="img-fluid w-100 h-100 border border-secondary"
//         style={{
//           objectFit: "contain",
//           maxHeight: "100%",
//           maxWidth: "100%",
//           height: "100%",
//         }}
//       />
//     ) : (
//       <h3 className="text-white m-0">No Data</h3>
//     )}
//   </div>
// );

const ReleaseModal = ({ isOpen, toggle, toggleRefresh, selectedItem }) => {
  const dispatch = useDispatch();

  const [selectedService, setSelectedService] = useState(DEFAULT_SERVICE);
  const [idTypes, setIdTypes] = useState([]);

  const handleSubmit = useSubmit();

  useEffect(() => {
    let mounted = true;

    const fetchIdTypes = async () => {
      try {
        const { data } = await axios.get("/api/get-primary-id-type");

        if (!mounted) return;

        setIdTypes(
          data.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch ID types", error);
      }
    };

    fetchIdTypes();

    return () => {
      mounted = false;
    };
  }, []);

  const validation = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values, helpers) => {
      const { setSubmitting, resetForm } = helpers;

      try {
        const payload = buildPayload(values, selectedItem);

        await handleSubmit(
          {
            url: "/api/admin/release-offline-transaction",

            message: {
              title: "Release this document?",
              failedTitle: "Release Failed",
              success: "Document released successfully.",
              error: "Something went wrong.",
            },

            params: payload,
          },
          [],
          [
            () => {
              dispatch(
                getForFinalReleasing({
                  for_action: 1,
                }),
              );

              toggleRefresh?.();

              resetForm();

              handleClose();
            },
          ],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = useCallback(() => {
    validation.resetForm();
    setSelectedService(DEFAULT_SERVICE);
    toggle?.();
  }, [toggle, validation]);

  useEffect(() => {
    if (!isOpen) {
      validation.resetForm();
      setSelectedService(DEFAULT_SERVICE);
    }
  }, [isOpen]);

  const getFieldProps = (field) => ({
    name: field,
    value: validation.values[field],
    onChange: validation.handleChange,
    onBlur: validation.handleBlur,
    invalid: validation.touched[field] && Boolean(validation.errors[field]),
  });

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
                      <Row className="text-center mb-2">
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
                      placeholder="Ex. John Doe"
                      {...getFieldProps("receiver_name")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_name}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Receiver Relationship to Owner</Label>

                    <Input
                      placeholder="Ex. Son"
                      {...getFieldProps("receiver_relationship_to_owner")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_relationship_to_owner}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Receiver ID Type</Label>

                    <Input type="select" {...getFieldProps("receiver_id_type")}>
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
                      placeholder="Ex. 123456789"
                      {...getFieldProps("receiver_id_no")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_id_no}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Receiver Phone No.</Label>

                    <Input
                      placeholder="Ex. 0912312"
                      {...getFieldProps("receiver_phone_no")}
                    />

                    <FormFeedback>
                      {validation.errors.receiver_phone_no}
                    </FormFeedback>
                  </FormGroup>

                  <Row className="g-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label>Date</Label>

                        <Input type="date" {...getFieldProps("date")} />

                        <FormFeedback>{validation.errors.date}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Time</Label>

                        <Input type="time" {...getFieldProps("time")} />

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
