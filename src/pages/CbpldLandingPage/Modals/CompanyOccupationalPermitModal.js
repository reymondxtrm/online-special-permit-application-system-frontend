import BasicInputField from "components/Forms/BasicInputField";
import { helper } from "echarts/lib/export";
import { FieldArray, Form, Formik, useFormik } from "formik";
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

export default function CompanyOccupationalPermitModal({
  isOpen,
  toggleModal,
}) {
  const formikRef = useRef();
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  // const [additionalDetails, setAdditionalDetailsModal] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { getImageHandle, isFetching, currentImage } = useGetImage();
  const handleSubmit = useSubmit();
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "PREFER NOT TO SAY", label: "Prefer not to say" },
  ];
  const setIdPicture = (capturedPicture) => {
    formikRef.current.setFieldValue(
      `employees[${activeIndex}].id_picture`,
      capturedPicture
    );
  };
  const user = useSelector((state) => state.user);
  const togglePasssportCamera = () => {
    setCameraIsOpen((prev) => !prev);
  };
  const toggleImageViewer = useCallback(() => {
    setIsViewerOpen((prev) => !prev);
  }, []);
  // const toggleAdditionalDetailsModal = () => {
  //   setAdditionalDetailsModal((prev) => !prev);
  // };
  const setAdditionalDetails = (detail) => {
    Object.entries(detail).forEach(([key, value]) => {
      formikRef.current.setFieldValue(
        `employees[${activeIndex}].${key}`,
        value || ""
      );
    });
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
  console.log(user?.companyType);
  const employeeSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    birth_date: Yup.string().required("Birth date is required"),
    gender: Yup.string().required("Gender is required"),
    address_line: Yup.string().required("Home address is required"),
    contact_no: Yup.string().required("Contact number is required"),
    no_cedula: Yup.boolean(),
    // CEDULA is required only when no_cedula is false
    cedula: Yup.mixed().when("no_cedula", {
      is: false,
      then: Yup.mixed()
        .required("Cedula is required")
        .test(
          "fileRequired",
          "Cedula file is required",
          (value) => value instanceof File
        ),
      otherwise: Yup.mixed().nullable(),
    }),
    certificate_of_employment: Yup.mixed().required(
      "Certificate of Employment is required"
    ),

    training_certificate: Yup.mixed()
      .test(
        "requiredWhenCompanyType",
        "Training certificate is required.",
        function (value) {
          if (user?.companyType === "NON-FOOD-MASSEUR") {
            return value instanceof File;
          }
          return true;
        }
      )
      .test("fileType", "Only image files are allowed.", function (value) {
        if (!value) return true;
        return [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ].includes(value.type);
      }),

    // citizenship: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Nationality is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // civil_status: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Civil status is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // place_of_birth: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Place of birth is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // blood_type: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Blood type is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // height: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Height is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // weight: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Weight is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // tin: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("TIN is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // occupation: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Occupation is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // date_hired: Yup.string().when("no_cedula", {
    //   is: true,
    //   then: Yup.string().required("Date hired is required"),
    //   otherwise: Yup.string().nullable(),
    // }),
    // monthly_salary: Yup.number().when("no_cedula", {
    //   is: true,
    //   then: Yup.number()
    //     .typeError("Monthly salary must be a number")
    //     .required("Monthly salary is required"),
    //   otherwise: Yup.number().nullable(),
    // }),
  });
  const validationSchema = Yup.object().shape({
    employees: Yup.array().of(employeeSchema),
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

      {/* {additionalDetails && (
        <CedulaAddtionalDetailsModal
          isOpen={additionalDetails}
          toggle={toggleAdditionalDetailsModal}
          setAdditionalDetails={setAdditionalDetails}
          values={formikRef.current.values.employees?.[activeIndex]}
        />
      )} */}
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
          <Formik
            innerRef={formikRef}
            validationSchema={validationSchema}
            initialValues={{
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
            }}
            onSubmit={(values) => {
              const request = getFormData(values);

              const response = handleSubmit(
                {
                  url: "api/client/company-occupational-permit-application",
                  method: "POST",
                  params: request,
                },
                [],
                [toggleModal]
              );
              if (response) {
                formikRef.current.reset();
              }
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <FieldArray name="employees">
                  {(fieldArrayHelper) => (
                    <>
                      <Table striped>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>NAME</th>
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
                          {props?.values?.employees?.map((employee, index) => (
                            <tr key={index}>
                              {/* <td className="fw-bold">{index + 1}</td> */}
                              <th scope="row">{index + 1}</th>
                              <td style={{ width: "10%" }}>
                                <div className="d-flex flex-column gap-0">
                                  <BasicInputField
                                    type={"text"}
                                    validation={props}
                                    name={`employees[${index}].fname`}
                                    value={employee?.fname}
                                    touched={
                                      props?.touched?.employees?.[index]?.fname
                                    }
                                    errors={
                                      props?.errors?.employees?.[index]?.fname
                                    }
                                    placeholder={"First name"}
                                    col={12}
                                  />
                                  <BasicInputField
                                    type={"text"}
                                    validation={props}
                                    name={`employees[${index}].mname`}
                                    value={employee.mname}
                                    placeholder={"Middle name"}
                                    touched={
                                      props?.touched?.employees?.[index]?.mname
                                    }
                                    errors={
                                      props?.errors?.employees?.[index]?.mname
                                    }
                                    col={12}
                                  />
                                  <BasicInputField
                                    type={"text"}
                                    validation={props}
                                    name={`employees[${index}].lname`}
                                    value={employee?.lname}
                                    placeholder={"Last name"}
                                    touched={
                                      props?.touched?.employees?.[index]?.lname
                                    }
                                    errors={
                                      props?.errors?.employees?.[index]?.lname
                                    }
                                    col={12}
                                  />
                                </div>
                              </td>
                              <td>
                                <BasicInputField
                                  validation={props}
                                  name={`employees[${index}].birth_date`}
                                  value={employee?.birth_date}
                                  type={"date"}
                                  touched={
                                    props?.touched?.employees?.[index]
                                      ?.birth_date
                                  }
                                  errors={
                                    props?.errors?.employees?.[index]
                                      ?.birth_date
                                  }
                                />
                              </td>
                              <td>
                                <Select
                                  placeholder="Gender"
                                  options={genderOptions}
                                  onChange={(selected) => {
                                    props.setFieldValue(
                                      `employees[${index}].gender`,
                                      selected.value
                                    );
                                  }}
                                />
                                {props.touched.employees?.[index]?.gender &&
                                props.errors.employees?.[index]?.gender ? (
                                  <div
                                    className="text-danger"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {props.errors.employees[index].gender}
                                  </div>
                                ) : null}
                              </td>

                              <td>
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].address_line`}
                                  value={employee.address_line}
                                  errors={
                                    props?.errors?.employees?.[index]
                                      ?.address_line
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]
                                      ?.address_line
                                  }
                                  placeholder={"Street No./Purok"}
                                />
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].subdivision`}
                                  value={employee.subdivision}
                                  errors={
                                    props?.errors?.employees?.[index]
                                      ?.subdivision
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]
                                      ?.subdivision
                                  }
                                  placeholder={"Subdivision"}
                                />
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].barangay`}
                                  value={employee.barangay}
                                  errors={
                                    props?.errors?.employees?.[index]?.barangay
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]?.barangay
                                  }
                                  placeholder={"Barangay"}
                                />
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].city`}
                                  value={employee.city}
                                  errors={
                                    props?.errors?.employees?.[index]?.city
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]?.city
                                  }
                                  placeholder={"City/Municipality"}
                                />
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].province`}
                                  value={employee.province}
                                  errors={
                                    props?.errors?.employees?.[index]?.province
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]?.province
                                  }
                                  placeholder={"Province"}
                                />
                              </td>
                              <td>
                                <BasicInputField
                                  validation={props}
                                  type={"text"}
                                  name={`employees[${index}].contact_no`}
                                  value={employee.contact_no}
                                  errors={
                                    props?.errors?.employees?.[index]
                                      ?.contact_no
                                  }
                                  touched={
                                    props?.touched?.employees?.[index]
                                      ?.contact_no
                                  }
                                  placeholder={"Phone number"}
                                />
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  {props.values.employees?.[index]
                                    ?.id_picture && (
                                    <img
                                      src={
                                        props.values.employees[index].id_picture
                                      }
                                      alt="Captured ID"
                                      className="img-fluid rounded border"
                                      style={{
                                        transition: "0.3s",
                                        opacity: 1,
                                      }}
                                    />
                                  )}
                                  <Button
                                    color="primary"
                                    style={{ Width: "100%" }}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      togglePasssportCamera();
                                      setActiveIndex(index);
                                    }}
                                  >
                                    <i className="mdi  mdi-camera fs-5"></i>
                                  </Button>
                                </div>
                              </td>
                              <td style={{ width: "10%" }}>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  name={`employees[${index}].cedula`}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      `employees[${index}].cedula`,
                                      e.target.files[0]
                                    );
                                  }}
                                  onBlur={props.handleBlur}
                                  invalid={
                                    !props.values.employees?.[index]
                                      ?.no_cedula &&
                                    props.touched.employees?.[index]?.cedula &&
                                    props.errors.employees?.[index]?.cedula
                                      ? true
                                      : false
                                  }
                                />

                                {!props.values.employees?.[index]?.no_cedula && // 👈 hide error text if no_cedula = true
                                props.touched.employees?.[index]?.cedula &&
                                props.errors.employees?.[index]?.cedula ? (
                                  <div
                                    className="text-danger"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {props.errors.employees[index].cedula}
                                  </div>
                                ) : null}

                                {/* <p
                                  className=" fw-bold text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    toggleAdditionalDetailsModal();
                                    setActiveIndex(index);
                                  }}
                                >
                                  {"Don't have Cedula?"}
                                </p> */}
                              </td>
                              <td style={{ width: "10%" }}>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      `employees[${index}].certificate_of_employment`,
                                      e.target.files[0]
                                    );
                                  }}
                                  onBlur={() =>
                                    props.setFieldTouched(
                                      `employees[${index}].certificate_of_employment`,
                                      true
                                    )
                                  }
                                  invalid={
                                    props.touched?.employees?.[index]
                                      ?.certificate_of_employment &&
                                    props.errors?.employees?.[index]
                                      ?.certificate_of_employment
                                      ? true
                                      : false
                                  }
                                />

                                {props.touched?.employees?.[index]
                                  ?.certificate_of_employment &&
                                props.errors?.employees?.[index]
                                  ?.certificate_of_employment ? (
                                  <div
                                    className="text-danger"
                                    style={{
                                      fontSize: "11px",
                                      display: "block",
                                    }}
                                  >
                                    {
                                      props.errors.employees[index]
                                        .certificate_of_employment
                                    }
                                  </div>
                                ) : null}
                              </td>

                              {user?.companyType === "NON-FOOD-MASSEUR" && (
                                <td style={{ width: "10%" }}>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      props.setFieldValue(
                                        `employees[${index}].training_certificate`,
                                        e.target.files[0]
                                      );
                                    }}
                                    onBlur={() =>
                                      props.setFieldTouched(
                                        `employees[${index}].training_certificate`,
                                        true
                                      )
                                    }
                                    invalid={
                                      props.touched?.employees?.[index]
                                        ?.training_certificate &&
                                      props.errors?.employees?.[index]
                                        ?.training_certificate
                                        ? true
                                        : false
                                    }
                                  />

                                  {props.touched?.employees?.[index]
                                    ?.training_certificate &&
                                  props.errors?.employees?.[index]
                                    ?.training_certificate ? (
                                    <div
                                      className="text-danger"
                                      style={{
                                        fontSize: "11px",
                                        display: "block",
                                      }}
                                    >
                                      {
                                        props.errors.employees[index]
                                          .training_certificate
                                      }
                                    </div>
                                  ) : null}
                                </td>
                              )}

                              <td>
                                <Button
                                  color="danger"
                                  onClick={() => fieldArrayHelper.remove(index)}
                                >
                                  <i className="mdi mdi-trash-can fs-5"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Row>
                        <Col>
                          <i
                            className="fa fas fa-plus fs-2 text-success "
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            onClick={() => {
                              fieldArrayHelper.push({
                                fname: "",
                                mname: "",
                                lname: "",
                                birth_date: "",
                                gender: "",
                                address_line: "",
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
                          ></i>
                        </Col>
                      </Row>
                    </>
                  )}
                </FieldArray>
                <hr></hr>
                <Row>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button color="success" type="submit">
                      Submit
                    </Button>
                    <Button type="reset" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </div>
                </Row>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
