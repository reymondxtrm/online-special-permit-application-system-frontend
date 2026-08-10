import React, { useState, useRef, useEffect, forwardRef } from "react";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import * as Yup from "yup";
import BasicInputField from "components/Forms/BasicInputField";
import { useDispatch, useSelector } from "react-redux";
import { specialPermitClientRegister } from "features/user/userSlice";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import location from "../../../../assets/data/address.json";
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  InputGroup,
  InputGroupText,
  FormFeedback,
} from "reactstrap";

const IndividualRegistrationForm = ({
  openModal,
  toggleModal,
  brangaysOptions,
  civilStatusOptions,
}) => {
  const formikRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [regions, setRegions] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
  ];
  const educationalAttainmentOption = [
    {
      value: "College Graduate",
      label: "College Graduate",
    },
    {
      value: "High-school Graduate",
      label: "High-school Graduate",
    },
    {
      value: "SeniorGraduate",
      label: "Senior-High Graduate",
    },
    { value: "Non-Graduate", label: "Non-Graduate" },
    {
      value: "Vocational Graduate",
      label: "Vocational Graduate",
    },
  ];
  const employmentStatusOptions = [
    { value: "employed", label: "Employed" },
    { value: "self_employed", label: "Self-employed" },
    { value: "mixed_income_earner", label: "Mixed Income Earner" },
    { value: "unemployed", label: "Unemployed" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
  ];
  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];
  const needCompanyDetailsEmploymentStatus = [
    "employed",
    "mixed_income_earner",
  ];

  useEffect(() => {
    const regionOptions = Object.entries(location)?.map((item) => ({
      value: item[0],
      label: item[1].region_name,
    }));
    setRegions(regionOptions);
  }, []);

  const validationSchema = Yup.object().shape({
    surname: Yup.string().required("Surname is required"),
    first_name: Yup.string().required("First name is required"),
    middle_name: Yup.string().nullable(),
    suffix: Yup.string().nullable(),
    sex: Yup.string().required("Gender is required").nullable(),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contact_no: Yup.string().required("Contact number is required"),
    barangay: Yup.object().required("Barangay is required").nullable(),
    city: Yup.object().required("City is required").nullable(),
    region: Yup.object().required("Region is required").nullable(),
    province: Yup.object().required("Province is required").nullable(),
    additional_address: Yup.string()
      .required("Additional address is required")
      .nullable(),
    date_of_birth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    place_of_birth: Yup.string().required("Place of birth is required"),
    educational_attainment: Yup.string()
      .required("Educational attainment is required")
      .nullable(),
    civil_status: Yup.number().required("Civil status is required").nullable(),
    blood_type: Yup.string().notRequired(),
    weight: Yup.string().required("Weight is required"),
    height: Yup.string().required("Height is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirm_password: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    employment_status: Yup.string().required("Employment status is required"),

    company_name: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("Company name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    position: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) =>
        schema.required("Your position in the company is requried"),
      otherwise: (schema) => schema.notRequired(),
    }),
    date_hired: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("Date hired is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    company_province: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("Provinces is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    company_city: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("City is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    company_barangay: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("Barangay is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    company_specific_address: Yup.string().when("employment_status", {
      is: (value) => ["employed", "mixed_income_earner"].includes(value),
      then: (schema) => schema.required("Company specific address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    company_subdivision: Yup.string().notRequired(),
  });

  return (
    <div>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          surname: "",
          first_name: "",
          middle_name: "",
          suffix: "",
          sex: "",
          email: "",
          contact_no: "",
          region: "",
          province: "",
          city: "",
          barangay: null,
          date_of_birth: "",
          place_of_birth: "",
          educational_attainment: null,
          civil_status: null,
          username: "",
          password: "",
          confirm_password: "",
          company_name: "",
          position: "",
          date_hired: "",
          company_province: "",
          company_city: "",
          company_barangay: "",
          company_specific_address: "",
          company_subdivision: "",
          employment_status: "",
          blood_type: "",
          height: "",
          weight: "",
          subdivision: "",
          additional_address: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          Swal.fire({
            title: "Submitting...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const params = {
            ...values,
            username: `${values.first_name
              .toLowerCase()
              .replace(/\s+/g, "")}.${values.surname
              .toLowerCase()
              .replace(/\s+/g, "")}`,
            barangay: values.barangay.label,
            province:
              values.city.label === "BUTUAN CITY" ? "" : values.province.label,
            city: values.city.label,
          };

          try {
            await dispatch(
              specialPermitClientRegister({ params, history }),
            ).unwrap();

            Swal.close();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err?.message || "Something went wrong",
              confirmButtonText: "OK",
            });
          }
        }}
      >
        {(props) => {
          return (
            <Form onSubmit={props.handleSubmit}>
              <Row
                style={{
                  border: "3px solid #32b3c4ff",
                  borderRadius: "10px",
                  paddingTop: "20px",
                  position: "relative",
                }}
              >
                {/* 1st main Col */}
                <Row>
                  <p
                    style={{
                      fontSize: "15px",
                      backgroundColor: "white",
                      position: "absolute",
                      top: "-35px",
                      left: "25px",
                      width: "auto",
                      padding: "3px",
                      color: "#1bb7cb",
                      fontWeight: "bold",
                    }}
                  >
                    Personnal Information
                  </p>

                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      label="First Name"
                      name="first_name"
                      placeholder="Enter First Name"
                      value={props.values.first_name}
                      touched={props.touched.first_name}
                      errors={props.errors.first_name}
                      validation={props}
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      label="Middlename"
                      name="middle_name"
                      placeholder="Middlename"
                      value={props.values.middle_name}
                      touched={props.touched.middle_name}
                      errors={props.errors.middle_name}
                      validation={props}
                      onCustomChange={(e) => {
                        const middleInitial = e.target.value
                          ? e.target.value.trim()[0].toUpperCase() + "."
                          : "";
                        props.setFieldValue("middle_name", e.target.value);
                        props.setFieldValue("middle_initial", middleInitial);
                      }}
                    />
                  </Col>
                  <Col>
                    <BasicInputField
                      col={12}
                      label="Surname"
                      name="surname"
                      placeholder="Enter Surname"
                      value={props.values.surname}
                      touched={props.touched.surname}
                      errors={props.errors.surname}
                      validation={props}
                      required
                    />
                  </Col>

                  <Col md={1}>
                    <BasicInputField
                      col={12}
                      label="Suffix"
                      name="suffix"
                      placeholder="Ext"
                      value={props.values.suffix}
                      touched={props.touched.suffix}
                      errors={props.errors.suffix}
                      validation={props}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>
                        {" "}
                        Height <span style={{ color: "red" }}>*</span>
                      </Label>
                      <InputGroup>
                        <Input
                          name="height"
                          onChange={props.handleChange}
                          type="text"
                          invalid={
                            props.touched.height && !!props.errors.height
                          }
                          onBlur={props.handleBlur}
                          value={props.values.height}
                        />
                        <InputGroupText>cm</InputGroupText>
                        {props.touched.height && !!props.errors.height ? (
                          <FormFeedback type="invalid">
                            {props.errors.height}
                          </FormFeedback>
                        ) : null}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>
                        Weight <span style={{ color: "red" }}>*</span>
                      </Label>
                      <InputGroup>
                        <Input
                          name="weight"
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.weight}
                          invalid={
                            props.touched.weight && !!props.errors.weight
                          }
                        />
                        <InputGroupText>kg</InputGroupText>{" "}
                        {props.touched.weight && props.errors.weight && (
                          <FormFeedback>{props.errors.weight}</FormFeedback>
                        )}
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Blood Type</Label>
                      <Select
                        isClearable
                        placeholder="Blood Type"
                        name="blood_type"
                        options={bloodTypeOptions}
                        value={
                          bloodTypeOptions?.find(
                            (option) =>
                              option.value === props.values.blood_type,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          props.setFieldValue(
                            "blood_type",
                            selectedOption ? selectedOption.value : "",
                          )
                        }
                        onBlur={() => props.setFieldTouched("blood_type", true)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Gender <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        options={genderOptions}
                        isClearable
                        name="sex"
                        value={
                          genderOptions.find(
                            (option) => option.value === props.values.sex,
                          ) || null
                        } // ← THIS IS CRUCIAL
                        onChange={(selected) =>
                          props.setFieldValue(
                            "sex",
                            selected ? selected.value : "",
                          )
                        }
                        onBlur={() => props.setFieldTouched("sex", true)}
                        className={
                          props.errors.sex && props.touched.sex
                            ? "is-invalid"
                            : ""
                        }
                        placeholder="Select Gender"
                      />
                      {props.errors.sex && props.touched.sex && (
                        <div className="invalid-feedback d-block">
                          {props.errors.sex}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Civil Status <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        isClearable
                        placeholder="Select Civil Status"
                        name="civil_status"
                        options={civilStatusOptions}
                        value={
                          civilStatusOptions?.find(
                            (option) =>
                              option.value === props.values.civil_status,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          props.setFieldValue(
                            "civil_status",
                            selectedOption ? selectedOption.value : "",
                          )
                        }
                        onBlur={() =>
                          props.setFieldTouched("civil_status", true)
                        }
                        className={
                          props.errors.civil_status &&
                          props.touched.civil_status
                            ? "is-invalid"
                            : ""
                        }
                      />
                      {props.errors.civil_status &&
                        props.touched.civil_status && (
                          <div className="invalid-feedback d-block">
                            {props.errors.civil_status}
                          </div>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <BasicInputField
                      col={12}
                      label="Birthday"
                      name="date_of_birth"
                      type="date"
                      required
                      placeholder="Select Birthday"
                      value={props.values.date_of_birth}
                      touched={props.touched.date_of_birth}
                      errors={props.errors.date_of_birth}
                      validation={props}
                    />
                  </Col>
                  <Col md={4}>
                    <BasicInputField
                      col={12}
                      label="Birth Place"
                      name="place_of_birth"
                      type="text"
                      required
                      placeholder="Enter Birth Place"
                      value={props.values.place_of_birth}
                      touched={props.touched.place_of_birth}
                      errors={props.errors.place_of_birth}
                      validation={props}
                    />
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="educationalAttainment">
                        Educational Attainment{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        id="educationalAttainment"
                        name="educational_attainment"
                        options={educationalAttainmentOption}
                        onChange={(selected) =>
                          props.setFieldValue(
                            "educational_attainment",
                            selected ? selected.value : "",
                          )
                        }
                        placeholder="Select Educational Attainment"
                        isClearable
                        className={
                          props.errors.educational_attainment &&
                          props.touched.educational_attainment
                            ? "is-invalid"
                            : ""
                        }
                      />

                      {props.errors.educational_attainment &&
                        props.touched.educational_attainment && (
                          <div className="invalid-feedback d-block">
                            {props.errors.educational_attainment}
                          </div>
                        )}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Region
                        <span style={{ color: "red" }}>&nbsp;*</span>
                      </Label>
                      <Select
                        style={{ width: "300px" }}
                        value={props.values.region}
                        placeholder="Select Region"
                        onChange={(e) => {
                          const regionId = e.value;
                          props.setFieldValue("region", e);
                          const province = Object.entries(
                            location?.[regionId]?.province_list,
                          ).map((item, index) => ({
                            label: item[0],
                            value: index,
                          }));
                          setProvinces(province);
                          setBarangays([]);
                          setCities([]);
                          props.setFieldValue("province", "");
                          props.setFieldValue("city", "");
                          props.setFieldValue("barangay", "");
                        }}
                        options={regions}
                        className={
                          props.errors.region && props.touched.region
                            ? "is-invalid"
                            : ""
                        }
                      />

                      {props.errors.region && props.touched.region && (
                        <div className="invalid-feedback d-block">
                          {props.errors.region}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Province <span style={{ color: "red" }}>&nbsp;*</span>
                      </Label>
                      <Select
                        value={props.values.province}
                        placeholder="Select Province"
                        onChange={(e) => {
                          const prov = e;
                          props.setFieldValue("province", prov);
                          const cities = Object.entries(
                            location?.[props.values.region.value]
                              ?.province_list?.[e.label]?.municipality_list,
                          ).map((item, index) => ({
                            label: item[0],
                            value: index,
                          }));
                          setCities(cities);
                          setBarangays([]);
                          props.setFieldValue("city", "");
                          props.setFieldValue("barangay", "");
                        }}
                        isDisabled={props.values.region === ""}
                        options={provinces}
                        className={
                          props.errors.province && props.touched.province
                            ? "is-invalid"
                            : ""
                        }
                      />
                      {props.errors.province && props.touched.province && (
                        <div className="invalid-feedback d-block">
                          {props.errors.province}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        City<span style={{ color: "red" }}>&nbsp;*</span>
                      </Label>
                      <Select
                        value={props.values.city}
                        placeholder="Select City"
                        onChange={(e) => {
                          const city = e;
                          props.setFieldValue("city", city);
                          const barangays = Object.entries(
                            location?.[props.values.region.value]
                              ?.province_list?.[props.values.province.label]
                              ?.municipality_list?.[e.label].barangay_list,
                          ).map((item, index) => ({
                            value: item[0],
                            label: item[1],
                          }));
                          setBarangays(barangays);
                        }}
                        isDisabled={props.values.province === ""}
                        options={cities}
                        className={
                          props.errors.city && props.touched.city
                            ? "is-invalid"
                            : ""
                        }
                      />

                      {props.errors.city && props.touched.city && (
                        <div className="invalid-feedback d-block">
                          {props.errors.city}
                        </div>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Barangay <span style={{ color: "red" }}>&nbsp;*</span>
                      </Label>
                      <Select
                        value={props.values.barangay}
                        placeholder="Select Barangay"
                        onChange={(e) => {
                          const barangay = e;
                          props.setFieldValue("barangay", barangay);
                        }}
                        isDisabled={props.values.city === ""}
                        options={barangays}
                        className={
                          props.errors.barangay && props.touched.barangay
                            ? "is-invalid"
                            : ""
                        }
                      />

                      {props.errors.barangay && props.touched.barangay && (
                        <div className="invalid-feedback d-block">
                          {props.errors.barangay}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Subdivision</Label>
                      <BasicInputField
                        type={"text"}
                        validation={props}
                        value={props.values.subdivision}
                        errors={props?.errors?.subdivision}
                        col="12"
                        touched={props.touched.subdivision}
                        placeholder="Subdivision"
                        name="subdivision"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>
                        Additional Address{" "}
                        <span style={{ color: "red" }}>&nbsp;*</span>
                      </Label>

                      <BasicInputField
                        name="additional_address"
                        type={"text"}
                        col="12"
                        placeholder="House no./Street/Purok"
                        value={props.values.additional_address}
                        touched={props.touched.additional_address}
                        error={props.errors.additional_address}
                        validation={props}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Row>

              <Row
                style={{
                  border: "3px solid #32b3c4ff",
                  borderRadius: "10px",
                  paddingTop: "20px",
                  position: "relative",
                  marginTop: "30px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "-15px",
                    left: "25px",
                    width: "auto",
                    padding: "3px",
                    color: "#1bb7cb",
                    fontWeight: "bold",
                  }}
                >
                  Contact Information
                </p>
                <Col md={6}>
                  <BasicInputField
                    col={12}
                    label="Email Address"
                    name="email"
                    placeholder="Enter Email Address"
                    value={props.values.email}
                    touched={props.touched.email}
                    errors={props.errors.email}
                    validation={props}
                    type="email"
                    required
                  />
                </Col>
                <Col md={6}>
                  <BasicInputField
                    col={12}
                    label="Contact No."
                    name="contact_no"
                    required
                    placeholder="Enter Contact No."
                    value={props.values.contact_no}
                    touched={props.touched.contact_no}
                    errors={props.errors.contact_no}
                    validation={props}
                  />
                </Col>
              </Row>

              <Row
                style={{
                  border: "3px solid #32b3c4ff",
                  borderRadius: "10px",
                  paddingTop: "20px",
                  position: "relative",
                  marginTop: "30px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "-15px",
                    left: "25px",
                    width: "auto",
                    padding: "3px",
                    color: "#1bb7cb",
                    fontWeight: "bold",
                  }}
                >
                  Employment Information
                </p>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>
                        Employment Status{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        options={employmentStatusOptions}
                        isClearable
                        name="employment_status"
                        value={
                          employmentStatusOptions.find(
                            (option) =>
                              option.value === props.values.employment_status,
                          ) || null
                        }
                        onChange={(selected) =>
                          props.setFieldValue(
                            "employment_status",
                            selected ? selected.value : "",
                          )
                        }
                        onBlur={() =>
                          props.setFieldTouched("employment_status", true)
                        }
                        className={
                          props.errors.employment_status &&
                          props.touched.employment_status
                            ? "is-invalid"
                            : ""
                        }
                        placeholder="Employment Status"
                      />
                      {props.errors.employment_status &&
                        props.touched.employment_status && (
                          <div className="invalid-feedback d-block">
                            {props.errors.employment_status}
                          </div>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {/* <p
                        style={{
                          fontSize: "12px",
                          color: "#19818fff",
                        }}
                      >
                        Company
                      </p> */}
                  <Col>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="company_name"
                      validation={props}
                      value={props.values.company_name}
                      label="Company Name"
                      errors={props.errors.company_name}
                      touched={props.touched.company_name}
                      required
                      placeholder="Company name"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="position"
                      validation={props}
                      value={props?.values?.position}
                      label="Position"
                      errors={props?.errors?.position}
                      touched={props?.touched?.position}
                      required
                      placeholder="Your position in the company"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <BasicInputField
                      col={12}
                      type={"date"}
                      name="date_hired"
                      validation={props}
                      value={props?.values?.date_hired}
                      label="Date Hired"
                      errors={props?.errors?.date_hired}
                      touched={props?.touched?.date_hired}
                      required
                      placeholder="Date hired"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "black",
                      marginBottom: "0px",
                    }}
                    className="form-label"
                  >
                    Company Address <span style={{ color: "red" }}>*</span>
                  </p>
                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="company_specific_address"
                      validation={props}
                      value={props?.values?.company_specific_address}
                      // label="Street/Purok"
                      errors={props?.errors?.company_specific_address}
                      touched={props?.touched?.company_specific_address}
                      placeholder="Building No./Street/Purok"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="company_province"
                      validation={props}
                      value={props?.values?.company_province}
                      label=""
                      errors={props?.errors?.company_province}
                      touched={props?.touched?.company_province}
                      placeholder="Province"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="company_city"
                      validation={props}
                      value={props?.values?.company_city}
                      label=""
                      errors={props?.errors?.company_city}
                      touched={props?.touched?.company_city}
                      placeholder="City"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <BasicInputField
                      col={12}
                      type={"text"}
                      name="company_barangay"
                      validation={props}
                      value={props?.values?.company_barangay}
                      label=""
                      errors={props?.errors?.company_barangay}
                      touched={props?.touched?.company_barangay}
                      placeholder="Barangay"
                      disable={
                        !needCompanyDetailsEmploymentStatus.includes(
                          props?.values?.employment_status,
                        )
                      }
                    />
                  </Col>
                </Row>
              </Row>
              <Row
                style={{
                  border: "3px solid #32b3c4ff",
                  borderRadius: "10px",
                  paddingTop: "20px",
                  position: "relative",
                  marginTop: "30px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "-15px",
                    left: "25px",
                    width: "auto",
                    padding: "3px",
                    color: "#1bb7cb",
                    fontWeight: "bold",
                  }}
                >
                  Account Credential
                </p>
                <Col>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      disabled
                      value={
                        props.values.first_name
                          .toLowerCase()
                          .replace(/\s+/g, "") +
                        "." +
                        props.values.surname.toLowerCase().replace(/\s+/g, "")
                      }
                    />
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <BasicInputField
                    col={12}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={props.values.password}
                    touched={props.touched.password}
                    errors={props.errors.password}
                    validation={props}
                    required
                  />
                </Col>
                <Col md={3}>
                  <BasicInputField
                    col={12}
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    required
                    placeholder="Re-enter Password"
                    value={props.values.confirm_password}
                    touched={props.touched.confirm_password}
                    errors={props.errors.confirm_password}
                    validation={{
                      handleChange: props.handleChange,
                      handleBlur: props.handleBlur,
                    }}
                  />
                </Col>
              </Row>
              <hr></hr>
              <Row>
                <Col>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      style={{
                        backgroundColor: "#1a56db",
                        fontWeight: "600",
                        fontFamily:
                          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                        color: "white",
                      }}
                      onClick={() => {
                        console.log(formikRef.current.errors);
                        formikRef.current.handleSubmit();
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      color="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleModal();
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default IndividualRegistrationForm;
