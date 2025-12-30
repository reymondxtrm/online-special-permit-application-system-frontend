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
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";
import * as Yup from "yup";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-simple-image-viewer";
// import UserConfirmationModal from "./userConfirmationModal";

function GoodMoralModal({
  openModal,
  toggleModal,
  isUpdate,
  specialPermitApplicationId,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [purposeOptions, setpurposeOptions] = useState();
  const [otherPurpose, setotherPurpose] = useState(false);
  const [employmentPurpose, setemploymentPurpose] = useState(false);
  const [firstTimeJobSeeker, setfirstTimeJobSeeker] = useState(false);
  const [discountOptions, setdiscountOptions] = useState();
  const [proceed, setIsProceed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [existingData, setExistingData] = useState({});
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const { currentImage, getImageHandle, isFetching } = useGetImage();

  useEffect(() => {
    if (openModal) {
      axios
        .get("api/get-purpose", {
          params: { permit_type: "good_moral" },
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
    if (!openModal || !isUpdate) return;
    axios
      .get("api/client/get-single-occupational/permit-application", {
        params: { special_permit_application_id: specialPermitApplicationId },
      })
      .then((res) => {
        let data = res.data;
        let purposeValue = null;
        let otherPurposeValue = "";
        if (data?.application_purpose?.type === "temporary") {
          purposeValue = { value: 0, label: "Others" };
          otherPurposeValue = data?.application_purpose?.name || "";
        } else {
          purposeValue =
            purposeOptions?.find(
              (item) => item.value === data?.application_purpose?.id
            ) || null;
        }
        const exemptionCaseValue =
          discountOptions?.find(
            (opt) => opt.value === data?.permitApplicationExemption?.id
          ) || null;

        setExistingData({
          purpose: purposeValue,
          other_purpose: otherPurposeValue,
          hasExemptionCase: !!data?.permitApplicationExemption,
          exemptionCase: exemptionCaseValue,
        });

        setUploadedFiles(data?.uploaded_files || []);
      })
      .catch((error) => console.log(error));
  }, [
    openModal,
    isUpdate,
    specialPermitApplicationId,
    purposeOptions,
    discountOptions,
  ]);
  
  useEffect(() => {
    if (!openModal) {
      setpurposeOptions(undefined);
      setotherPurpose(false);
      setemploymentPurpose(false);
      setdiscountOptions(undefined);

      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }
  }, [openModal]);

  const toggleIsViewerOpen = () => {
    setIsViewingOpen((prev) => !prev);
  };
  useEffect(() => {
    if (openModal && employmentPurpose) {
      axios
        .get("api/client/get/exempted-cases", {
          params: { permit_type: "good_moral" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));

            setdiscountOptions(options);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal, employmentPurpose]);
  useEffect(() => {
    setotherPurpose(Boolean(existingData?.other_purpose));
    setemploymentPurpose(Boolean(existingData?.hasExemptionCase));
  }, [existingData]);
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
  const IMAGE_SIZE = 2 * 1024 * 1024;
  const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

  const fileValidation = Yup.mixed()
    .required("This file is required")
    .test(
      "fileSize",
      "File must be less than 2MB",
      (value) => value && value.size <= IMAGE_SIZE
    )
    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => value && SUPPORTED_IMAGE_FORMATS.includes(value.type)
    );
  const validationSchema = Yup.object().shape({
    purpose: Yup.object().nullable().required("Purpose is required"),

    other_purpose: Yup.string().when("purpose", {
      is: (purpose) => purpose?.label === "Others",
      then: (schema) => schema.required("Please specify other purpose"),
      otherwise: (schema) => schema.notRequired(),
    }),

    exemption: Yup.object().when("purpose", {
      is: (purpose) => purpose?.label === "Local Employment",
      then: (schema) => schema.required("Exempted case is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    exemption_proof: Yup.mixed().when("purpose", {
      is: (purpose) => purpose?.label === "Local Employment",
      then: () => fileValidation,
      otherwise: (schema) => schema.notRequired(),
    }),

    police_clearance: fileValidation,
    community_tax_certificate: fileValidation,
    barangay_clearance: fileValidation,
    fiscal_clearance: fileValidation,
    court_clearance: fileValidation,
  });

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
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
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
            {isUpdate ? "UPDATE GOOD MORAL" : "GOOD MORAL"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              type: "good_moral",
              purpose: existingData?.purpose || "",
              exemption: existingData?.exemptionCase || "",
              other_purpose: existingData?.other_purpose || "",
              police_clearance: "",
              community_tax_certificate: "",
              barangay_clearance: "",
              fiscal_clearance: "",
              exemption_proof: "",
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
                              value={props.values.purpose}
                              options={purposeOptions}
                              onChange={(selectedOption) => {
                                setotherPurpose(
                                  selectedOption?.label === "Others"
                                );
                                setemploymentPurpose(
                                  selectedOption?.label === "Local Employment"
                                );
                                props.setFieldValue(
                                  "purpose",
                                  selectedOption ?? null
                                );
                              }}
                              onBlur={() =>
                                props.setFieldTouched("purpose", true)
                              }
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

                    {employmentPurpose && (
                      <>
                        <Col>
                          <FormGroup>
                            <Label>
                              Exempted Cases{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <div
                              className={
                                props.touched.exemption &&
                                props.errors.exemption
                                  ? "is-invalid"
                                  : ""
                              }
                            >
                              <Select
                                isClearable
                                name="exemption"
                                value={props.values.exemption}
                                options={discountOptions}
                                onChange={(opt) =>
                                  props.setFieldValue("exemption", opt ?? null)
                                }
                                onBlur={() =>
                                  props.setFieldTouched("exemption", true)
                                }
                              />
                            </div>

                            {props.touched.exemption &&
                              props.errors.exemption && (
                                <FormFeedback className="d-block">
                                  {props.errors.exemption}
                                </FormFeedback>
                              )}
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="exemptionProof">
                              Attachment (Upload Image as Proof for Discount){" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="file"
                              name="exemption_proof"
                              accept="image/*"
                              onChange={(e) =>
                                props.setFieldValue(
                                  "exemption_proof",
                                  e.currentTarget.files[0]
                                )
                              }
                              onBlur={() =>
                                props.setFieldTouched("exemption_proof", true)
                              }
                              invalid={
                                props.touched.exemption_proof &&
                                Boolean(props.errors.exemption_proof)
                              }
                            />
                            <FormFeedback>
                              {props.errors.exemption_proof}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </>
                    )}

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="policeClearance">
                            Police Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="d-flex gap-1">
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

                            {isUpdate && uploadedFiles?.police_clearance && (
                              <Button color="primary">
                                <i
                                  className="mdi mdi-eye"
                                  color="warning"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getImageHandle({
                                      path: uploadedFiles?.police_clearance,
                                      url: "api/client/attachment",
                                      showLoader: true,
                                    });
                                    toggleIsViewerOpen();
                                  }}
                                ></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="taxCert">
                            Community Tax Certificate{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="d-flex gap-1">
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

                            {isUpdate &&
                              uploadedFiles?.community_tax_certificate && (
                                <Button color="primary">
                                  <i
                                    className="mdi mdi-eye"
                                    color="warning"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getImageHandle({
                                        path: uploadedFiles?.community_tax_certificate,
                                        url: "api/client/attachment",
                                        showLoader: true,
                                      });
                                      toggleIsViewerOpen();
                                    }}
                                  ></i>
                                </Button>
                              )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="exampleFile">
                            Barangay Clearance (As proof of Residency){" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="d-flex gap-1">
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
                                props.setFieldTouched(
                                  "barangay_clearance",
                                  true
                                )
                              }
                              invalid={
                                props.touched.barangay_clearance &&
                                Boolean(props.errors.barangay_clearance)
                              }
                            />
                            <FormFeedback>
                              {props.errors.barangay_clearance}
                            </FormFeedback>

                            {isUpdate && uploadedFiles?.barangay_clearance && (
                              <Button color="primary">
                                <i
                                  className="mdi mdi-eye"
                                  color="warning"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getImageHandle({
                                      path: uploadedFiles?.barangay_clearance,
                                      url: "api/client/attachment",
                                      showLoader: true,
                                    });
                                    toggleIsViewerOpen();
                                  }}
                                ></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="fiscalClearance">
                            Fiscal Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="d-flex gap-1">
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

                            {isUpdate && uploadedFiles?.fiscal_clearance && (
                              <Button color="primary">
                                <i
                                  className="mdi mdi-eye"
                                  color="warning"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getImageHandle({
                                      path: uploadedFiles?.fiscal_clearance,
                                      url: "api/client/attachment",
                                      showLoader: true,
                                    });
                                    toggleIsViewerOpen();
                                  }}
                                ></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="courtClearance">
                            Court Clearance{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="d-flex gap-1">
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

                            {isUpdate && uploadedFiles?.court_clearance && (
                              <Button color="primary">
                                <i
                                  className="mdi mdi-eye"
                                  color="warning"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getImageHandle({
                                      path: uploadedFiles?.court_clearance,
                                      url: "api/client/attachment",
                                      showLoader: true,
                                    });
                                    toggleIsViewerOpen();
                                  }}
                                ></i>
                              </Button>
                            )}
                          </div>
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
                // ...formikRef.current.values,
                purpose: formikRef?.current?.values?.purpose,
                exemption_id:
                  formikRef?.current?.values?.exemption?.value || null,
                barangay_clearance:
                  formikRef?.current?.values?.barangay_clearance,
                community_tax_certificate:
                  formikRef?.current?.values?.community_tax_certificate,
                court_clearance: formikRef?.current?.values?.court_clearance,
                exemption_proof: formikRef?.current?.values?.exemption_proof,
                fiscal_clearance: formikRef?.current?.values?.fiscal_clearance,
                other_purpose: formikRef?.current?.values?.other_purpose,
                police_clearance: formikRef?.current?.values?.police_clearance,
                type: formikRef?.current?.values?.type,
              };

              const formData = getFormData(formik);
              if (proceed) {
                handleSubmit(
                  {
                    url: "api/client/special-permit/good-moral",
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

export default GoodMoralModal;
