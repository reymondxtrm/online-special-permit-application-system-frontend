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
import { USER_PRIVACY } from "assets/data/data";

function RecorridaModal({ openModal, toggleModal }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);

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
  const setProceedHandle = () => {
    setIsProceed((prev) => !prev);
  };

  return (
    <React.Fragment>
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
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
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
            {"RECORRIDA"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              type: "event",
              requestor_name: "sample",
              event_name: "sample",
              event_date_from: "2024-10-19",
              event_date_to: "2024-10-19",
              event_time_from: "sample",
              event_time_to: "sample",
              number_of_participants: 0,
              surname: "asa",
              first_name: "as",
              middle_initial: "asa",
              suffix: "as",
              sex: "male",
              email: "ctian1019@gmail.com",
              contact_no: "09461424574",
              province: "121",
              city: "12121",
              barangay: "12121",
              additional_address: "asdasdsadas",
              request_letter: "",
              route_plan: "",
              official_receipt: "",
              or_no: "asasasasa12121",
              paid_amount: "12121",
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
                            name={`requestor_name`}
                            placeholder="Enter Name of Requestor / Organization"
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

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
                      <Col md={12}>
                        <FormGroup>
                          <Label for="nameOfEvent">
                            Maximum Number of Vehicles
                          </Label>
                          <Input
                            id="numberOfParticipants"
                            name={`number_of_participants`}
                            placeholder="0"
                            onChange={props.handleChange}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">Date of Event</Label>
                          <Input
                            id="date"
                            name={`event_date_from`}
                            type="date"
                            onChange={props.handleChange}
                            placeholder="Enter Date"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="date">Date of Event</Label>
                          <Input
                            id="date"
                            name={`event_date_to`}
                            type="date"
                            onChange={props.handleChange}
                            placeholder="Enter Date"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="timeOfEvent">Time of Event</Label>
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
                          <Label for="timeOfEvent">Time of Event</Label>
                          <Input
                            id="timeOfEvent"
                            name={`event_time_to`}
                            type="time"
                            onChange={props.handleChange}
                          />
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
                            accept="image/*"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="exampleFile">
                            Route Plan approved by CTTMD
                          </Label>
                          <Input
                            id="exampleFile"
                            type="file"
                            name={"route_plan"}
                            onChange={(event) => {
                              console.log(event);
                              props.setFieldValue(
                                "route_plan",
                                event.currentTarget.files[0]
                              );
                            }}
                            accept="image/*"
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
              const formData = getFormData(formik);
              if (proceed) {
                handleSubmit(
                  {
                    url: "api/client/special-permit/recorrida",
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

export default RecorridaModal;
