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
import ImageViewer from "react-simple-image-viewer";
import * as Yup from "yup";

function MotorcadeModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [proceed, setIsProceed] = useState(false);
  const { getImageHandle, isFetching, currentImage } = useGetImage();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (openModal && isUpdate) {
      axios
        .get("api/client/get-single-permmit-application", {
          params: { special_permit_application_id: specialPermitApplicationId },
        })
        .then((res) => {
          const data = res.data.data;
          setExistingData({
            requestor_name: data.requestor_name,
            event_name: data.event_name,
            event_date_from: data.event_date_from,
            event_date_to: data.event_date_to,
            number_of_participants: data.number_of_participants,
            event_time_from: data.event_time_from,
            event_time_to: data.event_time_to,
          });

          setUploadedFiles(data.uploaded_file || {});
        });
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

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
      const value = object[key];
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, value);
    });
    return formData;
  };
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const MotorcadeSchema = Yup.object().shape({
    requestor_name: Yup.string()
      .trim()
      .required("Name of Requestor / Organization is required"),

    event_name: Yup.string().trim().required("Name of Event is required"),

    number_of_participants: Yup.number()
      .typeError("Maximum number of vehicles must be a number")
      .min(1, "Must be at least 1 vehicle")
      .required("Maximum number of vehicles is required"),

    event_date_from: Yup.string().required("Start date is required"),

    event_date_to: Yup.string()
      .required("End date is required")
      .test(
        "date-check",
        "End date must be later than start date",
        function (value) {
          const { event_date_from } = this.parent;
          if (!event_date_from || !value) return true;
          return new Date(value) >= new Date(event_date_from);
        }
      ),

    event_time_from: Yup.string().required("Start time is required"),

    event_time_to: Yup.string().required("End time is required"),

    request_letter: Yup.mixed().when("$isUpdate", {
      is: false,
      then: Yup.mixed().required("Request letter is required"),
      otherwise: Yup.mixed().nullable(),
    }),

    route_plan: Yup.mixed().when("$isUpdate", {
      is: false,
      then: Yup.mixed().required("Route plan is required"),
      otherwise: Yup.mixed().nullable(),
    }),
  });

  return (
    <>
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
        toggle={() => {
          toggleModal();
        }}
        fade
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
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
            validationSchema={MotorcadeSchema}
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
              request_letter: "",
              route_plan: "",
              official_receipt: "",
              or_no: existingData.or_no || "",
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <FormGroup>
                  <Label>Name of Requestor / Organization</Label>
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

                <FormGroup>
                  <Label>Name of Event</Label>
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

                <FormGroup>
                  <Label>Maximum Number of Vehicles</Label>
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
                      <Label>Start Date</Label>
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
                      <Label>End Date</Label>
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
                      <FormFeedback>{props.errors.event_date_to}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Start Time</Label>
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
                      <Label>End Time</Label>
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
                </Row>

                <FormGroup>
                  <Label>Request Letter (Stamped)</Label>
                  <div className="d-flex gap-2">
                    <Input
                      type="file"
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
                    <FormFeedback>{props.errors.request_letter}</FormFeedback>

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

                <FormGroup>
                  <Label>Route Plan (Approved by CTTMD)</Label>
                  <div className="d-flex gap-2">
                    <Input
                      type="file"
                      onChange={(e) =>
                        props.setFieldValue(
                          "route_plan",
                          e.currentTarget.files[0]
                        )
                      }
                      onBlur={() => props.setFieldTouched("route_plan", true)}
                      invalid={
                        props.touched.route_plan &&
                        Boolean(props.errors.route_plan)
                      }
                    />
                    <FormFeedback>{props.errors.route_plan}</FormFeedback>

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
                [toggleModal, toggleRefresh]
              );
            }}
          >
            {isUpdate ? "Update" : "Submit"}
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              toggleModal();
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
