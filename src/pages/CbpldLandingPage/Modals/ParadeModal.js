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
  FormFeedback,
} from "reactstrap";

import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import { USER_PRIVACY } from "assets/data/data";
import axios from "axios";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import useGetImage from "hooks/Common/useGetImage";
import * as Yup from "yup";

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
            event_date_to: data.event_to,
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
          });
          setUploadedFiles(data.uploaded_file || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

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
  const setProceedHandle = () => {
    setIsProceed((prev) => !prev);
  };
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const ParadeSchema = Yup.object().shape({
    requestor_name: Yup.string().required(
      "Requestor / Organization is required"
    ),

    event_name: Yup.string().required("Event name is required"),

    event_date_from: Yup.date().required("Start date is required"),

    event_date_to: Yup.date()
      .min(Yup.ref("event_date_from"), "End date must be after start date")
      .required("End date is required"),

    event_time_from: Yup.string().required("Start time is required"),

    event_time_to: Yup.string().required("End time is required"),

    request_letter: Yup.mixed().when("$isUpdate", {
      is: false,
      then: (schema) => schema.required("Request letter is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    route_plan: Yup.mixed().when("$isUpdate", {
      is: false,
      then: (schema) => schema.required("Route plan is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
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
        toggle={() => {
          toggleModal();
          setIsProceed(false);
        }}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{
          overflowY: "auto",
        }}
        unmountOnClose
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
            setIsProceed(false);
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
            {isUpdate ? "UPDATE PARADE" : "PARADE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            validationSchema={ParadeSchema}
            enableReinitialize
            initialValues={{
              type: "parade",
              permit_type_id: "parade",
              requestor_name: existingData?.requestor_name || "",
              event_name: existingData?.event_name || "",
              event_date_from: existingData?.event_date_from || "",
              event_date_to: existingData?.event_to || "",
              event_time_from: existingData?.event_time_from || "",
              event_time_to: existingData?.event_time_to || "",
              route_plan: "",
              request_letter: "",
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
                            Name of Requestor / Organization
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
                          <Label for="nameOfEvent">Name of Event</Label>
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
                          <Label for="dateOfEventFrom">Start Date</Label>
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
                          <Label for="dateOfEventTo">End Date</Label>

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
                          <Label for="timeOfEventFrom">Start Time</Label>
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
                          <Label for="timeOfEventTo">End Time</Label>
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
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="requestLetter">
                            Request Letter Stamped (Received by Office of the
                            City Mayor)
                          </Label>
                          <div className="d-flex gap-2">
                            <Input
                              type="file"
                              name="request_letter"
                              accept="image/*"
                              onChange={(e) =>
                                props.setFieldValue(
                                  "request_letter",
                                  e.currentTarget.files[0]
                                )
                              }
                              onBlur={() =>
                                props.setFieldTouched("request_letter", true)
                              }
                              invalid={
                                props.touched.request_letter &&
                                Boolean(props.errors.request_letter)
                              }
                            />
                            <FormFeedback>
                              {props.errors.request_letter}
                            </FormFeedback>

                            {isUpdate && uploadedFiles?.request_letter && (
                              <Button
                                color="primary"
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
                            Route Plan approved by CTTMD
                          </Label>
                          <div className="d-flex gap-2">
                            <Input
                              type="file"
                              name="route_plan"
                              accept="image/*"
                              onChange={(e) =>
                                props.setFieldValue(
                                  "route_plan",
                                  e.currentTarget.files[0]
                                )
                              }
                              onBlur={() =>
                                props.setFieldTouched("route_plan", true)
                              }
                              invalid={
                                props.touched.route_plan &&
                                Boolean(props.errors.route_plan)
                              }
                            />
                            <FormFeedback>
                              {props.errors.route_plan}
                            </FormFeedback>

                            {isUpdate && uploadedFiles?.route_plan && (
                              <Button
                                color="primary"
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
              const params = {
                ...formikRef.current.values,
                special_permit_application_id: specialPermitApplicationId,
              };
              const formData = getFormData(params);
              if (proceed) {
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
                  [toggleModal, toggleRefresh]
                );
                setIsProceed(false);
              }
            }}
            disabled={!proceed}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggleModal();
              setIsProceed(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default ParadeModal;
