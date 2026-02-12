import BasicInputField from "components/Forms/BasicInputField";
import { helper } from "echarts/lib/export";
import { FieldArray, Form, Formik, FormikProvider, useFormik } from "formik";
import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

import Select from "react-select";
import PassportCamera from "../SpecialPermit/AuthClientPages/Common/PassportCamera";
import CedulaAddtionalDetailsModal from "./CedulaAddtionalDetailsModal";
import useSubmit from "hooks/Common/useSubmit";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import useGetImage from "hooks/Common/useGetImage";
import Viewer from "react-viewer";
import UploadWithCropperModal from "./UploadWithCropperModal";
import useImageCompressor from "hooks/Common/useImageCompressor";

export default function CompanyOccupationalPermitModal({
  isOpen,
  toggleModal,
}) {
  const formikRef = useRef();
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [inputPicture, setInputPicture] = useState(null);
  const [uploadImageMode, setUploadImageMode] = useState("camera");
  const [uploadImageModal, setUploadImageModal] = useState(false);
  const { getImageHandle, isFetching, currentImage } = useGetImage();

  const cedulaCompressor = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  const certificateCompressor = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  const trainingCompressor = useImageCompressor({
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
  });

  const fileInputRef = useRef(null);
  const handleSubmit = useSubmit();
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "PREFER NOT TO SAY", label: "Prefer not to say" },
  ];

  const setIdPicture = (capturedPicture) => {
    setInputPicture(capturedPicture);
    toggleUploadImageModal();
    togglePasssportCamera();
  };

  const user = useSelector((state) => state.user);

  const togglePasssportCamera = () => {
    setCameraIsOpen((prev) => !prev);
  };

  const toggleImageViewer = useCallback(() => {
    setIsViewerOpen((prev) => !prev);
  }, []);

  const onCropDone = (image) => {
    validation.setFieldValue(`employees[${activeIndex}].id_picture`, image);
    toggleUploadImageModal();
  };

  const toggleUploadImageModal = () => {
    setUploadImageModal((prev) => !prev);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setInputPicture(url);
    toggleUploadImageModal();
  };

  const getFormData = (object, form = new FormData(), namespace = "") => {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const formKey = namespace ? `${namespace}[${key}]` : key;
        const value = object[key];
        if (value instanceof File || value instanceof Blob) {
          form.append(formKey, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              getFormData(item, form, `${formKey}[${index}]`);
            } else {
              form.append(`${formKey}[${index}]`, item);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          getFormData(value, form, formKey);
        } else {
          form.append(formKey, value ?? "");
        }
      }
    }
    return form;
  };

  const handleCedulaChange = async (e, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    const compressed = await cedulaCompressor.handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(`employees[${index}].cedula`, compressed);
      props.setFieldTouched(`employees[${index}].cedula`, true, true);
    }
  };

  const handleCertificateChange = async (e, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    const compressed = await certificateCompressor.handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(
        `employees[${index}].certificate_of_employment`,
        compressed,
      );
      props.setFieldTouched(
        `employees[${index}].certificate_of_employment`,
        true,
        true,
      );
    }
  };

  const handleTrainingChange = async (e, index, props) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    const compressed = await trainingCompressor.handleImageChange(e, index);
    if (compressed) {
      props.setFieldValue(
        `employees[${index}].training_certificate`,
        compressed,
      );
      props.setFieldTouched(
        `employees[${index}].training_certificate`,
        true,
        true,
      );
    }
  };

  const employeeSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    birth_date: Yup.string().required("Birth date is required"),
    gender: Yup.string().required("Gender is required"),
    address_line: Yup.string().required("Home address is required"),
    contact_no: Yup.string().required("Contact number is required"),
    occupation: Yup.string().required("Occupation is required"),
    no_cedula: Yup.boolean(),

    cedula: Yup.mixed().test(
      "cedula_required",
      "Cedula is required",
      function (value) {
        const { no_cedula } = this.parent;
        if (no_cedula) return true;
        return value instanceof File || value instanceof Blob;
      },
    ),

    certificate_of_employment: Yup.mixed().test(
      "certificate_required",
      "Certificate of Employment is required",
      function (value) {
        return value instanceof File || value instanceof Blob;
      },
    ),

    training_certificate: Yup.mixed().test(
      "training_cert_required",
      "Training certificate is required",
      function (value) {
        if (user?.companyType === "NON-FOOD-MASSEUR") {
          return value instanceof File || value instanceof Blob;
        }
        return true;
      },
    ),

    id_picture: Yup.mixed().test(
      "id_picture_required",
      "ID picture is required",
      function (value) {
        return value !== null && value !== "";
      },
    ),
  });

  const validationSchema = Yup.object().shape({
    employees: Yup.array()
      .of(employeeSchema)
      .min(1, "At least one employee is required"),
  });
  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      employees: [
        {
          fname: "",
          mname: "",
          lname: "",
          birth_date: "",
          gender: "",
          address_line: "",
          date_hired: "",
          subdivision: "",
          barangay: "",
          city: "",
          province: "",
          contact_no: "",
          id_picture: null,
          cedula: null,
          certificate_of_employment: null,
          training_certificate: null,
          no_cedula: false,
          citizenship: "",
          civil_status: "",
          place_of_birth: "",
          blood_type: "",
          height: "",
          weight: "",
          tin: "",
          occupation: "",
          monthly_salary: 0.0,
        },
      ],
    },
    onSubmit: async (values) => {
      const request = getFormData(values);

      const response = await handleSubmit(
        {
          url: "api/client/company-occupational-permit-application",
          method: "POST",
          params: request,
          headers: { "Content-Type": "multipart/form-data" },
          message: {
            title: "Are you sure you want to submit?",
            failedTitle: "FAILED",
            success: "Success!",
            error: "Unknown error occurred",
          },
        },
        [],
        [toggleModal],
      );
      if (response) {
        // formikRef.current.reset();
        cedulaCompressor.reset();
        certificateCompressor.reset();
        trainingCompressor.reset();
      }
    },
  });

  return (
    <React.Fragment>
      {isViewerOpen && currentImage && isFetching === false && (
        <>
          <Viewer
            visible={isViewerOpen}
            onClose={toggleImageViewer}
            images={[{ src: currentImage, alt: "Attachment" }]}
            activeIndex={0}
            rotatable
            zoomable
            scalable
            attribute={false}
            zIndex={99999}
          />
        </>
      )}
      {cameraIsOpen && (
        <PassportCamera
          onCapture={setIdPicture}
          isOpen={cameraIsOpen}
          toggle={togglePasssportCamera}
          image={formikRef?.current?.values?.employees[activeIndex]?.id_picture}
        />
      )}
      {uploadImageModal && (
        <UploadWithCropperModal
          openModal={uploadImageModal}
          toggleModal={toggleUploadImageModal}
          image={inputPicture}
          onCropDone={onCropDone}
        />
      )}

      <Modal toggle={toggleModal} isOpen={isOpen} fullscreen>
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
            OCCUPATIONAL
          </p>
        </ModalHeader>
        <ModalBody>
          <FormikProvider value={validation}>
            <Form onSubmit={validation.handleSubmit}>
              <FieldArray name="employees">
                {(fieldArrayHelper) => (
                  <>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>NAME</th>
                          <th>OCCUPATION</th>
                          <th>DATE BIRTH</th>
                          <th>GENDER</th>
                          <th>HOME ADDRESS</th>
                          <th>CONTACT NO.</th>
                          <th>ID PICTURE</th>
                          <th>CEDULA</th>
                          <th>CERTIFICATE OF EMPLOYMENT</th>
                          {user?.companyType === "NON-FOOD-MASSEUR" && (
                            <th>TRAINING CERTIFICATE</th>
                          )}
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validation?.values?.employees?.map(
                          (employee, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td style={{ width: "10%" }}>
                                <div className="d-flex flex-column gap-0">
                                  <BasicInputField
                                    type={"text"}
                                    validation={validation}
                                    name={`employees[${index}].fname`}
                                    value={employee?.fname}
                                    touched={
                                      validation?.touched?.employees?.[index]
                                        ?.fname
                                    }
                                    errors={
                                      validation?.errors?.employees?.[index]
                                        ?.fname
                                    }
                                    placeholder={"First name"}
                                    col={12}
                                  />
                                  <BasicInputField
                                    type={"text"}
                                    validation={validation}
                                    name={`employees[${index}].mname`}
                                    value={employee.mname}
                                    placeholder={"Middle name"}
                                    touched={
                                      validation?.touched?.employees?.[index]
                                        ?.mname
                                    }
                                    errors={
                                      validation?.errors?.employees?.[index]
                                        ?.mname
                                    }
                                    col={12}
                                  />
                                  <BasicInputField
                                    type={"text"}
                                    validation={validation}
                                    name={`employees[${index}].lname`}
                                    value={employee?.lname}
                                    placeholder={"Last name"}
                                    touched={
                                      validation?.touched?.employees?.[index]
                                        ?.lname
                                    }
                                    errors={
                                      validation?.errors?.employees?.[index]
                                        ?.lname
                                    }
                                    col={12}
                                  />
                                </div>
                              </td>
                              <td>
                                <BasicInputField
                                  validation={validation}
                                  name={`employees[${index}].occupation`}
                                  value={employee?.occupation}
                                  type={"text"}
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.occupation
                                  }
                                  placeholder={"Occupation"}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.occupation
                                  }
                                />
                              </td>
                              <td>
                                <BasicInputField
                                  validation={validation}
                                  name={`employees[${index}].birth_date`}
                                  value={employee?.birth_date}
                                  type={"date"}
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.birth_date
                                  }
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.birth_date
                                  }
                                />
                              </td>
                              <td>
                                <Select
                                  placeholder="Gender"
                                  options={genderOptions}
                                  value={genderOptions.find(
                                    (option) =>
                                      option.value === employee.gender,
                                  )}
                                  onChange={(selected) => {
                                    validation.setFieldValue(
                                      `employees[${index}].gender`,
                                      selected.value,
                                    );
                                  }}
                                  onBlur={() =>
                                    validation.setFieldTouched(
                                      `employees[${index}].gender`,
                                      true,
                                    )
                                  }
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderColor:
                                        validation.touched.employees?.[index]
                                          ?.gender &&
                                        validation.errors.employees?.[index]
                                          ?.gender
                                          ? "#dc3545"
                                          : base.borderColor,
                                    }),
                                  }}
                                />
                                {validation.touched.employees?.[index]
                                  ?.gender &&
                                validation.errors.employees?.[index]?.gender ? (
                                  <div
                                    className="text-danger mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {validation.errors.employees[index].gender}
                                  </div>
                                ) : null}
                              </td>

                              <td>
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].address_line`}
                                  value={employee.address_line}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.address_line
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.address_line
                                  }
                                  placeholder={"Street No./Purok"}
                                  label={"House No. / Street / Purok"}
                                />
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].subdivision`}
                                  value={employee.subdivision}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.subdivision
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.subdivision
                                  }
                                  placeholder={"Subdivision"}
                                  label={"Subdivision"}
                                />
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].barangay`}
                                  value={employee.barangay}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.barangay
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.barangay
                                  }
                                  placeholder={"Barangay"}
                                  label={"Barangay"}
                                />
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].city`}
                                  value={employee.city}
                                  errors={
                                    validation?.errors?.employees?.[index]?.city
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.city
                                  }
                                  placeholder={"City/Municipality"}
                                  label="City/Municipality"
                                />
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].province`}
                                  value={employee.province}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.province
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.province
                                  }
                                  placeholder={"Province"}
                                  label="Province"
                                />
                              </td>
                              <td>
                                <BasicInputField
                                  validation={validation}
                                  type={"text"}
                                  name={`employees[${index}].contact_no`}
                                  value={employee.contact_no}
                                  errors={
                                    validation?.errors?.employees?.[index]
                                      ?.contact_no
                                  }
                                  touched={
                                    validation?.touched?.employees?.[index]
                                      ?.contact_no
                                  }
                                  placeholder={"Phone number"}
                                />
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-2">
                                  {validation.values.employees?.[index]
                                    ?.id_picture && (
                                    <img
                                      src={
                                        validation.values.employees[index]
                                          .id_picture
                                      }
                                      alt="Captured ID"
                                      className="img-fluid rounded border"
                                      style={{
                                        transition: "0.3s",
                                        opacity: 1,
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  <Button
                                    color="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      togglePasssportCamera();
                                      setActiveIndex(index);
                                      setUploadImageMode("camera");
                                    }}
                                  >
                                    <i className="mdi mdi-camera fs-5"></i>
                                  </Button>
                                  <Button
                                    color="primary"
                                    outline
                                    size="sm"
                                    onClick={() => {
                                      handleClick();
                                      setActiveIndex(index);
                                      setUploadImageMode("upload");
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
                                  {validation.touched?.employees?.[index]
                                    ?.id_picture &&
                                    validation.errors?.employees?.[index]
                                      ?.id_picture && (
                                      <div
                                        className="text-danger"
                                        style={{ fontSize: "11px" }}
                                      >
                                        {
                                          validation.errors.employees[index]
                                            .id_picture
                                        }
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td style={{ width: "10%" }}>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  name={`employees[${index}].cedula`}
                                  disabled={cedulaCompressor.isCompressing}
                                  onChange={(e) =>
                                    handleCedulaChange(e, index, validation)
                                  }
                                  onBlur={() =>
                                    validation.setFieldTouched(
                                      `employees[${index}].cedula`,
                                      true,
                                    )
                                  }
                                  invalid={
                                    !employee.no_cedula &&
                                    validation.touched.employees?.[index]
                                      ?.cedula &&
                                    Boolean(
                                      validation.errors.employees?.[index]
                                        ?.cedula,
                                    )
                                  }
                                />
                                {cedulaCompressor.isCompressing && (
                                  <div
                                    className="text-info mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Compressing...
                                  </div>
                                )}
                                {cedulaCompressor.errors[index] && (
                                  <div
                                    className="text-warning mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Compression error:{" "}
                                    {cedulaCompressor.errors[index]}
                                  </div>
                                )}

                                {!employee.no_cedula &&
                                  validation.touched.employees?.[index]
                                    ?.cedula &&
                                  validation.errors.employees?.[index]
                                    ?.cedula && (
                                    <div
                                      className="text-danger mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {
                                        validation.errors.employees[index]
                                          .cedula
                                      }
                                    </div>
                                  )}
                              </td>
                              <td style={{ width: "10%" }}>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  disabled={certificateCompressor.isCompressing}
                                  onChange={(e) =>
                                    handleCertificateChange(
                                      e,
                                      index,
                                      validation,
                                    )
                                  }
                                  onBlur={() =>
                                    validation.setFieldTouched(
                                      `employees[${index}].certificate_of_employment`,
                                      true,
                                    )
                                  }
                                  invalid={
                                    validation.touched?.employees?.[index]
                                      ?.certificate_of_employment &&
                                    Boolean(
                                      validation.errors?.employees?.[index]
                                        ?.certificate_of_employment,
                                    )
                                  }
                                />
                                {certificateCompressor.isCompressing && (
                                  <div
                                    className="text-info mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Compressing...
                                  </div>
                                )}
                                {certificateCompressor.errors[index] && (
                                  <div
                                    className="text-warning mt-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Compression error:{" "}
                                    {certificateCompressor.errors[index]}
                                  </div>
                                )}

                                {validation.touched?.employees?.[index]
                                  ?.certificate_of_employment &&
                                  validation.errors?.employees?.[index]
                                    ?.certificate_of_employment && (
                                    <div
                                      className="text-danger mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {
                                        validation.errors.employees[index]
                                          .certificate_of_employment
                                      }
                                    </div>
                                  )}
                              </td>

                              {user?.companyType === "NON-FOOD-MASSEUR" && (
                                <td style={{ width: "10%" }}>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={trainingCompressor.isCompressing}
                                    onChange={(e) =>
                                      handleTrainingChange(e, index, validation)
                                    }
                                    onBlur={() =>
                                      validation.setFieldTouched(
                                        `employees[${index}].training_certificate`,
                                        true,
                                      )
                                    }
                                    invalid={
                                      validation.touched?.employees?.[index]
                                        ?.training_certificate &&
                                      Boolean(
                                        validation.errors?.employees?.[index]
                                          ?.training_certificate,
                                      )
                                    }
                                  />
                                  {trainingCompressor.isCompressing && (
                                    <div
                                      className="text-info mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      Compressing...
                                    </div>
                                  )}
                                  {trainingCompressor.errors[index] && (
                                    <div
                                      className="text-warning mt-1"
                                      style={{ fontSize: "11px" }}
                                    >
                                      Compression error:{" "}
                                      {trainingCompressor.errors[index]}
                                    </div>
                                  )}

                                  {validation.touched?.employees?.[index]
                                    ?.training_certificate &&
                                    validation.errors?.employees?.[index]
                                      ?.training_certificate && (
                                      <div
                                        className="text-danger mt-1"
                                        style={{ fontSize: "11px" }}
                                      >
                                        {
                                          validation.errors.employees[index]
                                            .training_certificate
                                        }
                                      </div>
                                    )}
                                </td>
                              )}

                              <td>
                                <Button
                                  color="danger"
                                  size="sm"
                                  disabled={
                                    validation.values.employees.length === 1
                                  }
                                  onClick={() => fieldArrayHelper.remove(index)}
                                >
                                  <i className="mdi mdi-trash-can fs-5"></i>
                                </Button>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </Table>
                    <Row>
                      <Col>
                        <Button
                          color="primary"
                          outline
                          onClick={() => {
                            fieldArrayHelper.push({
                              fname: "",
                              mname: "",
                              lname: "",
                              birth_date: "",
                              gender: "",
                              address_line: "",
                              subdivision: "",
                              barangay: "",
                              city: "",
                              province: "",
                              contact_no: "",
                              id_picture: null,
                              cedula: null,
                              certificate_of_employment: null,
                              training_certificate: null,
                              no_cedula: false,
                              citizenship: "",
                              civil_status: "",
                              place_of_birth: "",
                              blood_type: "",
                              height: "",
                              weight: "",
                              tin: "",
                              occupation: "",
                              monthly_salary: 0.0,
                            });
                          }}
                        >
                          <i className="mdi mdi-plus"></i> Add Employee
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </FieldArray>
              <hr />
              <Row>
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    color="success"
                    type="submit"
                    onClick={async () => {
                      const errors = await validation.validateForm();
                      validation.setTouched({
                        employees: validation.values.employees.map(() => ({
                          fname: true,
                          lname: true,
                          birth_date: true,
                          gender: true,
                          address_line: true,
                          contact_no: true,
                          cedula: true,
                          certificate_of_employment: true,
                          training_certificate: true,
                          id_picture: true,
                        })),
                      });

                      if (Object.keys(errors).length === 0) {
                        validation.handleSubmit();
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button type="button" onClick={toggleModal}>
                    Close
                  </Button>
                </div>
              </Row>
            </Form>
          </FormikProvider>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
