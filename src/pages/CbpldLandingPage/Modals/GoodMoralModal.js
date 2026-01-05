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
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";
import * as Yup from "yup";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-simple-image-viewer";
import useImageCompressor from "hooks/Common/useImageCompressor";

function GoodMoralModal({
  openModal,
  toggleModal,
  isUpdate,
  specialPermitApplicationId,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [purposeOptions, setpurposeOptions] = useState([]);
  const [otherPurpose, setotherPurpose] = useState(false);
  const [employmentPurpose, setemploymentPurpose] = useState(false);
  const [discountOptions, setdiscountOptions] = useState([]);
  const [proceed, setIsProceed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [existingData, setExistingData] = useState({});
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const { currentImage, getImageHandle, isFetching } = useGetImage();
  const {
    compressedFiles,
    isCompressing,
    errors: compressionErrors,
    handleImageChange,
  } = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

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

        setUploadedFiles(data?.uploaded_files || {});
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
      setpurposeOptions([]);
      setotherPurpose(false);
      setemploymentPurpose(false);
      setdiscountOptions([]);

      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }
  }, [openModal]);

  const toggleIsViewerOpen = () => {
    setIsViewingOpen((prev) => !prev);
  };

  useEffect(() => {
    if (openModal) {
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

  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const compressed = await handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(fieldName, compressed);
      props.setFieldTouched(fieldName, true, true);
    }
  };

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]);
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

  const fileValidationOptional = Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Only JPG and PNG images are allowed",
      (value) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
    );

  const fileValidationRequired = Yup.mixed()
    .required("File is required")
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

    exemption_proof: Yup.mixed().when("exemption", {
      is: (exemption) => Boolean(exemption?.value),
      then: () => (isUpdate ? fileValidationOptional : fileValidationRequired),
      otherwise: (schema) => schema.notRequired(),
    }),

    police_clearance: isUpdate
      ? fileValidationOptional
      : fileValidationRequired,
    community_tax_certificate: isUpdate
      ? fileValidationOptional
      : fileValidationRequired,
    barangay_clearance: isUpdate
      ? fileValidationOptional
      : fileValidationRequired,
    fiscal_clearance: isUpdate
      ? fileValidationOptional
      : fileValidationRequired,
    court_clearance: isUpdate ? fileValidationOptional : fileValidationRequired,
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
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
        unmountOnClose
      >
        <ModalHeader toggle={toggleModal}>
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
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={validationSchema}
            initialValues={{
              type: "good_moral",
              purpose: existingData?.purpose || null,
              exemption: existingData?.exemptionCase || null,
              other_purpose: existingData?.other_purpose || "",
              police_clearance: null,
              community_tax_certificate: null,
              barangay_clearance: null,
              fiscal_clearance: null,
              exemption_proof: null,
              court_clearance: null,
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

                                props.setValues({
                                  ...props.values,
                                  purpose: selectedOption || null,
                                  exemption_proof: null,
                                  exemption: {},
                                });
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
                      <Row>
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
                      </Row>
                    )}

                    {discountOptions && discountOptions?.length > 0 ? (
                      <>
                        <Row>
                          <Col>
                            <FormGroup>
                              <Label>
                                Exempted Cases{" "}
                                {/* <span className="text-danger">*</span> */}
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
                                    props.setFieldValue(
                                      "exemption",
                                      opt || null
                                    )
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
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
                              <Label>
                                Attachment (Upload Image as Proof for Exemption){" "}
                                {/* {(!isUpdate || Boolean(exemption?.value)) && (
                                  <span className="text-danger">*</span>
                                )} */}
                              </Label>
                              <div className="d-flex gap-2 align-items-start">
                                <div className="flex-grow-1">
                                  <Input
                                    type="file"
                                    name="exemption_proof"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileChange(
                                        e,
                                        "exemption_proof",
                                        0,
                                        props
                                      )
                                    }
                                    onBlur={() =>
                                      props.setFieldTouched(
                                        "exemption_proof",
                                        true,
                                        true
                                      )
                                    }
                                    disabled={isCompressing}
                                  />
                                  {compressionErrors[0] && (
                                    <div
                                      className="text-warning mt-1"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      Compression error: {compressionErrors[0]}
                                    </div>
                                  )}
                                  {props.touched.exemption_proof &&
                                  props.errors.exemption_proof ? (
                                    <div
                                      className="text-danger mt-1"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      {props.errors.exemption_proof}
                                    </div>
                                  ) : null}
                                </div>
                                {isUpdate && uploadedFiles?.exemption_proof && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getImageHandle({
                                        path: uploadedFiles?.exemption_proof,
                                        url: "api/client/attachment",
                                        showLoader: true,
                                      });
                                      toggleIsViewerOpen();
                                    }}
                                  >
                                    <i className="mdi mdi-eye"></i>
                                  </Button>
                                )}
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    ) : null}

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Police Clearance{" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                type="file"
                                name="police_clearance"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "police_clearance",
                                    1,
                                    props
                                  )
                                }
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "police_clearance",
                                    true,
                                    true
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[1] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[1]}
                                </div>
                              )}
                              {props.touched.police_clearance &&
                              props.errors.police_clearance ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.police_clearance}
                                </div>
                              ) : null}
                            </div>
                            {isUpdate && uploadedFiles?.police_clearance && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.police_clearance,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Community Tax Certificate */}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Community Tax Certificate{" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                type="file"
                                name="community_tax_certificate"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "community_tax_certificate",
                                    2,
                                    props
                                  )
                                }
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "community_tax_certificate",
                                    true,
                                    true
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[2] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[2]}
                                </div>
                              )}
                              {props.touched.community_tax_certificate &&
                              props.errors.community_tax_certificate ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.community_tax_certificate}
                                </div>
                              ) : null}
                            </div>
                            {isUpdate &&
                              uploadedFiles?.community_tax_certificate && (
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getImageHandle({
                                      path: uploadedFiles?.community_tax_certificate,
                                      url: "api/client/attachment",
                                      showLoader: true,
                                    });
                                    toggleIsViewerOpen();
                                  }}
                                >
                                  <i className="mdi mdi-eye"></i>
                                </Button>
                              )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Barangay Clearance */}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Barangay Clearance (As proof of Residency){" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                type="file"
                                name="barangay_clearance"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "barangay_clearance",
                                    3,
                                    props
                                  )
                                }
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "barangay_clearance",
                                    true,
                                    true
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[3] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[3]}
                                </div>
                              )}
                              {props.touched.barangay_clearance &&
                              props.errors.barangay_clearance ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.barangay_clearance}
                                </div>
                              ) : null}
                            </div>
                            {isUpdate && uploadedFiles?.barangay_clearance && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.barangay_clearance,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Fiscal Clearance */}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Fiscal Clearance{" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                type="file"
                                name="fiscal_clearance"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "fiscal_clearance",
                                    4,
                                    props
                                  )
                                }
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "fiscal_clearance",
                                    true,
                                    true
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[4] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[4]}
                                </div>
                              )}
                              {props.touched.fiscal_clearance &&
                              props.errors.fiscal_clearance ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.fiscal_clearance}
                                </div>
                              ) : null}
                            </div>
                            {isUpdate && uploadedFiles?.fiscal_clearance && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.fiscal_clearance,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Court Clearance */}
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>
                            Court Clearance{" "}
                            {!isUpdate && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <div className="d-flex gap-2 align-items-start">
                            <div className="flex-grow-1">
                              <Input
                                type="file"
                                name="court_clearance"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "court_clearance",
                                    5,
                                    props
                                  )
                                }
                                onBlur={() =>
                                  props.setFieldTouched(
                                    "court_clearance",
                                    true,
                                    true
                                  )
                                }
                                disabled={isCompressing}
                              />
                              {compressionErrors[5] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[5]}
                                </div>
                              )}
                              {props.touched.court_clearance &&
                              props.errors.court_clearance ? (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {props.errors.court_clearance}
                                </div>
                              ) : null}
                            </div>
                            {isUpdate && uploadedFiles?.court_clearance && (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getImageHandle({
                                    path: uploadedFiles?.court_clearance,
                                    url: "api/client/attachment",
                                    showLoader: true,
                                  });
                                  toggleIsViewerOpen();
                                }}
                              >
                                <i className="mdi mdi-eye"></i>
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
            onClick={async () => {
              const errors = await formikRef.current?.validateForm();

              formikRef.current?.setTouched({
                purpose: true,
                other_purpose: true,
                exemption: true,
                exemption_proof: true,
                police_clearance: true,
                community_tax_certificate: true,
                barangay_clearance: true,
                fiscal_clearance: true,
                court_clearance: true,
              });

              if (errors && Object.keys(errors).length > 0) {
                console.log("Validation errors:", errors);
                return;
              }

              if (proceed) {
                const formik = {
                  purpose: formikRef?.current?.values?.purpose,
                  exemption_id:
                    formikRef?.current?.values?.exemption?.value || null,
                  barangay_clearance:
                    formikRef?.current?.values?.barangay_clearance,
                  community_tax_certificate:
                    formikRef?.current?.values?.community_tax_certificate,
                  court_clearance: formikRef?.current?.values?.court_clearance,
                  exemption_proof: formikRef?.current?.values?.exemption_proof,
                  fiscal_clearance:
                    formikRef?.current?.values?.fiscal_clearance,
                  other_purpose: formikRef?.current?.values?.other_purpose,
                  police_clearance:
                    formikRef?.current?.values?.police_clearance,
                  type: formikRef?.current?.values?.type,
                  special_permit_application_id: specialPermitApplicationId,
                };

                const formData = getFormData(formik);

                handleSubmit(
                  {
                    url: isUpdate
                      ? "api/client/special-permit/good-moral/update"
                      : "api/client/special-permit/good-moral",
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
            disabled={!proceed || isCompressing}
          >
            {isUpdate ? "Update" : isCompressing ? "Compressing..." : "Submit"}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default GoodMoralModal;
