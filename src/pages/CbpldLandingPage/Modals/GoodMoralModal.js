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
        console.log(
          purposeOptions?.find(
            (item) => item.value === data?.application_purpose?.id
          )
        );
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
  console.log(existingData);
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
  const fileValidation = Yup.mixed()
    .required("This file is required")
    .test("fileSize", "File must be less than 2MB", (value) => {
      return value && value.size <= IMAGE_SIZE;
    })
    .test("fileFormat", "Only JPG and PNG are allowed", (value) => {
      return value && SUPPORTED_IMAGE_FORMATS.includes(value.type);
    });
  const validationSchema = Yup.object().shape({
    purpose_id: Yup.object().required("Purpose is required"),
    // exemption_id: Yup.
    other_purpose: Yup.object().when("purpose_id.label", {
      is: "Others", // 👈 if user selected "Other"
      then: (schema) => schema.required("Please specify the document"),
      otherwise: (schema) => schema.notRequired(),
    }),
    police_clearance: fileValidation,
    community_tax_certificate: fileValidation,
    barangay_clearance: fileValidation,
    fiscal_clearance: fileValidation,
    exemption_proof: fileValidation,
    court_clearance: fileValidation,
  });

  const setProceedHandle = () => {
    setIsProceed((prev) => !prev);
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
          setIsProceed(false);
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
            setIsProceed(false);
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
            {"GOOD MORAL"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
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
                          <Label>Purpose</Label>
                          <Select
                            isClearable={true}
                            name={"purpose"}
                            onChange={(selectedOption) => {
                              if (
                                selectedOption.label === "Others" ||
                                selectedOption.label === "Local Employment"
                              ) {
                                if (selectedOption.label === "Others") {
                                  setotherPurpose(true);
                                  setemploymentPurpose(false);
                                }
                                if (
                                  selectedOption.label === "Local Employment"
                                ) {
                                  setemploymentPurpose(true);
                                  setotherPurpose(false);
                                }
                              } else {
                                setemploymentPurpose(false);
                                setotherPurpose(false);
                              }

                              props.setFieldValue(
                                "purpose",
                                selectedOption ? selectedOption : {}
                              );
                            }}
                            placeholder="Select Purpose"
                            value={props.values.purpose}
                            options={purposeOptions}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {otherPurpose && (
                      <Col md={12}>
                        <FormGroup>
                          <Label>Specify Other Purpose</Label>
                          <Input
                            type="text"
                            name={`other_purpose`}
                            onChange={props.handleChange}
                            placeholder="Enter your purpose"
                            value={props?.values?.other_purpose}
                          />
                        </FormGroup>
                      </Col>
                    )}

                    {employmentPurpose && (
                      <>
                        <Col>
                          <FormGroup>
                            <Label>Exempted Cases</Label>
                            <Select
                              isClearable={true}
                              name={"exemption"}
                              onChange={(selectedOption) => {
                                props.setFieldValue(
                                  "exemption",
                                  selectedOption ? selectedOption : {}
                                );
                              }}
                              placeholder="Select Purpose"
                              value={props?.values?.exemption}
                              options={discountOptions}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label for="exemptionProof">
                              Attachment (Upload Image as Proof for Discount)
                            </Label>
                            <Input
                              id="exemptionProof"
                              name="exemption_proof"
                              type="file"
                              onChange={(event) => {
                                props.setFieldValue(
                                  "exemption_proof",
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </>
                    )}

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="policeClearance">Police Clearance</Label>
                          <div className="d-flex gap-1">
                            <Input
                              id="policeClearance"
                              name="police_clearance"
                              type="file"
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "police_clearance",
                                  event.currentTarget.files[0]
                                );
                              }}
                              accept="image/*"
                            />
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
                          <Label for="taxCert">Community Tax Certificate</Label>
                          <div className="d-flex gap-1">
                            <Input
                              id="taxCert"
                              name={`community_tax_certificate`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "community_tax_certificate",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                              accept="image/*"
                            />
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
                            Barangay Clearance (As proof of Residency)
                          </Label>
                          <div className="d-flex gap-1">
                            <Input
                              id="exampleFile"
                              name={`barangay_clearance`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "barangay_clearance",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                              accept="image/*"
                            />
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
                          <Label for="fiscalClearance">Fiscal Clearance</Label>
                          <div className="d-flex gap-1">
                            <Input
                              id="fiscalClearance"
                              name={`fiscal_clearance`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "fiscal_clearance",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                              accept="image/*"
                            />
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
                          <Label for="courtClearance">Court Clearance</Label>
                          <div className="d-flex gap-1">
                            <Input
                              id="courtClearance"
                              name={`court_clearance`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "court_clearance",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                              accept="image/*"
                            />
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
              <Input type="checkbox" onClick={setProceedHandle} />
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
                purpose_id: formikRef?.current?.values?.purpose,
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
                  [toggleModal]
                );
                setIsProceed(false);
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

export default GoodMoralModal;
