import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Form,
  Row,
  Col,
  Input,
  Label,
  Spinner,
  FormFeedback,
} from "reactstrap";

import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import PassportCamera from "../SpecialPermit/AuthClientPages/Common/PassportCamera";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import * as Yup from "yup";
import PrivateImageViewer from "../SpecialPermit/Common/PrivateImageViewer";
import BasicInputField from "components/Forms/BasicInputField";
import { useSelector } from "react-redux";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import useGetImage from "hooks/Common/useGetImage";
function OccupationalPermitModal({
  openModal,
  toggleModal,
  mode = "create", // "create" or "update"
  title = "Occupational Permit",
  fetchUrl,
  submitUrl,
  applicationId,
  isUpdate = false,
  toggleRefresh = () => {},
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [tableData, setTableData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [uploadedFile, setUploadedFiles] = useState({});
  const [imageViewer, setOpenImageViewer] = useState(false);
  const [viewImage, setViewImage] = useState();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const {
    isFetching: getImageIsFetching,
    currentImage,
    getImageHandle,
  } = useGetImage();
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (openModal && isUpdate && applicationId) {
  //     axios
  //       .get("api/client/get-single-permmit-application", {
  //         params: {
  //           special_permit_application_id: applicationId,
  //         },
  //       })
  //       .then((res) => {
  //         const data = res.data.data;
  //         setExistingData({
  //           requestor_name: data.requestor_name,
  //           event_name: data.event_name,
  //           event_date_from: data.event_date_from,
  //           event_date_to: data.event_date_to,
  //           event_time_from: data.event_time_from,
  //           event_time_to: data.event_time_to,
  //         });

  //         setUploadedFiles(data.uploaded_file || {});
  //       });
  //   }
  // }, [openModal, isUpdate, applicationId]);

  const validationSchema = Yup.object().shape({
    type: Yup.string().required(),

    id: Yup.mixed().nullable(),

    company_name: Yup.string().nullable(),
    company_address: Yup.string().nullable(),
    position: Yup.string().nullable(),

    certificate_of_employment: Yup.mixed()
      .required("Certificate of employment is required")
      .test(
        "fileType",
        "Only image files are allowed",
        (value) =>
          value === null ||
          value === "" ||
          value instanceof File ||
          value instanceof Blob
      ),

    community_tax_certificate: Yup.mixed().when("no_cedula", {
      is: false,
      then: Yup.mixed()
        .required("Community tax certificate is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value) =>
            value === null ||
            value === "" ||
            value instanceof File ||
            value instanceof Blob
        ),
      otherwise: Yup.mixed().nullable(),
    }),

    id_picture: Yup.mixed()
      .required("ID picture is required")
      .test(
        "fileType",
        "Invalid ID picture format",
        (value) =>
          value instanceof File ||
          value instanceof Blob ||
          typeof value === "string" // when editing (already uploaded)
      ),

    training_certificate: Yup.mixed().when("company_type", {
      is: (v) => v === "NON-FOOD-MASSEUR",
      then: Yup.mixed()
        .required("Training certificate is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value) =>
            value === null ||
            value === "" ||
            value instanceof File ||
            value instanceof Blob
        ),
      otherwise: Yup.mixed().nullable(),
    }),
  });
  useEffect(() => {
    if (openModal && fetchUrl) {
      const fetchData = async () => {
        try {
          setIsFetching(true);
          const response = await axios({
            method: "GET",
            url: fetchUrl,
            params: {
              special_permit_application_id: applicationId || null,
            },
          });
          if (mode === "update") {
            const res = response.data;
            setTableData({
              id: res?.special_permit_application_id,
              monnthly_income: res?.occupation_details?.monthly_income,
              company_name: res?.occupation_details?.company_name,
              full_address: res?.occupation_details?.full_address,
              position: res?.occupation_details?.position,
              monthly_income: res?.occupation_details?.monthly_income,
            });
            setUploadedFiles({ ...res?.uploaded_files });
          } else {
            setTableData(response.data);
          }
          setIsFetching(false);
        } catch (err) {
          console.log(err);
        } finally {
          setIsFetching(false);
        }
      };

      fetchData();
    }
  }, [openModal, fetchUrl]);

  const setIdPicture = (capturedPicture) => {
    formikRef.current.setFieldValue("id_picture", capturedPicture);
  };

  const togglePictureModal = () => {
    setCameraIsOpen((prev) => !prev);
  };
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  };
  const toggleImageViewer = () => {
    setOpenImageViewer((prev) => !prev);
  };

  return (
    <>
      {isViewerOpen && !getImageIsFetching && currentImage && (
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
      <PassportCamera
        onCapture={setIdPicture}
        isOpen={cameraIsOpen}
        toggle={togglePictureModal}
        image={formikRef?.current?.values?.id_picture}
      />
      <PrivateImageViewer
        toggleModal={toggleImageViewer}
        openModal={imageViewer}
        path={viewImage}
      />

      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        size="lg"
        backdrop="static"
        fade
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleModal}>
          <p className="fw-bold fs-4 text-primary">{title}</p>
        </ModalHeader>

        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            validationSchema={isUpdate ? null : validationSchema}
            validateOnChange={!isUpdate}
            validateOnBlur={!isUpdate}
            initialValues={{
              type: "occupational_permit",
              id: tableData?.id || null,
              certificate_of_employment: "",
              community_tax_certificate: "",
              id_picture: "",
              training_certificate: "",
              // monthly_income: tableData?.monthly_income || "",
              company_name: tableData?.company_name || "",
              company_address: tableData?.full_address || "",
              position: tableData?.position || "",
              no_cedula: false,
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                {isFetching ? (
                  <div className="text-center">
                    <Spinner color="primary">Loading ...</Spinner>
                  </div>
                ) : (
                  <Row>
                    <Col>
                      <Table borderless>
                        <tbody>
                          <tr>
                            <td className="text-end">
                              <Label>
                                Company Name:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <BasicInputField
                                col={12}
                                label={null}
                                name="company_name"
                                type="text"
                                value={props.values.company_name}
                                touched={props.touched.company_name}
                                errors={props.errors.company_name}
                                validation={props}
                                disable={true}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="text-end">
                              <Label>
                                Company Address:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <BasicInputField
                                col={12}
                                label={null}
                                name="company_address"
                                type="text"
                                value={props.values.company_address}
                                touched={props.touched.company_address}
                                errors={props.errors.company_address}
                                validation={props}
                                disable={true}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="text-end">
                              <Label>
                                Occupation:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <BasicInputField
                                col={12}
                                label={null}
                                name="position"
                                type="text"
                                value={props.values.position}
                                touched={props.touched.position}
                                errors={props.errors.position}
                                validation={props}
                                disable={true}
                              />
                            </td>
                          </tr>

                          {/* <tr>
                            <td className="text-end">
                              <Label>
                                Monthly Income:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <BasicInputField
                                col={12}
                                label={null}
                                name="monthly_income"
                                type="number"
                                placeholder="0.00"
                                value={props.values.monthly_income}
                                touched={props.touched.monthly_income}
                                errors={props.errors.monthly_income}
                                validation={props}
                                required={true}
                              />
                            </td>
                          </tr> */}

                          <tr>
                            <td className="text-end">
                              <Label>
                                Certificate of Employment:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <div className="d-flex gap-2">
                                <div
                                  className="d-flex flex-column"
                                  style={{ maxWidth: "400px" }}
                                >
                                  <Input
                                    accept="image/*"
                                    id="certificateOfEmployment"
                                    name="certificate_of_employment"
                                    type="file"
                                    onChange={(event) => {
                                      props.setFieldValue(
                                        "certificate_of_employment",
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                    onBlur={props.handleBlur}
                                    invalid={
                                      props.touched.certificate_of_employment &&
                                      props.errors.certificate_of_employment
                                        ? true
                                        : false
                                    }
                                  />

                                  {props.touched.certificate_of_employment &&
                                  props.errors.certificate_of_employment ? (
                                    <FormFeedback type="invalid">
                                      {props.errors.certificate_of_employment}
                                    </FormFeedback>
                                  ) : null}
                                </div>

                                {isUpdate &&
                                  uploadedFile?.certificate_of_employment && (
                                    <Button
                                      color="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        getImageHandle({
                                          path: uploadedFile?.certificate_of_employment,
                                          url: "api/client/attachment",
                                          showLoader: true,
                                        });
                                        toggleIsViewerOpen();
                                      }}
                                    >
                                      <i
                                        className="mdi mdi-eye"
                                        color="warning"
                                      ></i>
                                    </Button>
                                  )}
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="text-end">
                              <Label>
                                Community Tax Certificate:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>

                            <td>
                              <div className="d-flex gap-2">
                                <div
                                  className="d-flex flex-column"
                                  style={{ maxWidth: "300px" }}
                                >
                                  <Input
                                    accept="image/*"
                                    id="communityTaxCertificate"
                                    name="community_tax_certificate"
                                    type="file"
                                    disabled={props.values.no_cedula}
                                    onChange={(event) => {
                                      props.setFieldValue(
                                        "community_tax_certificate",
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                    onBlur={props.handleBlur}
                                    invalid={
                                      props.touched.community_tax_certificate &&
                                      props.errors.community_tax_certificate
                                        ? true
                                        : false
                                    }
                                  />

                                  {props.touched.community_tax_certificate &&
                                  props.errors.community_tax_certificate &&
                                  !props.values.no_cedula ? (
                                    <FormFeedback type="invalid">
                                      {props.errors.community_tax_certificate}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                                {isUpdate &&
                                  uploadedFile?.community_tax_certificate && (
                                    <Button
                                      color="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        getImageHandle({
                                          path: uploadedFile?.community_tax_certificate,
                                          url: "api/client/attachment",
                                          showLoader: true,
                                        });
                                        toggleIsViewerOpen();
                                      }}
                                    >
                                      <i
                                        className="mdi mdi-eye"
                                        color="warning"
                                      ></i>
                                    </Button>
                                  )}
                              </div>
                            </td>

                            {/* <td>
                              <div className="d-flex gap-2 align-items-center">
                                <Input
                                  type="checkbox"
                                  style={{ width: "20px", height: "20px" }}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      "no_cedula",
                                      e.target.checked
                                    );
                                  }}
                                />
                                <span
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  {"Don't have Cedula?"}
                                </span>
                              </div>
                            </td> */}
                          </tr>

                          <tr>
                            <td className="text-end">
                              <Label>
                                ID Picture:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                            </td>
                            <td colSpan={2}>
                              <div className="d-flex align-items-center gap-2">
                                <Button
                                  color="primary"
                                  outline
                                  className="d-flex align-items-center gap-2"
                                  style={{
                                    borderRadius: "6px",
                                    padding: "10px 14px",
                                    fontWeight: 500,
                                  }}
                                  onClick={togglePictureModal}
                                >
                                  <i className="mdi mdi-camera fs-4"></i>
                                  Take Picture
                                </Button>
                                {isUpdate && uploadedFile?.id_picture && (
                                  <Button
                                    color="primary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      getImageHandle({
                                        path: uploadedFile?.id_picture,
                                        url: "api/client/attachment",
                                        showLoader: true,
                                      });
                                      toggleIsViewerOpen();
                                    }}
                                  >
                                    <i
                                      className="mdi mdi-eye"
                                      color="warning"
                                    ></i>
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {tableData?.company_type === "NON-FOOD-MASSEUR" && (
                            <tr>
                              <td className="text-end">
                                <Label>
                                  Training Certificate:
                                  <span style={{ color: "red" }}>&nbsp;*</span>
                                </Label>
                              </td>

                              <td colSpan={2}>
                                <div className="d-flex gap-2">
                                  <div
                                    className="d-flex flex-column"
                                    style={{ maxWidth: "400px" }}
                                  >
                                    <Input
                                      accept="image/*"
                                      id="trainingCertificate"
                                      name="training_certificate"
                                      type="file"
                                      onChange={(event) => {
                                        props.setFieldValue(
                                          "training_certificate",
                                          event.currentTarget.files[0]
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      invalid={
                                        props.touched.training_certificate &&
                                        props.errors.training_certificate
                                          ? true
                                          : false
                                      }
                                    />

                                    {props.touched.training_certificate &&
                                    props.errors.training_certificate ? (
                                      <FormFeedback type="invalid">
                                        {props.errors.training_certificate}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                  {isUpdate &&
                                    uploadedFile?.community_tax_certificate && (
                                      <Button
                                        color="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getImageHandle({
                                            path: uploadedFile?.community_tax_certificate,
                                            url: "api/client/attachment",
                                            showLoader: true,
                                          });
                                          toggleIsViewerOpen();
                                        }}
                                      >
                                        <i
                                          className="mdi mdi-eye"
                                          color="warning"
                                        ></i>
                                      </Button>
                                    )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
              </Form>
            )}
          </Formik>
        </ModalBody>

        <ModalFooter>
          <Button
            style={{ backgroundColor: "#1a56db", color: "white" }}
            onClick={async () => {
              const params = {
                ...formikRef.current.values,
                special_permit_application_id: applicationId,
              };
              const formData = getFormData(params);
              handleSubmit(
                {
                  url: submitUrl,
                  headers: { "Content-Type": "multipart/form-data" },
                  message: {
                    title: "Are you sure you want to submit?",
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
            {mode === "create" ? "Submit Application" : "Update Permit"}
          </Button>

          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default OccupationalPermitModal;
