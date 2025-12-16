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
import Select from "react-select";
import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import { USER_PRIVACY } from "assets/data/data";
import axios from "axios";
import useGetImage from "hooks/Common/useGetImage";
import * as Yup from "yup";
import ReactSimpleImageViewer from "react-simple-image-viewer";

function UseOfGovernmentPropertyModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId = null,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [proceed, setIsProceed] = useState(false);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [existingData, setExistingData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { getImageHandle, currentImage, isFetching } = useGetImage();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
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

  useEffect(() => {
    if (openModal) {
      const fetch = async () => {
        try {
          const response = await axios.get("api/get-government-property");
          if (response) {
            const options = response.data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setPropertyOptions(options);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetch();
    }
  }, [openModal]);
  const UseOfGovernmentPropertySchema = Yup.object().shape({
    requestor_name: Yup.string()
      .trim()
      .required("Name of Requestor / Organization is required"),

    name_of_property: Yup.string().required("Government property is required"),

    event_name: Yup.string().trim().required("Name of Event is required"),

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

  useEffect(() => {
    if (openModal && isUpdate) {
      const fetchExistingApplication = async () => {
        try {
          setLoadingExisting(true);
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
            name_of_property: d.name_of_property || "",
            event_name: d.event_name || "",
            event_date_from: d.event_date_from || "",
            event_date_to: d.event_date_to || "",
            event_time_from: d.event_time_from || "",
            event_time_to: d.event_time_to || "",
          });
          setUploadedFiles(d.uploaded_file || {});
          setLoadingExisting(false);
        } catch (err) {
          console.error(err);
          setLoadingExisting(false);
        }
      };
      fetchExistingApplication();
    }
  }, [isUpdate, openModal, specialPermitApplicationId]);

  const initialValues = {
    type: "event",
    requestor_name: existingData?.requestor_name || "",
    name_of_property: existingData?.name_of_property || "",
    event_name: existingData?.event_name || "",
    event_date_from: existingData?.event_date_from || "",
    event_date_to: existingData?.event_date_to || "",
    event_time_from: existingData?.event_time_from || "",
    event_time_to: existingData?.event_time_to || "",

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
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{ overflowY: "auto", maxWidth: "600px" }}
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
            {isUpdate
              ? "UPDATE USE OF GOVERNMENT PROPERTY"
              : "USE OF GOVERNMENT PROPERTY"}
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
              validationSchema={UseOfGovernmentPropertySchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form>
                  <Row>
                    <Col>
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
                        <FormFeedback>
                          {props.errors.requestor_name}
                        </FormFeedback>
                      </FormGroup>

                      <FormGroup>
                        <Label>Name of Government Property</Label>

                        <Select
                          options={propertyOptions}
                          placeholder="Select a property.."
                          value={propertyOptions.find(
                            (option) =>
                              option.label === props.values.name_of_property
                          )}
                          onChange={(selected) =>
                            props.setFieldValue(
                              "name_of_property",
                              selected.label
                            )
                          }
                          onBlur={() =>
                            props.setFieldTouched("name_of_property", true)
                          }
                        />
                        {props.touched.name_of_property &&
                          props.errors.name_of_property && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "80%" }}
                            >
                              {props.errors.name_of_property}
                            </div>
                          )}
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

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Date (From)</Label>
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
                            <Label>Date (To)</Label>
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

                      {/* Route Plan */}
                      <FormGroup>
                        <Label>Route Plan (CTTMD Approved)</Label>
                        <div className="d-flex gap-2">
                          <Input
                            type="file"
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
                ? "api/client/special-permit/use-of-government-property/update"
                : "api/client/special-permit/use-of-government-property";

              handleSubmit(
                {
                  url,
                  headers: { "Content-Type": "multipart/form-data" },
                  message: {
                    title: isUpdate
                      ? "Update Application?"
                      : "Are you sure you want to Proceed?",
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
    </React.Fragment>
  );
}

export default UseOfGovernmentPropertyModal;
