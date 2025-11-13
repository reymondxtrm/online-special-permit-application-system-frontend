import BasicInputField from "components/Forms/BasicInputField";
import { helper } from "echarts/lib/export";
import { FieldArray, Form, Formik, useFormik } from "formik";
import React, { useRef, useState } from "react";
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
import { initAsyncCompiler } from "sass";
import Select from "react-select";
import PassportCamera from "../SpecialPermit/AuthClientPages/Common/PassportCamera";

import CedulaAddtionalDetailsModal from "./CedulaAddtionalDetailsModal";
import { createSerializableStateInvariantMiddleware } from "@reduxjs/toolkit";
import useSubmit from "hooks/Common/useSubmit";
import { CITIZENSHIP_OPTIONS } from "assets/data/data";

export default function CompanyOccupationalPermitModal({
  isOpen,
  toggleModal,
}) {
  const formikRef = useRef();
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [addtionlaDetailsModal, setAdditionalDetailsModal] = useState(false);
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
  const togglePasssportCamera = () => {
    setCameraIsOpen((prev) => !prev);
  };
  const toggleAdditionalDetailsModal = () => {
    setAdditionalDetailsModal((prev) => !prev);
  };
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

  return (
    <React.Fragment>
      <PassportCamera
        onCapture={setIdPicture}
        isOpen={cameraIsOpen}
        toggle={togglePasssportCamera}
        image={formikRef?.current?.values?.employees[activeIndex]?.id_picture}
      />
      <CedulaAddtionalDetailsModal
        isOpen={addtionlaDetailsModal}
        toggle={toggleAdditionalDetailsModal}
        setAdditionalDetails={setAdditionalDetails}
      />
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
              console.log(values, request);
              handleSubmit(
                {
                  url: "api/client/company-occupational-permit-application",
                  method: "POST",
                  params: request,
                },
                [],
                []
              );
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <FieldArray name="employees">
                  {(fieldArrayHelper) => (
                    <>
                      <Table striped bordered>
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
                            <th>TRAINING CERTIFICATE</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {props?.values?.employees?.map((employee, index) => (
                            <tr key={index}>
                              <td className="fw-bold">{index + 1}</td>
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
                                  placeholder={"City"}
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
                              </td>
                              <td style={{ width: "10%" }}>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      `employees[${index}].cedula`,
                                      e.target.files[0]
                                    );
                                  }}
                                />
                                <p
                                  className=" fw-bold text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    toggleAdditionalDetailsModal();
                                    setActiveIndex(index);
                                  }}
                                >
                                  Dont have cadula?
                                </p>
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
                                />
                              </td>
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
                                />
                              </td>
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
                                civi_status: "",
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
