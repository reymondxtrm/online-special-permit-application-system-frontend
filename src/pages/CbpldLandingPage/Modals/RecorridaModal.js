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
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";
import useGetImage from "hooks/Common/useGetImage";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import * as Yup from "yup";
import useImageCompressor from "hooks/Common/useImageCompressor";

function RecorridaModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId = null,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const { currentImage, isFetching, getImageHandle } = useGetImage();
  const [uploadedFiles, setUploadedFiles] = useState({});
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

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      const val = object[key];

      if (val instanceof File || val instanceof Blob) {
        formData.append(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((item) => formData.append(`${key}[]`, item));
      } else if (typeof val === "object" && val !== null) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val ?? "");
      }
    });
    return formData;
  };
  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const compressed = await handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(fieldName, compressed);
      props.setFieldTouched(fieldName, true, true);
    }
  };

  useEffect(() => {
    if (isUpdate && openModal) {
      const fetchExistingRecorrida = async () => {
        setLoadingExisting(true);
        try {
          const res = await axios.get(
            "api/client/get-single-permmit-application",
            {
              params: {
                special_permit_application_id: specialPermitApplicationId,
              },
            }
          );
          const d = res.data.data;
          setExistingData({
            requestor_name: d.requestor_name || "",
            event_name: d.event_name || "",
            event_date_from: d.event_date_from || "",
            event_date_to: d.event_date_to || "",
            event_time_from: d.event_time_from || "",
            event_time_to: d.event_time_to || "",
            number_of_participants: d.number_of_participants || 0,
          });
          setUploadedFiles(d.uploaded_file || {});
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingExisting(false);
        }
      };
      fetchExistingRecorrida();
    }
  }, [isUpdate, openModal, specialPermitApplicationId]);

  useEffect(() => {
    if (!openModal) {
      setExistingData(null);
      setUploadedFiles({});
      setIsProceed(false);
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }
  }, [openModal]);

  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };

  const IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

  const fileValidationRequired = Yup.mixed()
    .required("This file is required")
    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    );

  const fileValidationOptional = Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    );

  const RecorridaSchema = Yup.object().shape({
    requestor_name: Yup.string()
      .trim()
      .required("Name of Requestor / Organization is required"),

    event_name: Yup.string().trim().required("Name of Event is required"),

    number_of_participants: Yup.number()
      .typeError("Maximum number of vehicles must be a number")
      .min(1, "Must be at least 1 vehicle")
      .required("Maximum number of vehicles is required"),

    event_date_from: Yup.date().required("Start date is required"),

    event_date_to: Yup.date()
      .required("End date is required")
      .min(
        Yup.ref("event_date_from"),
        "End date must be after or equal to start date"
      ),

    event_time_from: Yup.string().required("Start time is required"),

    event_time_to: Yup.string().required("End time is required"),

    request_letter: isUpdate ? fileValidationOptional : fileValidationRequired,

    route_plan: isUpdate ? fileValidationOptional : fileValidationRequired,
  });

  const initialValues = {
    type: "event",
    requestor_name: existingData?.requestor_name || "",
    event_name: existingData?.event_name || "",
    event_date_from: existingData?.event_date_from || "",
    event_date_to: existingData?.event_date_to || "",
    event_time_from: existingData?.event_time_from || "",
    event_time_to: existingData?.event_time_to || "",
    number_of_participants: existingData?.number_of_participants || "",
    request_letter: null,
    route_plan: null,
  };

  if (!openModal) return null;

  return (
    <>
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
              margin: 0,
              color: "#368be0",
            }}
          >
            {isUpdate ? "UPDATE RECORRIDA" : "RECORRIDA"}
          </p>
        </ModalHeader>

        <ModalBody style={{ overflowX: "auto" }}>
          {loadingExisting ? (
            <p>Loading...</p>
          ) : (
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              enableReinitialize={true}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={handleSubmit}
              validationSchema={RecorridaSchema}
            >
              {(props) => (
                <Form>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>
                          Name of Requestor / Organization{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="requestor_name"
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

                      <FormGroup>
                        <Label>
                          Name of Event <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="event_name"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.event_name}
                          invalid={
                            props.touched.event_name &&
                            Boolean(props.errors.event_name)
                          }
                        />
                        <FormFeedback>{props.errors.event_name}</FormFeedback>
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          Maximum Number of Vehicles{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          name="number_of_participants"
                          value={props.values.number_of_participants}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          invalid={
                            props.touched.number_of_participants &&
                            Boolean(props.errors.number_of_participants)
                          }
                        />
                        <FormFeedback>
                          {props.errors.number_of_participants}
                        </FormFeedback>
                      </FormGroup>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>
                              Start Date <span className="text-danger">*</span>
                            </Label>
                            <Input
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
                            <Label>
                              End Date <span className="text-danger">*</span>
                            </Label>
                            <Input
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
                            <Label>
                              Start Time <span className="text-danger">*</span>
                            </Label>
                            <Input
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
                            <Label>
                              End Time <span className="text-danger">*</span>
                            </Label>
                            <Input
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

                      {/* Request Letter */}
                      <FormGroup>
                        <Label>
                          Request Letter{" "}
                          {!isUpdate && <span className="text-danger">*</span>}
                        </Label>
                        <div className="d-flex gap-2 align-items-start">
                          <div className="flex-grow-1">
                            <Input
                              type="file"
                              name="request_letter"
                              accept="image/*"
                              onChange={(e) => {
                                handleFileChange(e, "request_letter", 0, props);
                                props.setFieldTouched(
                                  "request_letter",
                                  true,
                                  true
                                );
                              }}
                              onBlur={() =>
                                props.setFieldTouched(
                                  "request_letter",
                                  true,
                                  true
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

                      <FormGroup>
                        <Label>
                          Route Plan (CTTMD Approved){" "}
                          {!isUpdate && <span className="text-danger">*</span>}
                        </Label>
                        <div className="d-flex gap-2 align-items-start">
                          <div className="flex-grow-1">
                            <Input
                              type="file"
                              name="route_plan"
                              accept="image/*"
                              onChange={(e) => {
                                handleFileChange(e, "route_plan", 1, props);
                                props.setFieldTouched("route_plan", true, true);
                              }}
                              onBlur={() =>
                                props.setFieldTouched("route_plan", true, true)
                              }
                              disabled={isCompressing}
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
                </Form>
              )}
            </Formik>
          )}
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
              fontWeight: 600,
              color: "white",
            }}
            disabled={!proceed || isCompressing}
            onClick={async () => {
              // Validate form first
              const errors = await formikRef.current?.validateForm();

              // Touch all fields to show errors
              formikRef.current?.setTouched({
                requestor_name: true,
                event_name: true,
                number_of_participants: true,
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

                const url = isUpdate
                  ? "api/client/special-permit/recorrida/update"
                  : "api/client/special-permit/recorrida";

                handleSubmit(
                  {
                    url,
                    headers: { "Content-Type": "multipart/form-data" },
                    message: {
                      title: isUpdate
                        ? "Update Recorrida?"
                        : "Are you sure you want to submit?",
                      failedTitle: "FAILED",
                      success: isUpdate ? "Updated successfully!" : "Success!",
                      error: "Unknown error occurred",
                    },
                    params: formData,
                  },
                  [],
                  [toggleModal, toggleRefresh]
                );
              }
            }}
          >
            {isUpdate ? "Update" : isCompressing ? "Compressing..." : "Submit"}
          </Button>

          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default RecorridaModal;
