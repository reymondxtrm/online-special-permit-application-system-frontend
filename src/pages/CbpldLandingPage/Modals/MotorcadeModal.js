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
import { USER_PRIVACY } from "assets/data/data";

function MotorcadeModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [proceed, setIsProceed] = useState(false);

  const setProceedHandle = () => setIsProceed((prev) => !prev);

  // ---------------------------------------------------------
  // FETCH EXISTING MOTORCADE APPLICATION (UPDATE MODE)
  // ---------------------------------------------------------
  useEffect(() => {
    if (openModal && isUpdate) {
      axios
        .get("api/client/special-permit/get-single-motorcade", {
          params: { special_permit_application_id: specialPermitApplicationId },
        })
        .then((res) => {
          const data = res.data;

          setExistingData({
            requestor_name: data.requestor_name,
            event_name: data.event_name,
            event_date_from: data.event_date_from,
            event_date_to: data.event_date_to,
            number_of_participants: data.number_of_participants,
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
            surname: data.surname,
            first_name: data.first_name,
            middle_initial: data.middle_initial,
            suffix: data.suffix,
            sex: data.sex,
            email: data.email,
            contact_no: data.contact_no,
            province: data.province,
            city: data.city,
            barangay: data.barangay,
            additional_address: data.additional_address,
            or_no: data.or_no,
            paid_amount: data.paid_amount,
          });

          setUploadedFiles(data.uploaded_files || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

  // ---------------------------------------------------------
  // RESET WHEN CLOSED
  // ---------------------------------------------------------
  useEffect(() => {
    if (!openModal && formikRef.current) {
      formikRef.current.resetForm();
      setExistingData({});
      setUploadedFiles({});
      setIsProceed(false);
    }
  }, [openModal]);

  // Convert form values to FormData
  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, value);
    });
    return formData;
  };

  return (
    <>
      <Modal
        isOpen={openModal}
        toggle={() => {
          toggleModal();
          setIsProceed(false);
        }}
        fade
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
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
            {isUpdate ? "UPDATE MOTORCADE" : "MOTORCADE"}
          </p>
        </ModalHeader>

        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              type: "event",
              permit_type_id: "2",
              requestor_name: existingData.requestor_name || "",
              event_name: existingData.event_name || "",
              event_date_from: existingData.event_date_from || "",
              event_date_to: existingData.event_date_to || "",
              number_of_participants: existingData.number_of_participants || "",
              event_time_from: existingData.event_time_from || "",
              event_time_to: existingData.event_time_to || "",
              surname: existingData.surname || "",
              first_name: existingData.first_name || "",
              middle_initial: existingData.middle_initial || "",
              suffix: existingData.suffix || "",
              sex: existingData.sex || "",
              email: existingData.email || "",
              contact_no: existingData.contact_no || "",
              province: existingData.province || "",
              city: existingData.city || "",
              barangay: existingData.barangay || "",
              additional_address: existingData.additional_address || "",
              request_letter: "",
              route_plan: "",
              official_receipt: "",
              or_no: existingData.or_no || "",
              paid_amount: existingData.paid_amount || "",
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                {/* NAME */}
                <FormGroup>
                  <Label>Name of Requestor / Organization</Label>
                  <Input
                    name="requestor_name"
                    value={props.values.requestor_name}
                    onChange={props.handleChange}
                  />
                </FormGroup>

                {/* EVENT */}
                <FormGroup>
                  <Label>Name of Event</Label>
                  <Input
                    name="event_name"
                    value={props.values.event_name}
                    onChange={props.handleChange}
                  />
                </FormGroup>

                {/* VEHICLES */}
                <FormGroup>
                  <Label>Maximum Number of Vehicles</Label>
                  <Input
                    name="number_of_participants"
                    type="number"
                    value={props.values.number_of_participants}
                    onChange={props.handleChange}
                  />
                </FormGroup>

                {/* DATES */}
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Start Date</Label>
                      <Input
                        name="event_date_from"
                        type="date"
                        value={props.values.event_date_from}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>End Date</Label>
                      <Input
                        name="event_date_to"
                        type="date"
                        value={props.values.event_date_to}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* TIMES */}
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Start Time</Label>
                      <Input
                        name="event_time_from"
                        type="time"
                        value={props.values.event_time_from}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>End Time</Label>
                      <Input
                        name="event_time_to"
                        type="time"
                        value={props.values.event_time_to}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* FILES */}
                <FormGroup>
                  <Label>Request Letter (Stamped)</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      props.setFieldValue(
                        "request_letter",
                        e.currentTarget.files[0]
                      )
                    }
                  />
                  {isUpdate && uploadedFiles?.request_letter && (
                    <Button color="primary" className="mt-1">
                      View Existing
                    </Button>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Route Plan (Approved by CTTMD)</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      props.setFieldValue(
                        "route_plan",
                        e.currentTarget.files[0]
                      )
                    }
                  />
                  {isUpdate && uploadedFiles?.route_plan && (
                    <Button color="primary" className="mt-1">
                      View Existing
                    </Button>
                  )}
                </FormGroup>
              </Form>
            )}
          </Formik>

          {/* Privacy Notice */}
          <div className="d-flex gap-2 mt-2">
            <Input type="checkbox" onClick={setProceedHandle} />
            <p>{USER_PRIVACY}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            style={{ backgroundColor: "#1a56db", color: "white" }}
            disabled={!proceed}
            onClick={() => {
              const formik = {
                ...formikRef.current.values,
                special_permit_application_id: specialPermitApplicationId,
              };
              const formData = getFormData(formik);

              handleSubmit(
                {
                  url: isUpdate
                    ? "api/client/special-permit/motorcade/update"
                    : "api/client/special-permit/motorcade",
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
    </>
  );
}

export default MotorcadeModal;
