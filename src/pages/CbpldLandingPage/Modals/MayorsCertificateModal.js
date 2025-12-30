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

import Select from "react-select";
import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-simple-image-viewer";
import * as Yup from "yup";
import E from "react-script";
export const createMayorsCertificateSchema = (isUpdate) =>
  Yup.object().shape({
    // Only validate when NOT updating
    ...(isUpdate
      ? {}
      : {
          purpose: Yup.object().nullable().required("Purpose is required"),

          other_purpose: Yup.string().when("purpose", {
            is: (purpose) => purpose?.label === "Others",
            then: Yup.string().trim().required("Other purpose is required"),
            otherwise: Yup.string().nullable(),
          }),

          police_clearance: Yup.mixed()
            .required("Police clearance is required")
            .test(
              "fileType",
              "Only image files are allowed",
              (value) =>
                value &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            ),

          community_tax_certificate: Yup.mixed()
            .required("Community tax certificate is required")
            .test(
              "fileType",
              "Only image files are allowed",
              (value) =>
                value &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            ),

          barangay_clearance: Yup.mixed()
            .required("Barangay clearance is required")
            .test(
              "fileType",
              "Only image files are allowed",
              (value) =>
                value &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            ),

          fiscal_clearance: Yup.mixed()
            .required("Fiscal clearance is required")
            .test(
              "fileType",
              "Only image files are allowed",
              (value) =>
                value &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            ),

          court_clearance: Yup.mixed()
            .required("Court clearance is required")
            .test(
              "fileType",
              "Only image files are allowed",
              (value) =>
                value &&
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            ),
        }),
  });
function MayorsCertificateModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [purposeOptions, setpurposeOptions] = useState();
  const [otherPurpose, setotherPurpose] = useState(false);
  const [proceed, setIsProceed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [existingData, setExistingData] = useState({});
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const { currentImage, getImageHandle, isFetching } = useGetImage();

  const toggleIsViewerOpen = () => {
    setIsViewingOpen((prev) => !prev);
  };
  useEffect(() => {
    setotherPurpose(Boolean(existingData?.other_purpose));
  }, [existingData]);
  useEffect(() => {
    if (openModal) {
      axios
        .get("api/get-purpose", {
          params: { permit_type: "mayors_certificate" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));
            const updatedOptions = [{ value: 0, label: "Others" }, ...options];

            setpurposeOptions(updatedOptions);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal]);

  useEffect(() => {
    if (openModal && isUpdate) {
      axios
        .get("api/client/get-single-occupational/permit-application", {
          params: { special_permit_application_id: specialPermitApplicationId },
        })
        .then(
          (res) => {
            let data = res.data;

            setExistingData(() => {
              if (data?.application_purpose?.type === "temporary") {
                data = {
                  ...data,
                  other_purpose: data?.application_purpose?.name,
                  purpose: { value: 0, label: "Others" },
                };
              } else {
                data = {
                  ...data,
                  purpose: purposeOptions?.find(
                    (item) => item.value === data?.application?.purpose
                  ),
                };
              }
              return {
                purpose: data?.purpose,
                other_purpose: data?.other_purpose || "",
              };
            });

            setUploadedFiles(data?.uploaded_files || []);
          },
          (error) => console.log(error)
        );
    }
  }, [openModal, isUpdate, specialPermitApplicationId, purposeOptions]);

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

  return (
    <React.Fragment>
      {isViewingOpen && !isFetching && currentImage && (
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
            {isUpdate ? "UPDATE MAYOR'S CERTIFICATE" : "MAYOR'S CERTIFICATE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            validationSchema={createMayorsCertificateSchema(isUpdate)}
            initialValues={{
              type: "mayors_permit",
              purpose: existingData?.purpose || "",
              other_purpose: existingData?.other_purpose || "",
              police_clearance: "",
              community_tax_certificate: "",
              barangay_clearance: "",
              fiscal_clearance: "",
              court_clearance: "",
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
                          <Label>
                            Purpose <span className="text-danger">*</span>
                          </Label>

                          <div
                            className={
                              props.touched.purpose && props.errors.purpose
                                ? "is-invalid"
                                : ""
                            }
                          >
                            <Select
                              isClearable
                              name="purpose"
                              value={props.values.purpose || null}
                              onChange={(selectedOption) => {
                                const label = selectedOption?.label;
                                setotherPurpose(label === "Others");
                                props.setFieldValue(
                                  "purpose",
                                  selectedOption ?? ""
                                );
                              }}
                              onBlur={() =>
                                props.setFieldTouched("purpose", true)
                              }
                              options={purposeOptions}
                              placeholder="Select Purpose"
                            />
                          </div>

                          {props.touched.purpose && props.errors.purpose && (
                            <FormFeedback className="d-block">
                              {props.errors.purpose}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    {otherPurpose && (
                      <Col md={12}>
                        <FormGroup>
                          <Label>
                            Specify Other Purpose{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="other_purpose"
                            value={props.values.other_purpose}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            invalid={
                              props.touched.other_purpose &&
                              Boolean(props.errors.other_purpose)
                            }
                          />
                          <FormFeedback>
                            {props.errors.other_purpose}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    )}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Police Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="file"
                            name="police_clearance"
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                "police_clearance",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() =>
                              props.setFieldTouched("police_clearance", true)
                            }
                            invalid={
                              props.touched.police_clearance &&
                              Boolean(props.errors.police_clearance)
                            }
                          />

                          <FormFeedback>
                            {props.errors.police_clearance}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Community Tax Certificate{" "}
                            <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="file"
                            name="community_tax_certificate"
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                "community_tax_certificate",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() =>
                              props.setFieldTouched(
                                "community_tax_certificate",
                                true
                              )
                            }
                            invalid={
                              props.touched.community_tax_certificate &&
                              Boolean(props.errors.community_tax_certificate)
                            }
                          />

                          <FormFeedback>
                            {props.errors.community_tax_certificate}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Barangay Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="file"
                            name="barangay_clearance"
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                "barangay_clearance",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() =>
                              props.setFieldTouched("barangay_clearance", true)
                            }
                            invalid={
                              props.touched.barangay_clearance &&
                              Boolean(props.errors.barangay_clearance)
                            }
                          />
                          <FormFeedback>
                            {props.errors.barangay_clearance}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Fiscal Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="file"
                            name="fiscal_clearance"
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                "fiscal_clearance",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() =>
                              props.setFieldTouched("fiscal_clearance", true)
                            }
                            invalid={
                              props.touched.fiscal_clearance &&
                              Boolean(props.errors.fiscal_clearance)
                            }
                          />
                          <FormFeedback>
                            {props.errors.fiscal_clearance}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Court Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>

                          <Input
                            type="file"
                            name="court_clearance"
                            accept="image/*"
                            onChange={(e) =>
                              props.setFieldValue(
                                "court_clearance",
                                e.currentTarget.files[0]
                              )
                            }
                            onBlur={() =>
                              props.setFieldTouched("court_clearance", true)
                            }
                            invalid={
                              props.touched.court_clearance &&
                              Boolean(props.errors.court_clearance)
                            }
                          />

                          <FormFeedback>
                            {props.errors.court_clearance}
                          </FormFeedback>
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
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              const formik = {
                ...formikRef.current?.values,
                special_permit_application_id: specialPermitApplicationId,
              };
              const formData = getFormData(formik);
              if (proceed) {
                handleSubmit(
                  {
                    url: isUpdate
                      ? "api/client/special-permit/mayors-permit/update"
                      : "api/client/special-permit/mayors-permit",
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
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default MayorsCertificateModal;
