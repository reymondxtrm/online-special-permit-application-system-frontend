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

  useEffect(() => {
    if (isUpdate && openModal) {
      const fetchExistingRecorrida = async () => {
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
            request_letter: null,
            route_plan: null,
          });
          setUploadedFiles(d.uploaded_file || {});
        } catch (err) {
          console.error(err);
        }
      };
      fetchExistingRecorrida();
    }
  }, [isUpdate, openModal, specialPermitApplicationId]);

  const initialValues = {
    type: "event",
    requestor_name: existingData?.requestor_name || "",
    event_name: existingData?.event_name || "",
    event_date_from: existingData?.event_date_from || "",
    event_date_to: existingData?.event_date_to || "",
    event_time_from: existingData?.event_time_from || "",
    event_time_to: existingData?.event_time_to || "",
    number_of_participants: existingData?.number_of_participants || 0,
    request_letter: null,
    route_plan: null,
    official_receipt: null,
  };

  if (!openModal) return null;
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const RecorridaSchema = Yup.object().shape({
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
              onSubmit={handleSubmit}
              validationSchema={RecorridaSchema}
            >
              {(props) => (
                <Form>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Name of Requestor / Organization</Label>
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
                        <Label>Name of Event</Label>
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
                            <FormFeedback>
                              {props.errors.event_date_to}
                            </FormFeedback>
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
                        <Label>Request Letter</Label>
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

                      <FormGroup>
                        <Label>Route Plan (CTTMD Approved)</Label>
                        <div className="d-flex gap-2">
                          <Input
                            type="file"
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
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          )}
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
              fontWeight: 600,
              color: "white",
            }}
            disabled={!proceed}
            onClick={() => {
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

export default RecorridaModal;
