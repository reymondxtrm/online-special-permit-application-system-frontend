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

import Select from "react-select";
import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import { USER_PRIVACY } from "assets/data/data";
import useGetImage from "hooks/Common/useGetImage";
import ImageViewer from "react-image-viewer-zoom";

function MayorsCertificateModal({
  openModal,
  toggleModal,
  isUpdate = false,
  specialPermitApplicationId,
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

  const setProceedHandle = () => {
    setIsProceed((prev) => !prev);
  };
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
            const data = res.data;
            console.log(res.data);
            setExistingData({
              purpose_id: {
                value: data.purpose?.id,
                label: data.purpose?.name,
              },
              other_purpose: data?.other_purpose || "",
            });

            setUploadedFiles(data?.uploaded_files || []);
          },
          (error) => console.log(error)
        );
    }
  }, [openModal, isUpdate, specialPermitApplicationId]);

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
      {/* {isViewingOpen && !isFetching && currentImage && (
        <ImageViewer
          src={[currentImage]}
          currentIndex={0}
          onClose={toggleIsViewerOpen}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
          }}
          closeOnClickOutside={true}
          disableZoom={false} // ✔ enables zoom
        />
      )} */}
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
          overflowY: "auto",
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
            {isUpdate ? "UPDATE MAYOR'S CERTIFICATE" : "MAYOR'S CERTIFICATE"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              type: "mayors_permit",
              purpose_id: existingData?.purpose_id || "",
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
                          <Label>Purpose</Label>
                          <Select
                            isClearable={true}
                            name="purpose"
                            value={props.values.purpose_id || null}
                            onChange={(selectedOption) => {
                              const label = selectedOption?.label;
                              if (label === "Others") {
                                setotherPurpose(true);
                              } else {
                                setotherPurpose(false);
                              }
                              // store the option object (or "" if cleared)
                              props.setFieldValue(
                                "purpose_id",
                                selectedOption ?? ""
                              );
                            }}
                            placeholder="Select Purpose"
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
                            name="other_purpose"
                            value={props.values.other_purpose}
                            onChange={props.handleChange}
                            placeholder="Enter your purpose"
                          />
                        </FormGroup>
                      </Col>
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
                              <Button
                                color="primary"
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
                                <i className="mdi mdi-eye" color="warning"></i>
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
            // onClick={() => {
            //   const formik = formikRef.current.values;

            //   const formData = getFormData(formik);
            //   if (proceed) {
            //     handleSubmit(
            //       {
            //         url: "api/client/special-permit/mayors-permit",
            //         headers: {
            //           "Content-Type": "multipart/form-data",
            //         },
            //         message: {
            //           title: "Are you sure you want to Proceed?",
            //           failedTitle: "FAILED",
            //           success: "Success!",
            //           error: "unknown error occured",
            //         },
            //         params: formData,
            //       },
            //       [],
            //       [toggleModal]
            //     );
            //     setIsProceed(false);
            //   }
            // }}
            onClick={() => {
              const formik = formikRef.current?.values ?? {};
              const formData = getFormData(formik);
              if (proceed) {
                handleSubmit(
                  {
                    url: "api/client/special-permit/mayors-permit",
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

export default MayorsCertificateModal;
