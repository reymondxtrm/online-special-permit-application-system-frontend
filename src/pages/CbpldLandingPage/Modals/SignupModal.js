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
import * as Yup from "yup";
import BasicInputField from "components/Forms/BasicInputField";
import { useDispatch, useSelector } from "react-redux";
import { specialPermitClientRegister } from "features/user/userSlice";
import Swal from "sweetalert2";

function SignupModal({ openModal, toggleModal, props }) {
  const formikRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [civilStatusOptions, setcivilStatusOptions] = useState();
  const [brangaysOptions, setBarangaysOptions] = useState();
  const [street, setStreet] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const dispatch = useDispatch();

  const genderOptions = [
    { value: "MALE", label: "MALE" },
    { value: "FEMALE", label: "FEMALE" },
  ];

  useEffect(() => {
    if (openModal) {
      axios
        .get("api/geolocation/caraga", {
          params: { permit_type: "good_moral" },
        })
        .then(
          (res) => {
            const barangays = res.data.region.provinces[0]?.cities[1].barangays;

            const uniqueBarangays = [];
            const seen = new Set();

            for (const item of barangays) {
              if (!seen.has(item.psgc_id)) {
                seen.add(item.psgc_id);
                uniqueBarangays.push(item);
              }
            }
            const options = uniqueBarangays.map((item) => {
              return { value: item.barangay_id, label: item.name };
            });
            setBarangaysOptions(options);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      axios
        .get("api/get-civil-status", {
          params: { permit_type: "good_moral" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));

            setcivilStatusOptions(options);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal]);

  const validationSchema = Yup.object().shape({
    surname: Yup.string().required("Surname is required"),
    // .matches(/^[A-Za-z\s'-]+$/, "Surname must only contain letters"),

    first_name: Yup.string().required("First name is required"),
    // .matches(/^[A-Za-z\s'-]+$/, "First name must only contain letters"),

    middle_name: Yup.string().nullable(),
    // .matches(/^[A-Za-z\s'-]*$/, "Middle name must only contain letters"),

    suffix: Yup.string().nullable(),

    sex: Yup.string()
      // .oneOf(["Male", "Female"], "Invalid sex")
      .required("Gender is required")
      .nullable(),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    contact_no: Yup.string().required("Contact number is required"),

    barangay: Yup.string().required("Barangay is required").nullable(),

    additional_address: Yup.string().nullable(),

    date_of_birth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),

    place_of_birth: Yup.string().required("Place of birth is required"),

    educational_attainment: Yup.string()
      .required("Educational attainment is required")
      .nullable(),

    civil_status: Yup.number().required("Civil status is required").nullable(),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirm_password: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="xl"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
        }}
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
            {"SIGNUP"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
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
              province: "Agusan del Norte",
              city: "City of Butuan",
              barangay: null,
              additional_address: "",
              date_of_birth: "",
              place_of_birth: "",
              educational_attainment: null,
              civil_status: null,
              username: "",
              password: "",
              confirm_password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              const params = {
                ...values,
                additional_address: `${street} ${subDivision}`,
                username: `${values.first_name}.${values.surname}`,
              };
              Swal.fire({
                title: "Submitting...",
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },
              });

              const res = await dispatch(
                specialPermitClientRegister({ params, props })
              );

              if (res?.error) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res?.payload?.message || "Something went wrong",
                  confirmButtonText: "OK",
                });
              } else {
                Swal.close();
              }
            }}
          >
            {(props) => {
              return (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    {/* 1st main Col */}
                    <Row>
                      <Col md={3}>
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
                          onCustomChange={(e) => {
                            const firstName =
                              props.values.first_name?.trim().toLowerCase() ||
                              "";
                            const surname = e.target.value.trim().toLowerCase();
                            const username =
                              firstName && surname
                                ? `${firstName}.${surname}`
                                : "";
                            props.setFieldValue("username", username);
                          }}
                        />
                      </Col>
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
                          onCustomChange={(e) => {
                            const firstName = e.target.value
                              .trim()
                              .toLowerCase();
                            const surname =
                              props.values.surname?.trim().toLowerCase() || "";
                            const username =
                              firstName && surname
                                ? `${firstName}.${surname}`
                                : "";
                            props.setFieldValue("username", username);
                          }}
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
                            props.setFieldValue(
                              "middle_initial",
                              middleInitial
                            );
                          }}
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

                      <Col md={2}>
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
                                (option) => option.value === props.values.sex
                              ) || null
                            } // ← THIS IS CRUCIAL
                            onChange={(selected) =>
                              props.setFieldValue(
                                "sex",
                                selected ? selected.value : ""
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
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Username</Label>
                          <Input
                            disabled
                            value={
                              props.values.first_name +
                              "." +
                              props.values.surname
                            }
                          />
                        </FormGroup>
                        {/* <BasicInputField
                          col={12}
                          label="Username (Auto Generated)"
                          name="username"
                          placeholder="Generated Username"
                          value={props.values.username}
                          touched={false} // optional, no validation needed
                          errors={null} // optional, no validation needed
                          validation={props}
                          disable={true}
                        /> */}
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
                    <Row>
                      <Col md={4}>
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
                      <Col md={4}>
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

                      <Col md={4}>
                        <FormGroup>
                          <Label for="educationalAttainment">
                            Educational Attainment{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Select
                            id="educationalAttainment"
                            name="educational_attainment"
                            options={[
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
                            ]}
                            onChange={(selected) =>
                              props.setFieldValue(
                                "educational_attainment",
                                selected ? selected.value : ""
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
                      <Col md={4}>
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
                                  option.value === props.values.civil_status
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              props.setFieldValue(
                                "civil_status",
                                selectedOption ? selectedOption.value : ""
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
                      <Col>
                        <FormGroup>
                          <Label>
                            Address{" "}
                            <span style={{ color: "red" }}>&nbsp;*</span>
                          </Label>
                          <Input
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="House no./Street/Purok"
                          />
                        </FormGroup>
                      </Col>
                      <Col style={{ marginTop: "27px" }}>
                        <Input
                          value={subDivision}
                          onChange={(e) => setSubDivision(e.target.value)}
                          placeholder="Subdivision"
                        />
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="barangay">
                            Barangay <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Select
                            id="barangay"
                            name="barangay"
                            options={brangaysOptions}
                            placeholder="Select Barangay"
                            onChange={(selectedBarangay) =>
                              props.setFieldValue(
                                "barangay",
                                selectedBarangay.label
                              )
                            }
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
                  </Row>
                </Form>
              );
            }}
          </Formik>
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
              console.log(formikRef.current.errors);
              formikRef.current.handleSubmit();
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default SignupModal;
