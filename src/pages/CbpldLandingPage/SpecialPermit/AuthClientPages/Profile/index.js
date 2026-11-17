import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Table,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import avatar1 from "../../../../../assets/images/users/AvatarTheLegendOfAng.jpg";
import { useSelector } from "react-redux";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useSubmit from "hooks/Common/useSubmit";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import Breadcrumbs from "components/Common/Breadcrumb";

const UserProfile = () => {
  const [editOccupationState, seteditOccupationState] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [userData, setuserData] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const userDetails = useSelector((state) => state.user);
  const [changePassword, setChangePassword] = useState(false);
  const [editPersonalState, seteditPersonalState] = useState(false);
  const [civilStatuses, setcivilStatuses] = useState([]);
  const [loadError, setloadError] = useState("");

  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const handleChangePassword = () => {
    setChangePassword((prev) => !prev);
  };

  useEffect(() => {
    setisLoading(true);
    setloadError("");
    axios.get("api/client/profile").then(
      (res) => {
        setisLoading(false);
        setuserData(res.data);
      },
      (error) => {
        setisLoading(false);
        setloadError(error.response?.data?.message);
      }
    );
  }, [refresh]);

  useEffect(() => {
    axios.get("api/get-civil-status").then(
      (res) => setcivilStatuses(res.data),
      () => setcivilStatuses([])
    );
  }, []);

  const phone = userData?.user_phone_numbers?.[0];
  const address = userData?.user_addresses?.[0];

  const personalInitialValues = {
    birthdate: userData?.user_details?.birthdate?.slice(0, 10) || "",
    birthplace: userData?.user_details?.birthplace || "",
    sex: (userData?.sex || "").toUpperCase(),
    civil_status_id: userData?.user_details?.civil_status_id || "",
    educational_attainment:
      userData?.user_details?.educational_attainment || "",
    height: userData?.user_details?.height || "",
    weight: userData?.user_details?.weight || "",
    blood_type: userData?.user_details?.blood_type || "",
    contact_no: phone?.phone_number || "",
    province: address?.province || "",
    city: address?.city || "",
    barangay: address?.barangay || "",
    subdivision: address?.subdivision || "",
    address_line: address?.address_line || "",
  };

  const personalValidationSchema = Yup.object().shape({
    birthdate: Yup.date()
      .required("Birthday is required")
      .max(new Date(), "Birthday cannot be in the future"),
    birthplace: Yup.string().required("Birth place is required"),
    sex: Yup.string().required("Sex is required"),
    civil_status_id: Yup.string().required("Civil status is required"),
    educational_attainment: Yup.string().required(
      "Educational attainment is required"
    ),
    height: Yup.number()
      .typeError("Height must be a number")
      .required("Height is required"),
    weight: Yup.number()
      .typeError("Weight must be a number")
      .required("Weight is required"),
    blood_type: Yup.string().nullable(),
    contact_no: Yup.string().required("Phone number is required"),
    province: Yup.string().nullable(),
    city: Yup.string().required("City is required"),
    barangay: Yup.string().required("Barangay is required"),
    subdivision: Yup.string().nullable(),
    address_line: Yup.string().required("Address line is required"),
  });

  // Same option values as the registration form
  const sexOptions = ["MALE", "FEMALE"];
  const educationalAttainmentOptions = [
    { value: "College Graduate", label: "College Graduate" },
    { value: "High-school Graduate", label: "High-school Graduate" },
    { value: "SeniorGraduate", label: "Senior-High Graduate" },
    { value: "Non-Graduate", label: "Non-Graduate" },
    { value: "Vocational Graduate", label: "Vocational Graduate" },
  ];
  const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const savePersonalDetails = (values) => {
    handleSubmit(
      {
        url: "api/client/profile/update",
        message: {
          title: "Are you sure you want to save your personal details?",
          failedTitle: "FAILED",
          success: "Profile updated!",
        },
        params: values,
      },
      [() => seteditPersonalState(false), () => setrefresh(!refresh)],
      []
    );
  };

  // Shows the value, or an input with its error while editing
  const editableCell = (name, display, inputProps = {}) =>
    editPersonalState ? (
      <>
        <Field as={Input} id={name} name={name} {...inputProps} />
        <ErrorMessage name={name} component="div" className="text-danger" />
      </>
    ) : isLoading ? (
      "loading ..."
    ) : (
      display ?? ""
    );

  const initialValues = {
    companyName: userData?.user_occupation_details?.company_name || "",
    position: userData?.user_occupation_details?.position || "",
    dateHired: userData?.user_occupation_details?.date_hired || "",
    province: userData?.user_occupation_details?.province || "",
    city: userData?.user_occupation_details?.city || "",
    barangay: userData?.user_occupation_details?.barangay || "",
    subdivision: userData?.user_occupation_details?.subdivision || "",
    addressLine: userData?.user_occupation_details?.address_line || "",
  };

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    position: Yup.string().required("Position is required"),
    dateHired: Yup.date().required("Date Hired is required"),
    province: Yup.string().required("Province is required"),
    city: Yup.string().required("City is required"),
    barangay: Yup.string().required("Barangay is required"),
    subdivision: Yup.string().notRequired(),
    addressLine: Yup.string().required("Address Line is required"),
  });

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    const month = date.toLocaleString("en-US", { month: "short" }); // 'Oct'
    const day = date.getDate(); // 19
    const year = date.getFullYear(); // 1996

    return `${month}. ${day}, ${year}`;
  }

  function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    // Adjust age if the current month/day is before the birthday
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  const individual = useMemo(() => {
    if (userData) {
      return userData?.account_type === "individual";
    }
    return true;
  }, [userData]);
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Special Permit" breadcrumbItem="My Profile" />
        <ChangePasswordModal
          isOpen={changePassword}
          toggle={handleChangePassword}
        />
        <Row>
          <Col xs="12" lg="3">
            <Card>
              <CardBody className="text-center">
                <img
                  className="rounded-circle mb-3"
                  width="96"
                  height="96"
                  style={{ objectFit: "cover" }}
                  src={avatar1}
                  alt="Profile"
                />
                <h5 className="mb-1">{userDetails.name || ""}</h5>
                <p className="text-muted mb-0 text-break">
                  {userDetails.email || ""}
                </p>
                <hr />
                <Button
                  color="primary"
                  outline
                  block
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" lg="9">
            <Card>
              <CardBody>
                {loadError && (
                  <div className="alert alert-danger">{loadError}</div>
                )}
                <Formik
                  initialValues={personalInitialValues}
                  validationSchema={personalValidationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                    savePersonalDetails(values);
                  }}
                  enableReinitialize
                >
                  {({ isSubmitting, values, resetForm }) => (
                    <Form>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="text-primary mb-0">
                          Personal Information
                        </h5>
                        {individual && userData && (
                          <div className="d-flex gap-2">
                            {editPersonalState ? (
                              <>
                                <Button
                                  size="sm"
                                  key="save-personal"
                                  type="submit"
                                  color="primary"
                                  disabled={isSubmitting}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  key="cancel-personal"
                                  type="button"
                                  color="light"
                                  onClick={() => {
                                    resetForm();
                                    seteditPersonalState(false);
                                  }}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                key="edit-personal"
                                color="primary"
                                type="button"
                                onClick={() => seteditPersonalState(true)}
                              >
                                Edit Personal Details
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <Table striped>
                          <tbody>
                            <tr>
                              <th scope="row">
                                {individual ? "Full Name:" : "Company Name:"}
                              </th>
                              <td>
                                {isLoading
                                  ? "loading ..."
                                  : userData
                                  ? individual
                                    ? userData.fullname
                                    : userData.fname
                                  : ""}
                                {editPersonalState && (
                                  <div className="text-muted small">
                                    To correct your name or email, please
                                    contact CBPLD.
                                  </div>
                                )}
                              </td>
                            </tr>
                            {individual ? (
                              <React.Fragment>
                                <tr>
                                  <th scope="row">Birthday:</th>
                                  <td>
                                    {editableCell(
                                      "birthdate",
                                      formatDate(
                                        userData?.user_details?.birthdate
                                      ),
                                      { type: "date" }
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Age:</th>
                                  <td>
                                    {isLoading
                                      ? "loading ..."
                                      : editPersonalState
                                      ? values.birthdate
                                        ? calculateAge(values.birthdate)
                                        : ""
                                      : userData?.user_details?.birthdate
                                      ? calculateAge(
                                          userData.user_details.birthdate
                                        )
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Birth Place:</th>
                                  <td>
                                    {editableCell(
                                      "birthplace",
                                      userData?.user_details?.birthplace
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Sex:</th>
                                  <td>
                                    {editableCell("sex", userData?.sex, {
                                      type: "select",
                                      children: [
                                        <option key="" value="">
                                          Select Sex
                                        </option>,
                                        ...sexOptions.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        )),
                                      ],
                                    })}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Civil Status:</th>
                                  <td>
                                    {editableCell(
                                      "civil_status_id",
                                      userData?.user_details?.civil_status
                                        ?.name,
                                      {
                                        type: "select",
                                        children: [
                                          <option key="" value="">
                                            Select Civil Status
                                          </option>,
                                          ...civilStatuses.map((status) => (
                                            <option
                                              key={status.id}
                                              value={status.id}
                                            >
                                              {status.name}
                                            </option>
                                          )),
                                        ],
                                      }
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Educational Attainment:</th>
                                  <td>
                                    {editableCell(
                                      "educational_attainment",
                                      educationalAttainmentOptions.find(
                                        (option) =>
                                          option.value ===
                                          userData?.user_details
                                            ?.educational_attainment
                                      )?.label ||
                                        userData?.user_details
                                          ?.educational_attainment,
                                      {
                                        type: "select",
                                        children: [
                                          <option key="" value="">
                                            Select Educational Attainment
                                          </option>,
                                          ...educationalAttainmentOptions.map(
                                            (option) => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            )
                                          ),
                                        ],
                                      }
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Height (cm):</th>
                                  <td>
                                    {editableCell(
                                      "height",
                                      userData?.user_details?.height,
                                      { type: "number", step: "any", min: "0" }
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Weight (kg):</th>
                                  <td>
                                    {editableCell(
                                      "weight",
                                      userData?.user_details?.weight,
                                      { type: "number", step: "any", min: "0" }
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Blood Type:</th>
                                  <td>
                                    {editableCell(
                                      "blood_type",
                                      userData?.user_details?.blood_type,
                                      {
                                        type: "select",
                                        children: [
                                          <option key="" value="">
                                            Select Blood Type
                                          </option>,
                                          ...bloodTypeOptions.map((option) => (
                                            <option key={option} value={option}>
                                              {option}
                                            </option>
                                          )),
                                        ],
                                      }
                                    )}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ) : null}
                          </tbody>
                        </Table>
                      </div>

                      {/* Contact Div */}
                      <div>
                        <h6 className="text-primary mt-4 mb-2">Contact</h6>

                        {editPersonalState ? (
                          <Table striped>
                            <tbody>
                              <tr>
                                <th scope="row">Phone Number:</th>
                                <td>{editableCell("contact_no")}</td>
                              </tr>
                            </tbody>
                          </Table>
                        ) : (
                          <Table striped>
                            <thead>
                              <tr>
                                <th>Phone Number</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userData?.user_phone_numbers?.map(
                                (items, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {isLoading
                                          ? "loading ..."
                                          : items.phone_number}
                                      </td>
                                      <td>
                                        {isLoading ? "loading ..." : items.type}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </Table>
                        )}
                      </div>

                      {/* Address Div */}
                      <div>
                        <h6 className="text-primary mt-4 mb-2">Address</h6>

                        {editPersonalState ? (
                          <Table striped>
                            <tbody>
                              <tr>
                                <th scope="row">Province:</th>
                                <td>
                                  {editableCell("province", null, {
                                    placeholder: "Leave blank if Butuan City",
                                  })}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">City:</th>
                                <td>{editableCell("city")}</td>
                              </tr>
                              <tr>
                                <th scope="row">Barangay:</th>
                                <td>{editableCell("barangay")}</td>
                              </tr>
                              <tr>
                                <th scope="row">Subdivision:</th>
                                <td>{editableCell("subdivision")}</td>
                              </tr>
                              <tr>
                                <th scope="row">
                                  Specific Location/Address Line:
                                </th>
                                <td>{editableCell("address_line")}</td>
                              </tr>
                            </tbody>
                          </Table>
                        ) : (
                          <Table striped>
                            <thead>
                              <tr>
                                <th>City</th>
                                <th>Barangay</th>
                                <th>Subdivision</th>
                                <th>Specific Location/Address Line</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userData?.user_addresses?.map((items, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {isLoading ? "loading ..." : items.city}
                                    </td>
                                    <td>
                                      {isLoading
                                        ? "loading ..."
                                        : items.barangay}
                                    </td>
                                    <td>
                                      {isLoading
                                        ? "loading ..."
                                        : items.subdivision}
                                    </td>
                                    <td>
                                      {isLoading
                                        ? "loading ..."
                                        : items.address_line}
                                    </td>
                                    <td>
                                      {isLoading
                                        ? "loading ..."
                                        : items.address_type}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
            {individual && (
              <Card>
                <CardBody>
                  <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-primary mb-0">
                            Occupation Details
                          </h5>
                          <div className="d-flex gap-2">
                            {editOccupationState ? (
                              <>
                                <Button
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    const formik = formikRef.current.values;

                                    // console.log(formik);
                                    // console.log(formik.amountPaid);
                                    // var bodyFormData = getFormData(formik);
                                    handleSubmit(
                                      {
                                        url: "api/client/edit/occupation-details",
                                        message: {
                                          title:
                                            "Are you sure you want to Proceed?",
                                          failedTitle: "FAILED",
                                          success: "Success!",
                                          error: "unknown error occured",
                                        },
                                        params: formik,
                                      },
                                      [
                                        () => seteditOccupationState(false),
                                        () => setrefresh(!refresh),
                                      ],
                                      []
                                    );
                                  }}
                                  color="primary"
                                  disabled={isSubmitting}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  type="button"
                                  color="light"
                                  onClick={() => seteditOccupationState(false)}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                type="button"
                                color="primary"
                                onClick={() => seteditOccupationState(true)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>

                        <div>
                          <Table striped>
                            <tbody>
                              <tr>
                                <th scope="row">Company Name:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="companyName"
                                        name="companyName"
                                        placeholder="Enter Company Name"
                                      />
                                      <ErrorMessage
                                        name="companyName"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.company_name || ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Position:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="position"
                                        name="position"
                                        placeholder="Enter Position"
                                      />
                                      <ErrorMessage
                                        name="position"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.position || ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Date Hired:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="dateHired"
                                        name="dateHired"
                                        type="date"
                                      />
                                      <ErrorMessage
                                        name="dateHired"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.date_hired || ""
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>

                        <h6 className="text-primary mt-4 mb-2">
                          Company Address
                        </h6>

                        <div>
                          <Table striped>
                            <tbody>
                              <tr>
                                <th scope="row">Province:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="province"
                                        name="province"
                                        placeholder="Enter Province"
                                      />
                                      <ErrorMessage
                                        name="province"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.province || ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">City:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="city"
                                        name="city"
                                        placeholder="Enter City"
                                      />
                                      <ErrorMessage
                                        name="city"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details?.city ||
                                    ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Barangay:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="barangay"
                                        name="barangay"
                                        placeholder="Enter Barangay"
                                      />
                                      <ErrorMessage
                                        name="barangay"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.barangay || ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Subdivision:</th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="subdivision"
                                        name="subdivision"
                                        placeholder="Enter Subdivision"
                                      />
                                      <ErrorMessage
                                        name="subdivision"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.subdivision || ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">
                                  Specific Location/Address Line:
                                </th>
                                <td>
                                  {editOccupationState ? (
                                    <>
                                      <Field
                                        as={Input}
                                        id="addressLine"
                                        name="addressLine"
                                        placeholder="Enter Address Line"
                                      />
                                      <ErrorMessage
                                        name="addressLine"
                                        component="div"
                                        className="text-danger"
                                      />
                                    </>
                                  ) : (
                                    userData?.user_occupation_details
                                      ?.address_line || ""
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;
