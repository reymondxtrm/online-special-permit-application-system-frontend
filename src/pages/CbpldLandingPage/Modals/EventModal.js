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
} from "reactstrap";

import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import { EVENT_TYPES, USER_PRIVACY } from "assets/data/data";
import * as Yup from "yup";

function EventModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const [proceed, setIsProceed] = useState(false);
  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    if (openModal && isUpdate) {
      axios
        .get("api/client/get-single-occupational/permit-application", {
          params: { special_permit_application_id: specialPermitApplicationId },
        })
        .then((res) => {
          const data = res.data;

          setExistingData({
            requestor_name: data.requestor_name,
            event_name: data.event_name,
            event_date_from: data.event_date_from,
            event_date_to: data.event_date_to,
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
            event_type: data.event_type,
          });

          setUploadedFiles(data.uploaded_files || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

  useEffect(() => {
    if (!openModal) {
      setExistingData({});
      setUploadedFiles({});
      setIsProceed(false);
    }
  }, [openModal]);

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

  const validationSchema = Yup.object().shape({
    requestor_name: Yup.string().required("Required"),
    event_name: Yup.string().required("Required"),
    event_date_from: Yup.date().required("Required"),
    event_date_to: Yup.date().required("Required"),
    event_time_from: Yup.string().required("Required"),
    event_time_to: Yup.string().required("Required"),
  });

  const setProceedHandle = () => setIsProceed((prev) => !prev);

  return (
    <Modal
      isOpen={openModal}
      toggle={() => {
        toggleModal();
        setIsProceed(false);
      }}
      backdrop="static"
      className="modal-dialog-centered"
      size="m"
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
          validationSchema={validationSchema}
          initialValues={{
            type: "event",
            requestor_name: existingData.requestor_name || "",
            event_name: existingData.event_name || "",
            event_date_from: existingData.event_date_from || "",
            event_date_to: existingData.event_date_to || "",
            event_time_from: existingData.event_time_from || "",
            event_time_to: existingData.event_time_to || "",
            event_type: existingData.event_type || "",
            request_letter: "",
            route_plan: "",
            sworn_statement: "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form>
              <Row>
                <Col>
                  {/* Requestor */}
                  <FormGroup>
                    <Label>Name of Requestor / Organization</Label>
                    <Input
                      name="requestor_name"
                      value={props.values.requestor_name}
                      onChange={props.handleChange}
                      placeholder="Enter Name"
                    />
                  </FormGroup>

                  {/* Event Name */}
                  <FormGroup>
                    <Label>Name of Event</Label>
                    <Input
                      name="event_name"
                      value={props.values.event_name}
                      onChange={props.handleChange}
                      placeholder="Enter Event Name"
                    />
                  </FormGroup>

                  {/* Date */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          name="event_date_from"
                          value={props.values.event_date_from}
                          onChange={props.handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          name="event_date_to"
                          value={props.values.event_date_to}
                          onChange={props.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Time */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          name="event_time_from"
                          value={props.values.event_time_from}
                          onChange={props.handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          name="event_time_to"
                          value={props.values.event_time_to}
                          onChange={props.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* FILE INPUTS */}
                  {[
                    {
                      key: "request_letter",
                      label: "Request Letter (Stamped)",
                    },
                    { key: "route_plan", label: "Route Plan (Approved)" },
                    {
                      key: "sworn_statement",
                      label: "Sworn Statement (if proceeds are donated)",
                    },
                  ].map((file) => (
                    <FormGroup key={file.key}>
                      <Label>{file.label}</Label>
                      <Input
                        type="file"
                        name={file.key}
                        onChange={(e) =>
                          props.setFieldValue(
                            file.key,
                            e.currentTarget.files[0]
                          )
                        }
                        accept="image/*"
                      />

                      {isUpdate && uploadedFiles[file.key] && (
                        <Button color="primary" size="sm" className="mt-1">
                          View Existing
                        </Button>
                      )}
                    </FormGroup>
                  ))}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

        {/* Privacy */}
        <div className="d-flex gap-2 mt-2">
          <Input type="checkbox" onClick={setProceedHandle} />
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
          disabled={!proceed}
          onClick={() => {
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
              [toggleModal]
            );

            setIsProceed(false);
          }}
        >
          {isUpdate ? "Update" : "Submit"}
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
  );
}

export default EventModal;
