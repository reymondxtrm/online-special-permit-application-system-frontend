import BasicInputField from "components/Forms/BasicInputField";
import { Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Input, InputGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import useSubmit from "hooks/Common/useSubmit";

import Swal from "sweetalert2";
import axios from "axios";

export default function CompanyRegistrationForm({
  brangaysOptions,
  toggleModal,
}) {
  const [outsideButuan, setOutsideButuan] = useState(false);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: "",
      surname: "company",
      address_line: "",
      barangay: "",
      city: "",
      province: "",
      email: "",
      contact_no: "",
      tin: "",
      password: "",
      password_confirmation: "",
      company_type: "",
      username: "",
    },
    onSubmit: async (values, { resetForm }) => {
      //make this into redux astate and create dispatch on this
      try {
        Swal.fire({
          title: "Processing...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        let params = { ...values, outside_butuan: outsideButuan ? 1 : 0 };
        if (!outsideButuan) {
          params = {
            ...values,
            province: "Agusan del Norte",
            city: "City of Butuan",
            outside_butuan: outsideButuan ? 1 : 0,
          };
        }

        const response = await axios.post("/api/registration/company", params);

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created.",
          confirmButtonColor: "#3085d6",
        });
        resetForm();
      } catch (error) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: error.response?.data?.message || "Please try again later.",
          confirmButtonColor: "#d33",
        });
      }
    },
  });

  useEffect(() => {
    validation.setValues({
      ...validation.values,
      address_line: "",
      barangay: "",
      city: "",
      province: "",
    });
  }, [outsideButuan]);
  useEffect(() => {
    validation.setFieldValue(
      "username",
      validation?.values?.first_name.toLowerCase() +
        "." +
        validation?.values?.surname.toLowerCase()
    );
  }, [validation?.values?.first_name]);
  const companyTypeOptions = [
    { value: "FOOD", label: "Food" },
    { value: "NON-FOOD", label: "Non-Food" },
    { value: "NON-FOOD-MASSEUR", label: "Non-Food-Masseur" },
  ];

  return (
    <form onSubmit={validation.handleSubmit}>
      <Row>
        <Col>
          <Row>
            <Col>
              <BasicInputField
                type="text"
                validation={validation}
                name={"first_name"}
                value={validation?.values?.first_name || ""}
                touched={validation?.touched?.first_name}
                errors={validation?.errors.first_name}
                label="Company Name"
                placeholder="Enter Company Name.."
              />
            </Col>
            <Col>
              <InputGroup className="flex-column">
                <Label>Company Type</Label>
                <Select
                  options={companyTypeOptions}
                  onChange={(selected) => {
                    validation.setFieldValue("company_type", selected?.value);
                  }}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="d-flex">
                <p style={{ width: "170px" }}>Company Address:</p>
                <InputGroup
                  style={{
                    position: "flex",
                    gap: "5px",
                  }}
                >
                  <Input
                    type="checkbox"
                    onChange={(e) => setOutsideButuan(e.target.checked)}
                  />
                  <Label style={{ color: "#0e5bf1" }}>
                    Outside of Butuan City?
                  </Label>
                </InputGroup>
              </div>
              {outsideButuan ? (
                <React.Fragment>
                  <div
                    style={{
                      backgroundColor: "#00c3ff11",
                      width: "100%",
                      height: "60px",
                      borderRadius: "10px",
                      border: "2px solid #00c3fff8",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="mdi mdi-information-outline fs-2"
                      style={{ color: "#00c3fffd", margin: "5px" }}
                    ></i>
                    <p className="p-0 m-0" style={{ color: "#237088fd" }}>
                      Please provide your full address details only if your
                      business is located <strong>outside Butuan City</strong>.
                      If your business is within Butuan City, kindly uncheck
                      this option.
                    </p>
                  </div>
                  <BasicInputField
                    type={"text"}
                    validation={validation}
                    name={"address_line"}
                    errors={validation.errors.address_line}
                    touched={validation.touched.address_line}
                    placeholder={"Enter full address"}
                    value={validation.values.address_line}
                  />
                </React.Fragment>
              ) : (
                <div className="d-flex gap-2">
                  <Col>
                    <BasicInputField
                      type="text"
                      validation={validation}
                      name={"address_line"}
                      value={validation?.values?.address_line || ""}
                      touched={validation?.touched?.address_line}
                      errors={validation?.errors.address_line}
                      placeholder="Building No./Street/Purok"
                    />
                  </Col>
                  <Col>
                    <BasicInputField
                      type="text"
                      validation={validation}
                      name={"subdivision"}
                      value={validation?.values?.subdivision || ""}
                      touched={validation?.touched?.subdivision}
                      errors={validation?.errors.subdivision}
                      placeholder="Subdivision"
                    />
                  </Col>
                  <Col>
                    <Select
                      options={brangaysOptions}
                      placeholder="Barangay"
                      onChange={(selected) => {
                        validation.setFieldValue("barangay", selected.label);
                      }}
                    />
                  </Col>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <BasicInputField
                type={"text"}
                validation={validation}
                name={"email"}
                errors={validation?.errors?.email}
                touched={validation?.touched?.email}
                placeholder={"Company email address"}
                label={"Company Email Address"}
                value={validation?.values?.email}
              />
            </Col>
            <Col>
              <BasicInputField
                type={"text"}
                name={"contact_no"}
                validation={validation}
                errors={validation?.errors?.contact_no}
                touched={validation?.touched?.contact_no}
                placeholder={"Enter Company Contact Number"}
                label={"Company Contact No."}
                value={validation?.values?.contact_no}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <BasicInputField
                type={"text"}
                name={"tin"}
                validation={validation}
                errors={validation?.errors?.tin}
                touched={validation?.touched?.tin}
                placeholder={"Enter Company TIN"}
                label={" Company TIN"}
                value={validation?.values?.tin}
              />
            </Col>
            <Col>
              <BasicInputField
                type={"text"}
                name={"username"}
                validation={validation}
                errors={validation?.errors?.username}
                touched={validation?.touched?.username}
                label={"Username"}
                value={validation?.values?.username}
                disable
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <BasicInputField
                type={"password"}
                name={"password"}
                validation={validation}
                errors={validation?.errors?.password}
                touched={validation?.touched?.password}
                placeholder={" Enter Company Password"}
                label={"Company Password"}
                value={validation?.values?.password}
              />
            </Col>
            <Col>
              <BasicInputField
                type={"password"}
                name={"password_confirmation"}
                validation={validation}
                errors={validation?.errors?.password_confirmation}
                touched={validation?.touched?.password_confirmation}
                placeholder={" Enter Confirm Password"}
                label={"Company password"}
                value={validation?.values?.password_confirmation}
              />
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col>
              <div className="d-flex gap-2 justify-content-end">
                <Button color="primary" type="submit">
                  Submit
                </Button>
                <Button type="reset" onClick={toggleModal}>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}
