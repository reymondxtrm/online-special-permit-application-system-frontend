import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  FormFeedback,
} from "reactstrap";

import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import { USER_PRIVACY } from "assets/data/data";
import axios from "axios";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import useGetImage from "hooks/Common/useGetImage";
import * as Yup from "yup";
import useImageCompressor from "hooks/Common/useImageCompressor";

function ParadeModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);
  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { currentImage, isFetching, getImageHandle } = useGetImage();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const {
    compressedFiles,
    isCompressing,
    errors: compressionErrors,
    handleImageChange,
  } = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  useEffect(() => {
    if (openModal && isUpdate && specialPermitApplicationId) {
      axios
        .get("api/client/get-single-permmit-application", {
          params: {
            special_permit_application_id: specialPermitApplicationId,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setExistingData({
            requestor_name: data.requestor_name,
            event_name: data.event_name,
            event_date_from: data.event_date_from,
            event_date_to: data.event_date_to, // Fixed: was event_to
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
          });
          setUploadedFiles(data.uploaded_file || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    if (file.type.startsWith("image")) {
      const compressed = await handleImageChange(e, index);
      if (compressed) {
        props.setFieldValue(fieldName, compressed);
        props.setFieldTouched(fieldName, true, true);
      }
    } else {
      props.setFieldValue(fieldName, file);
      props.setFieldTouched(fieldName, true, true);
    }
  };
  useEffect(() => {
    if (!openModal && formikRef.current) {
      formikRef.current.resetForm();
      setExistingData({});
      setUploadedFiles({});
    }
  }, [openModal]);

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]);
      } else if (Array.isArray(object[key])) {
        object[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (typeof object[key] === "object" && object[key] !== null) {
        formData.append(key, JSON.stringify(object[key]));
      } else {
        formData.append(key, object[key] ?? "");
      }
    });
    return formData;
  };

  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };

  const IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  const fileValidationRequired = Yup.mixed()
    .required("This file is required")

    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type),
    );

  const fileValidationOptional = Yup.mixed()
    .nullable()

    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type),
    );

  const ParadeSchema = Yup.object().shape({
    requestor_name: Yup.string().required(
      "Requestor / Organization is required",
    ),

    event_name: Yup.string().required("Event name is required"),

    event_date_from: Yup.date().required("Start date is required"),

    event_date_to: Yup.date()
      .min(
        Yup.ref("event_date_from"),
        "End date must be after or equal to start date",
      )
      .required("End date is required"),

    event_time_from: Yup.string().required("Start time is required"),

    event_time_to: Yup.string().required("End time is required"),

    request_letter: isUpdate ? fileValidationOptional : fileValidationRequired,

    route_plan: isUpdate ? fileValidationOptional : fileValidationRequired,
  });

  return (
    <React.Fragment>
      {isViewerOpen && !isFetching && currentImage && (
        <ReactSimpleImageViewer
          src={[currentImage]}
          currentIndex={0}
          onClose={toggleIsViewerOpen}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
          }}
          closeOnClickOutside={true}
          disableZoom={false}
        />
      )}
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
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
            {isUpdate ? "UPDATE PARADE" : "PARADE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            validationSchema={ParadeSchema}
            enableReinitialize
            validateOnChange={true}
            validateOnBlur={true}
            initialValues={{
              type: "parade",
              permit_type_id: "parade",
              requestor_name: existingData?.requestor_name || "",
              event_name: existingData?.event_name || "",
              event_date_from: existingData?.event_date_from || "",
              event_date_to: existingData?.event_date_to || "",
              event_time_from: existingData?.event_time_from || "",
              event_time_to: existingData?.event_time_to || "",
              route_plan: null,
              request_letter: null,
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Row>
                  <Col>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="nameOfRequestor">
                            Name of Requestor / Organization{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="nameOfRequestor"
                            name="requestor_name"
                            placeholder="Enter Name of Requestor / Organization"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.requestor_name}
                            invalid={
                              props.touched.requestor_name &&
                              Boolean(props.errors.requestor_name)
                            }
                          />
                          <FormFeedback>
                            {props.errors.requestor_name}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="nameOfEvent">
                            Name of Event <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="nameOfEvent"
                            name="event_name"
                            value={props.values.event_name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.event_name &&
                              Boolean(props.errors.event_name)
                            }
                          />
                          <FormFeedback>{props.errors.event_name}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateOfEventFrom">
                            Start Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="dateOfEventFrom"
                            type="date"
                            name="event_date_from"
                            value={props.values.event_date_from}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.event_date_from &&
                              Boolean(props.errors.event_date_from)
                            }
                          />
                          <FormFeedback>
                            {props.errors.event_date_from}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateOfEventTo">
                            End Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="dateOfEventTo"
                            type="date"
                            name="event_date_to"
                            value={props.values.event_date_to}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.event_date_to &&
                              Boolean(props.errors.event_date_to)
                            }
                          />
                          <FormFeedback>
                            {props.errors.event_date_to}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="timeOfEventFrom">
                            Start Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="timeOfEventFrom"
                            type="time"
                            name="event_time_from"
                            value={props.values.event_time_from}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.event_time_from &&
                              Boolean(props.errors.event_time_from)
                            }
                          />
                          <FormFeedback>
                            {props.errors.event_time_from}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="timeOfEventTo">
                            End Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="timeOfEventTo"
                            type="time"
                            name="event_time_to"
                            value={props.values.event_time_to}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.event_time_to &&
                              Boolean(props.errors.event_time_to)
                            }
                          />
                          <FormFeedback>
                            {props.errors.event_time_to}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="requestLetter">
                            Request Letter Stamped (Received by Office of the
                            City Mayor){" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                id="requestLetter"
                                type="file"
                                name="request_letter"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                  handleFileChange(
                                    e,
                                    "request_letter",
                                    0,
                                    props,
                                  );
                                  props.setFieldTouched(
                                    "request_letter",
                                    true,
                                    true,
                                  );
                                }}
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "request_letter",
                                    true,
                                    true,
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[0] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[0]}
                                </div>
                              )}
                              {props.touched.request_letter &&
                              props.errors.request_letter ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.request_letter}
                                </div>
                              ) : null}
                            </div>

                            {isUpdate && uploadedFiles?.request_letter && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.request_letter,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="route_plan">
                            Route Plan approved by CTTMD{" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                id="route_plan"
                                type="file"
                                name="route_plan"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                  handleFileChange(e, "route_plan", 1, props);
                                  props.setFieldTouched(
                                    "route_plan",
                                    true,
                                    true,
                                  );
                                }}
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "route_plan",
                                    true,
                                    true,
                                  )
                                }
                              />
                              {compressionErrors[1] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[1]}
                                </div>
                              )}
                              {props.touched.route_plan &&
                              props.errors.route_plan ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.route_plan}
                                </div>
                              ) : null}
                            </div>

                            {isUpdate && uploadedFiles?.route_plan && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.route_plan,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                            )}
                          </div>
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
              <Input
                type="checkbox"
                onChange={(e) => setIsProceed(e.target.checked)}
              />
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
            onClick={async () => {
              // Validate form first
              const errors = await formikRef.current?.validateForm();

              // Touch all fields to show errors
              formikRef.current?.setTouched({
                requestor_name: true,
                event_name: true,
                event_date_from: true,
                event_date_to: true,
                event_time_from: true,
                event_time_to: true,
                request_letter: true,
                route_plan: true,
              });

              // If there are errors, don't proceed
              if (errors && Object.keys(errors).length > 0) {
                console.log("Validation errors:", errors);
                return;
              }

              // If validation passes and proceed is checked
              if (proceed) {
                const params = {
                  ...formikRef.current.values,
                  special_permit_application_id: specialPermitApplicationId,
                };
                const formData = getFormData(params);

                handleSubmit(
                  {
                    url: isUpdate
                      ? "api/client/special-permit/parade/update"
                      : "api/client/special-permit/parade",
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
                  [toggleModal, toggleRefresh],
                );
              }
            }}
            disabled={!proceed || isCompressing}
          >
            {isUpdate ? "Update" : isCompressing ? "Compressing..." : "Submit"}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default ParadeModal;
