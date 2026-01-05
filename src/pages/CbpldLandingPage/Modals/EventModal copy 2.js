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
import * as Yup from "yup";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-simple-image-viewer";
import useImageCompressor from "hooks/Common/useImageCompressor";

function EventModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
  specialPermitType,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);
  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { getImageHandle, currentImage, isFetching } = useGetImage();
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

  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };

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
            event_date_to: data.event_date_to,
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
          });

          setUploadedFiles(data.uploaded_file || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

  useEffect(() => {
    if (!openModal) {
      setExistingData({});
      setUploadedFiles({});
    }
  }, [openModal]);
  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const compressed = await handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(fieldName, compressed);
      props.setFieldTouched(fieldName, true, true);
    }
  };

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File) {
        formData.append(key, object[key]);
      } else {
        formData.append(key, object[key] ?? "");
      }
    });
    return formData;
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

  const validationSchema = Yup.object().shape({
    requestor_name: Yup.string().required("Requestor name is required"),
    event_name: Yup.string().required("Event name is required"),
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
    sworn_statement: fileValidationOptional, // Always optional
  });

  return (
    <React.Fragment>
      {isViewerOpen && !isFetching && currentImage && (
        <ImageViewer
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
        className="modal-dialog-centered"
        size="m"
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
            {isUpdate ? "UPDATE EVENT" : "EVENT"}
          </p>
        </ModalHeader>

        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={validationSchema}
            initialValues={{
              type: "event",
              requestor_name: existingData?.requestor_name || "",
              event_name: existingData?.event_name || "",
              event_date_from: existingData?.event_date_from || "",
              event_date_to: existingData?.event_date_to || "",
              event_time_from: existingData?.event_time_from || "",
              event_time_to: existingData?.event_time_to || "",
              event_type: existingData?.event_type || "",
              request_letter: null,
              route_plan: null,
              sworn_statement: null,
              special_permit_application_id: specialPermitApplicationId,
            }}
            onSubmit={handleSubmit}
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
                        value={props.values.requestor_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        invalid={
                          props.touched.requestor_name &&
                          Boolean(props.errors.requestor_name)
                        }
                      />
                      <FormFeedback>{props.errors.requestor_name}</FormFeedback>
                    </FormGroup>

                    {/* Event Name */}
                    <FormGroup>
                      <Label>
                        Name of Event <span className="text-danger">*</span>
                      </Label>
                      <Input
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

                    {/* Time */}
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

                    {[
                      {
                        key: "request_letter",
                        label: "Request Letter (Stamped)",
                        required: !isUpdate,
                      },
                      {
                        key: "route_plan",
                        label: "Route Plan (Approved)",
                        required: !isUpdate,
                      },
                      {
                        key: "sworn_statement",
                        label: "Sworn Statement (if proceeds are donated)",
                        required: false,
                      },
                    ].map((file) => (
                      <FormGroup key={file.key}>
                        <Label>
                          {file.label}
                          {file.required && (
                            <span className="text-danger"> *</span>
                          )}
                        </Label>
                        <div className="d-flex gap-2 align-items-start">
                          <div className="flex-grow-1">
                            <Input
                              type="file"
                              name={file.key}
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.currentTarget.files[0] || null;
                                props.setFieldValue(file.key, selectedFile);
                                props.setFieldTouched(file.key, true, true);
                                handleFileChange(e, file.key, 0, props);
                              }}
                              onBlur={() =>
                                props.setFieldTouched(file.key, true, true)
                              }
                            />
                            {props.touched[file.key] &&
                            props.errors[file.key] ? (
                              <div
                                className="text-danger mt-1"
                                style={{ fontSize: "0.875rem" }}
                              >
                                {props.errors[file.key]}
                              </div>
                            ) : null}
                          </div>

                          {isUpdate && uploadedFiles?.[file.key] && (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                getImageHandle({
                                  path: uploadedFiles?.[file.key],
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
                    ))}
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
              color: "white",
              fontWeight: 600,
            }}
            disabled={!proceed || isCompressing}
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
                sworn_statement: true,
              });

              // If there are errors, don't proceed
              if (errors && Object.keys(errors).length > 0) {
                console.log("Validation errors:", errors);
                return;
              }

              // If validation passes and proceed is checked
              if (proceed) {
                const formik = formikRef.current.values;
                const formData = getFormData(formik);

                handleSubmit(
                  {
                    url: isUpdate
                      ? "api/client/special-permit/event/update"
                      : "api/client/special-permit/event",
                    headers: { "Content-Type": "multipart/form-data" },
                    message: {
                      title: "Are you sure you want to Proceed?",
                      failedTitle: "FAILED",
                      success: "Success!",
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
            {isUpdate ? "Update" : "Submit"}
          </Button>

          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default EventModal;
