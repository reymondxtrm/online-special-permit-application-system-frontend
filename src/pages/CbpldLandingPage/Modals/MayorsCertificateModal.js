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
import BasicInputField from "components/Forms/BasicInputField";
import useImageCompressor from "hooks/Common/useImageCompressor";

export const createMayorsCertificateSchema = (isUpdate) =>
  Yup.object().shape({
    purpose: Yup.object().nullable().required("Purpose is required"),

    other_purpose: Yup.string().when("purpose", {
      is: (purpose) => purpose?.label === "Others",
      then: Yup.string().trim().required("Other purpose is required"),
      otherwise: Yup.string().nullable(),
    }),

    police_clearance: isUpdate
      ? Yup.mixed()
          .nullable()
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              !value ||
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
      : Yup.mixed()
          .required("Police clearance is required")
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          ),

    community_tax_certificate: isUpdate
      ? Yup.mixed()
          .nullable()
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              !value ||
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
      : Yup.mixed()
          .required("Community tax certificate is required")
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          ),

    barangay_clearance: isUpdate
      ? Yup.mixed()
          .nullable()
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              !value ||
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
      : Yup.mixed()
          .required("Barangay clearance is required")
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          ),

    fiscal_clearance: isUpdate
      ? Yup.mixed()
          .nullable()
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              !value ||
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
      : Yup.mixed()
          .required("Fiscal clearance is required")
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          ),

    court_clearance: isUpdate
      ? Yup.mixed()
          .nullable()
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              !value ||
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          )
      : Yup.mixed()
          .required("Court clearance is required")
          .test(
            "fileType",
            "Only image files are allowed",
            (value) =>
              value &&
              ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          ),
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

  const {
    compressedFiles,
    isCompressing,
    errors: compressionErrors,
    handleImageChange,
  } = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

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

  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const compressed = await handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(fieldName, compressed);
      props.setFieldTouched(fieldName, true, true);
    }
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
            {isUpdate ? "UPDATE MAYOR'S CERTIFICATE" : "MAYOR'S CERTIFICATE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={createMayorsCertificateSchema(isUpdate)}
            initialValues={{
              type: "mayors_permit",
              purpose: existingData?.purpose || null,
              other_purpose: existingData?.other_purpose || "",
              police_clearance: null,
              community_tax_certificate: null,
              barangay_clearance: null,
              fiscal_clearance: null,
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
                              value={props.values.purpose || null}
                              onChange={(selectedOption) => {
                                const label = selectedOption?.label;
                                setotherPurpose(label === "Others");
                                props.setFieldValue(
                                  "purpose",
                                  selectedOption || null
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
                      <Row>
                        <BasicInputField
                          col={12}
                          label="Specify Other Purpose"
                          name="other_purpose"
                          type="text"
                          placeholder="Enter other purpose"
                          validation={props}
                          value={props.values.other_purpose}
                          touched={props.touched.other_purpose}
                          errors={props.errors.other_purpose}
                          required={true}
                        />
                      </Row>
                    )}

                    {/* Police Clearance */}
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
                                    0,
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
                              {compressionErrors[0] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[0]}
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
                                    1,
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
                              {compressionErrors[1] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[1]}
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
                            Barangay Clearance{" "}
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
                                    2,
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
                              {compressionErrors[2] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[2]}
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
                                    3,
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
                              {compressionErrors[3] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[3]}
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
                                    4,
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
                              {compressionErrors[4] && (
                                <div
                                  className="text-warning mt-1"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  Compression error: {compressionErrors[4]}
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
                  ...formikRef.current?.values,
                  special_permit_application_id: specialPermitApplicationId,
                };
                const formData = getFormData(formik);

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
            disabled={!proceed || isCompressing}
          >
            {isCompressing ? "Compressing..." : "Submit"}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default MayorsCertificateModal;
