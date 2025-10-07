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
import { EVENT_TYPES, USER_PRIVACY } from "assets/data/data";
import * as Yup from "yup";

function EventModal({ openModal, toggleModal }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);

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
  const validationSchema = Yup.object().shape({
    requestor_name: Yup.string().required(),
    event_name: Yup.string().required(),
    event_date_from: Yup.date().required(),
    event_date_to: Yup.date().required(),
    event_time_from: Yup.string().required(),
    event_time_to: Yup.string().required(),
    // event_type: Yup.string().required(),
    request_letter: Yup.mixed()
      .required("An image is required")
      .test("fileSize", "Image size must be less than 2MB", (value) => {
        return value && value.size <= IMAGE_SIZE;
      })
      .test(
        "fileFormat",
        "Only jpg, jpeg, png, gif, webp are allowed",
        (value) => {
          return value && SUPPORTED_IMAGE_FORMATS.includes(value.type);
        }
      ),
    route_plan: Yup.mixed()
      .required("An image is required")
      .test("fileSize", "Image size must be less than 2MB", (value) => {
        return value && value.size <= IMAGE_SIZE;
      })
      .test(
        "fileFormat",
        "Only jpg, jpeg, png, gif, webp are allowed",
        (value) => {
          return value && SUPPORTED_IMAGE_FORMATS.includes(value.type);
        }
      ),
  });

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
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
            {"EVENT"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={{
              type: "event",
              requestor_name: "sample",
              event_name: "sample",
              event_date_from: "2024-10-19",
              event_date_to: "2024-10-19",
              event_time_from: "",
              event_time_to: "",
              event_type: "",
              request_letter: "",
              route_plan: null,
              sworn_statement: "",
            }}
            validationSchema={validationSchema}
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
                            name={`requestor_name`}
                            placeholder="Enter Name of Requestor / Organization"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label>Type of Event</Label>
                          <Select
                            options={EVENT_TYPES}
                            onChange={(selected) => {
                              props.setFieldValue("event_type", selected);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="nameOfEvent">Name of Event</Label>
                          <Input
                            id="nameOfEvent"
                            name={`event_name`}
                            placeholder="Enter Name of Event"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">Start Date</Label>
                          <Input
                            id="date"
                            name={`event_date_from`}
                            type="date"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">End Date</Label>
                          <Input
                            id="date"
                            name={`event_date_to`}
                            type="date"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="timeOfEvent">Start Tine</Label>
                          <Input
                            id="timeOfEvent"
                            name={`event_time_from`}
                            type="time"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="timeOfEvent">End Time</Label>
                          <Input
                            id="timeOfEvent"
                            name={`event_time_to`}
                            type="time"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row></Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="requestLetter">
                            Request Letter Stamped (Received by Office of the
                            City Mayor)
                          </Label>
                          <Input
                            id="requestLetter"
                            name={"request_letter"}
                            type="file"
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "request_letter",
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
                          <Label for="requestLetter">
                            Route Plan approved by the CTTMD
                          </Label>
                          <Input
                            id="routePlan"
                            name={"route_plan"}
                            type="file"
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "route_plan",
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
                          <Label for="requestLetter">
                            Sworn Statement (If all the proceeds are to be
                            donated for charity).
                          </Label>
                          <Input
                            id="swornStatement"
                            name={"sworn_statement"}
                            type="file"
                            onChange={(event) => {
                              props.setFieldValue(
                                "sworn_statement",
                                event.currentTarget.files[0]
                              );
                            }}
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
              console.log(formik);
              const formData = getFormData(formik);
              handleSubmit(
                {
                  url: "api/client/special-permit/event",
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
            disabled={!proceed}
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

export default EventModal;
