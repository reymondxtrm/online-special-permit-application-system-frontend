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
import UploadWithCropperModal from "./UploadWithCropperModal";
import useImageCompressor from "hooks/Common/useImageCompressor";

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
  const [inputPicture, setInputPicture] = useState();
  const [uploadImageModal, setUploadImageModal] = useState(false);
  const fileInputRef = useRef();
  const {
    isFetching: getImageIsFetching,
    currentImage,
    getImageHandle,
  } = useGetImage();
  const {
    compressedFiles,
    isCompressing,
    errors: compressionErrors,
    handleImageChange,
  } = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  const user = useSelector((state) => state.user);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setInputPicture(url);
    toggleUploadImageModal();
  };
  const onCropDone = (image) => {
    formikRef.current.setFieldValue(`id_picture`, image);
    toggleUploadImageModal();
  };
  const validationSchema = Yup.object().shape({
    type: Yup.string().required(),

    id: Yup.mixed().nullable(),

    company_name: Yup.string().nullable(),
    company_address: Yup.string().nullable(),
    position: Yup.string().nullable(),

    certificate_of_employment: Yup.mixed().required(
      "Certificate of employment is required",
    ),

    community_tax_certificate: Yup.mixed().required(
      "Community tax certificate is required",
    ),

    id_picture: Yup.mixed().required("ID picture is required"),
    training_certificate: Yup.mixed().test(
      "training_cert_required",
      "Training certificate is required",
      function (value) {
        if (tableData?.company_type !== "NON-FOOD-MASSEUR") return true;

        if (isUpdate && uploadedFile?.training_certificate) return true;

        return value instanceof File || value instanceof Blob;
      },
    ),
  });
  const handleFileChange = async (e, fieldName, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    const compressed = await handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(fieldName, compressed);
      props.setFieldTouched(fieldName, true, true);
    }
  };
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
              company_type: res?.occupation_details?.company_type,
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
    setInputPicture(capturedPicture);
    toggleUploadImageModal();
    togglePictureModal();
    handleImageChange(capturedPicture, 1, "base64");
  };

  const togglePictureModal = () => {
    setCameraIsOpen((prev) => !prev);
  };

  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const toggleUploadImageModal = () => {
    setUploadImageModal((prev) => !prev);
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
      {uploadImageModal && (
        <UploadWithCropperModal
          openModal={uploadImageModal}
          toggleModal={toggleUploadImageModal}
          image={inputPicture}
          onCropDone={onCropDone}
        />
      )}

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
                                  className="flex-grow-1"
                                  style={{ maxWidth: "400px" }}
                                >
                                  <Input
                                    accept="image/*"
                                    id="certificateOfEmployment"
                                    name="certificate_of_employment"
                                    type="file"
                                    onChange={(e) => {
                                      handleFileChange(
                                        e,
                                        "certificate_of_employment",
                                        0,
                                        props,
                                      );
                                    }}
                                    disabled={isCompressing}
                                    onBlur={props.handleBlur}
                                    invalid={
                                      props.touched.certificate_of_employment &&
                                      Boolean(
                                        props.errors.certificate_of_employment,
                                      )
                                    }
                                  />
                                  {compressionErrors[0] && (
                                    <div
                                      className="text-warning mt-1"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      Compression error: {compressionErrors[0]}
                                    </div>
                                  )}
                                  {props.touched.certificate_of_employment &&
                                    props.errors.certificate_of_employment && (
                                      <div
                                        className="text-danger mt-1"
                                        style={{ fontSize: "80%" }}
                                      >
                                        {props.errors.certificate_of_employment}
                                      </div>
                                    )}
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
                                      <i className="mdi mdi-eye"></i>
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

                            <td colSpan={2}>
                              <div className="d-flex gap-2">
                                <div
                                  className="flex-grow-1"
                                  style={{ maxWidth: "400px" }}
                                >
                                  <Input
                                    accept="image/*"
                                    id="communityTaxCertificate"
                                    name="community_tax_certificate"
                                    type="file"
                                    disabled={isCompressing}
                                    onChange={(e) => {
                                      handleFileChange(
                                        e,
                                        "community_tax_certificate",
                                        1,
                                        props,
                                      );
                                    }}
                                    onBlur={props.handleBlur}
                                    invalid={
                                      props.touched.community_tax_certificate &&
                                      Boolean(
                                        props.errors.community_tax_certificate,
                                      ) &&
                                      !props.values.no_cedula
                                    }
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
                                    props.errors.community_tax_certificate &&
                                    !props.values.no_cedula && (
                                      <div
                                        className="text-danger mt-1"
                                        style={{ fontSize: "80%" }}
                                      >
                                        {props.errors.community_tax_certificate}
                                      </div>
                                    )}
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
                                      <i className="mdi mdi-eye"></i>
                                    </Button>
                                  )}
                              </div>
                            </td>
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
                                {props.values?.id_picture && (
                                  <img
                                    src={props.values.id_picture}
                                    alt="Captured ID"
                                    className="img-fluid rounded border"
                                    style={{
                                      transition: "0.3s",
                                      opacity: 1,
                                      maxHeight: "150px",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                                <div className="d-flex flex-column gap-2">
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
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      handleClick();
                                    }}
                                  >
                                    Upload image
                                  </Button>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleChange}
                                  />
                                </div>

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
                                    <i className="mdi mdi-eye"></i>
                                  </Button>
                                )}
                              </div>
                              {props.touched.id_picture &&
                                props.errors.id_picture && (
                                  <div
                                    className="text-danger mt-1"
                                    style={{ fontSize: "80%" }}
                                  >
                                    {props.errors.id_picture}
                                  </div>
                                )}
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
                                    className="flex-grow-1"
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
                                          event.currentTarget.files[0],
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      invalid={
                                        props.touched.training_certificate &&
                                        Boolean(
                                          props.errors.training_certificate,
                                        )
                                      }
                                    />
                                    {props.touched.training_certificate &&
                                      props.errors.training_certificate && (
                                        <div
                                          className="text-danger mt-1"
                                          style={{ fontSize: "80%" }}
                                        >
                                          {props.errors.training_certificate}
                                        </div>
                                      )}
                                  </div>

                                  {isUpdate &&
                                    uploadedFile?.training_certificate && (
                                      <Button
                                        color="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          getImageHandle({
                                            path: uploadedFile?.training_certificate,
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
              // Validate form before submitting
              const errors = await formikRef.current.validateForm();
              formikRef.current.setTouched({
                certificate_of_employment: true,
                community_tax_certificate: true,
                id_picture: true,
                training_certificate: true,
              });

              if (Object.keys(errors).length > 0) {
                return;
              }

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
                [toggleModal, toggleRefresh],
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
