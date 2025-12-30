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
import { EVENT_TYPES, USER_PRIVACY } from "assets/data/data";
import * as Yup from "yup";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-simple-image-viewer";

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
        toggle={() => {
          toggleModal();
        }}
        backdrop="static"
        className="modal-dialog-centered"
        size="m"
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
              requestor_name: existingData?.requestor_name || "",
              event_name: existingData?.event_name || "",
              event_date_from: existingData?.event_date_from || "",
              event_date_to: existingData?.event_date_to || "",
              event_time_from: existingData?.event_time_from || "",
              event_time_to: existingData?.event_time_to || "",
              event_type: existingData?.event_type || "",
              request_letter: "",
              route_plan: "",
              sworn_statement: "",
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
                        <Label>
                          {file.label}
                          {file.key !== "sworn_statement" && (
                            <span className="text-danger">*</span>
                          )}
                        </Label>
                        <div className="d-flex gap-2">
                          <Input
                            type="file"
                            name={file.key}
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                file.key,
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() => props.setFieldTouched(file.key, true)}
                            invalid={
                              props.touched[file.key] &&
                              Boolean(props.errors[file.key])
                            }
                          />

                          <FormFeedback>{props.errors[file.key]}</FormFeedback>
                          {console.log(uploadedFiles)}
                          {isUpdate && uploadedFiles?.[file.key] && (
                            <Button
                              color="primary"
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
                              <i className="mdi mdi-eye" color="warning"></i>
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
    </React.Fragment>
  );
}

export default EventModal;
