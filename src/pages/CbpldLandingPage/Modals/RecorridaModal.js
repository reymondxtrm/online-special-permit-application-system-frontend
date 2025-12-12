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

function RecorridaModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId = null,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const setProceedHandle = () => setIsProceed((prev) => !prev);

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
        formData.append(key, val);
      }
    });
    return formData;
  };

  // FETCH EXISTING FOR UPDATE
  useEffect(() => {
    if (isUpdate && openModal && specialPermitApplicationId) {
      fetchExistingRecorrida();
    }
  }, [isUpdate, openModal, specialPermitApplicationId]);

  const fetchExistingRecorrida = async () => {
    try {
      setLoadingExisting(true);

      const res = await axios.get(
        "api/client/get-single-occupational/permit-application",
        { params: { id: specialPermitApplicationId } }
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
        surname: d.surname || "",
        first_name: d.first_name || "",
        middle_initial: d.middle_initial || "",
        suffix: d.suffix || "",
        sex: d.sex || "",
        email: d.email || "",
        contact_no: d.contact_no || "",
        province: d.province || "",
        city: d.city || "",
        barangay: d.barangay || "",
        additional_address: d.additional_address || "",

        request_letter: d.request_letter || null,
        route_plan: d.route_plan || null,
        official_receipt: d.official_receipt || null,
        or_no: d.or_no || "",
        paid_amount: d.paid_amount || "",
      });

      setLoadingExisting(false);
    } catch (err) {
      console.error(err);
      setLoadingExisting(false);
    }
  };

  const initialValues = {
    type: "event",
    requestor_name: existingData?.requestor_name || "",
    event_name: existingData?.event_name || "",
    event_date_from: existingData?.event_date_from || "",
    event_date_to: existingData?.event_date_to || "",
    event_time_from: existingData?.event_time_from || "",
    event_time_to: existingData?.event_time_to || "",
    number_of_participants: existingData?.number_of_participants || 0,

    surname: existingData?.surname || "",
    first_name: existingData?.first_name || "",
    middle_initial: existingData?.middle_initial || "",
    suffix: existingData?.suffix || "",
    sex: existingData?.sex || "",
    email: existingData?.email || "",
    contact_no: existingData?.contact_no || "",
    province: existingData?.province || "",
    city: existingData?.city || "",
    barangay: existingData?.barangay || "",
    additional_address: existingData?.additional_address || "",

    request_letter: null,
    route_plan: null,
    official_receipt: null,

    or_no: existingData?.or_no || "",
    paid_amount: existingData?.paid_amount || "",
  };

  if (!openModal) return null;

  return (
    <Modal
      isOpen={openModal}
      toggle={() => {
        toggleModal();
        setIsProceed(false);
      }}
      backdrop="static"
      size="m"
      className="modal-dialog-centered"
      style={{ overflowY: "auto" }}
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
            margin: 0,
            color: "#368be0",
          }}
        >
          RECORRIDA {isUpdate ? "(UPDATE)" : ""}
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
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Row>
                  <Col>
                    {/* Requestor Name */}
                    <FormGroup>
                      <Label>Name of Requestor / Organization</Label>
                      <Input
                        name="requestor_name"
                        onChange={props.handleChange}
                        value={props.values.requestor_name}
                      />
                    </FormGroup>

                    {/* Event Name */}
                    <FormGroup>
                      <Label>Name of Event</Label>
                      <Input
                        name="event_name"
                        onChange={props.handleChange}
                        value={props.values.event_name}
                      />
                    </FormGroup>

                    {/* Vehicles */}
                    <FormGroup>
                      <Label>Maximum Number of Vehicles</Label>
                      <Input
                        type="number"
                        name="number_of_participants"
                        value={props.values.number_of_participants}
                        onChange={props.handleChange}
                      />
                    </FormGroup>

                    {/* Dates */}
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

                    {/* Times */}
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

                    {/* Request Letter */}
                    <FormGroup>
                      <Label>Request Letter</Label>

                      {/* {isUpdate && existingData?.request_letter && (
                        <a
                          href={existingData.request_letter}
                          target="_blank"
                          className="text-primary d-block mb-2"
                        >
                          View Existing
                        </a>
                      )} */}

                      <Input
                        type="file"
                        onChange={(e) =>
                          props.setFieldValue(
                            "request_letter",
                            e.currentTarget.files[0]
                          )
                        }
                      />
                    </FormGroup>

                    {/* Route Plan */}
                    <FormGroup>
                      <Label>Route Plan (CTTMD Approved)</Label>

                      {/* {isUpdate && existingData?.route_plan && (
                        <a
                          href={existingData.route_plan}
                          target="_blank"
                          className="text-primary d-block mb-2"
                        >
                          View Existing
                        </a>
                      )} */}

                      <Input
                        type="file"
                        onChange={(e) =>
                          props.setFieldValue(
                            "route_plan",
                            e.currentTarget.files[0]
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        )}

        {/* Privacy */}
        <div className="d-flex gap-2 mt-3">
          <Input type="checkbox" onClick={setProceedHandle} />
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
          disabled={!proceed}
          onClick={() => {
            const formik = formikRef.current.values;
            const formData = getFormData(formik);

            const url = isUpdate
              ? "api/client/special-permit/recorrida/update"
              : "api/client/special-permit/recorrida";

            if (isUpdate) {
              formData.append("id", specialPermitApplicationId);
            }

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

export default RecorridaModal;
