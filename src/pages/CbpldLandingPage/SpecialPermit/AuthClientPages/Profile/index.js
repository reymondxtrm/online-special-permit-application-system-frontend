import React, { useState, useRef, useEffect } from "react";
import {
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

const UserProfile = () => {
  const [editOccupationState, seteditOccupationState] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [userData, setuserData] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const userDetails = useSelector((state) => state.user);
  const [changePassword, setChangePassword] = useState(false);

  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const handleChangePassword = () => {
    setChangePassword((prev) => !prev);
  };

  useEffect(() => {
    setisLoading(true);
    axios
      .get("api/client/user-details", {
        params: { permit_type: "good_moral" },
      })
      .then(
        (res) => {
          setisLoading(false);
          setuserData(res.data);
        },
        (error) => {
          setisLoading(false);
          console.log(error);
        }
      );
  }, [refresh]);

  // const handleSubmit = (values) => {
  //   console.log("Form values submitted:", values);
  //   seteditOccupationState(false);
  // };

  const initialValues = {
    companyName: userData?.user_occupation_details?.company_name || "",
    position: userData?.user_occupation_details?.position || "",
    dateHired: userData?.user_occupation_details?.date_hired || "",
    province: userData?.user_occupation_details?.province || "",
    city: userData?.user_occupation_details?.city || "",
    barangay: userData?.user_occupation_details?.barangay || "",
    addressLine: userData?.user_occupation_details?.address_line || "",
  };

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    position: Yup.string().required("Position is required"),
    dateHired: Yup.date().required("Date Hired is required"),
    province: Yup.string().required("Province is required"),
    city: Yup.string().required("City is required"),
    barangay: Yup.string().required("Barangay is required"),
    addressLine: Yup.string().required("Address Line is required"),
  });

  function formatDate(dateStr) {
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

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      <ChangePasswordModal
        isOpen={changePassword}
        toggle={handleChangePassword}
      />
      <Card
        className="shadow-lg"
        style={{
          minHeight: "83%",
          minWidth: "96%",
          display: "flex",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "10px 10px 30px ",
          marginTop: "40px",
        }}
      >
        <CardBody style={{ display: "flex", flexDirection: "column" }}>
          <Row style={{ flexGrow: 1 }}>
            <Col
              md="3"
              style={{
                borderRight: "1px solid #dee2e6", // Adjust the color as per your design
                // textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  minHeight: "100%",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  className="rounded-circle mt-5"
                  width="300px"
                  height="300px"
                  src={avatar1}
                  alt="Profile"
                />

                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "18pt",
                    letterSpacing: ".1rem",
                  }}
                >
                  {userDetails.name ? userDetails.name : ""}
                </span>
                <span
                  style={{
                    fontSize: "12pt",
                    letterSpacing: ".1rem",
                  }}
                >
                  {userDetails.email ? userDetails.email : ""}
                </span>
              </div>
            </Col>

            <Col md="5" style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <p
                style={{
                  fontWeight: "bold",
                  letterSpacing: ".2rem",
                  fontSize: "18pt",
                  margin: "0",
                  padding: "0 0 0 12px", // top, right, bottom, left
                  color: "#368be0",
                }}
              >
                {"PERSONAL INFORMATION"}
              </p>
              <div style={{ paddingTop: "25px" }}>
                <Table striped>
                  <tbody>
                    <tr>
                      <th scope="row">Full Name:</th>
                      <td>
                        {isLoading
                          ? "loading ..."
                          : userData
                          ? userData.full_name
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Birthday:</th>
                      <td>
                        {isLoading
                          ? "loading ..."
                          : userData
                          ? formatDate(userData?.user_details?.birthdate)
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Age:</th>
                      <td>
                        {isLoading
                          ? "loading ..."
                          : userData
                          ? calculateAge(userData?.user_details?.birthdate)
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Birth Place:</th>
                      <td>
                        {isLoading
                          ? "loading ..."
                          : userData
                          ? userData?.user_details?.birthplace
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Civil Status:</th>
                      <td>
                        {isLoading
                          ? "loading ..."
                          : userData
                          ? userData?.user_details?.civil_status?.name
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Educational Attainment:</th>
                      <td>College Graduate</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* Contact Div */}
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    letterSpacing: ".2rem",
                    fontSize: "18pt",
                    margin: "0",
                    padding: "12px 0 0 12px", // top, right, bottom, left
                    color: "#368be0",
                  }}
                >
                  {"CONTACT"}
                </p>
                <p
                  style={{
                    margin: "0",
                    padding: "12px 0 0 12px", // top, right, bottom, left
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Email: </span>
                  {userDetails.email ? userDetails.email : ""}
                </p>

                <Table striped>
                  <thead>
                    <tr>
                      <th>Phone Number</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.user_phone_numbers.map((items, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {isLoading ? "loading ..." : items.phone_number}
                          </td>
                          <td>{isLoading ? "loading ..." : items.type}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {/* Address Div */}
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    letterSpacing: ".2rem",
                    fontSize: "18pt",
                    margin: "0",
                    padding: "12px 0 0 12px", // top, right, bottom, left
                    color: "#368be0",
                  }}
                >
                  {"Address"}
                </p>

                <Table striped>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Barangay</th>
                      <th>Specific Location/Address Line</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.user_addresses.map((items, index) => {
                      return (
                        <tr key={index}>
                          <td>{isLoading ? "loding ..." : items.city}</td>
                          <td>{isLoading ? "loding ..." : items.barangay}</td>
                          <td>
                            {isLoading ? "loding ..." : items.address_line}
                          </td>
                          <td>
                            {isLoading ? "loding ..." : items.address_type}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    letterSpacing: ".2rem",
                    fontSize: "18pt",
                    margin: "0",
                    padding: "12px 0 0 12px", // top, right, bottom, left
                    color: "#368be0",
                  }}
                >
                  {"Password"}
                </p>
                <Table striped>
                  <tbody>
                    <tr>
                      <td colSpan="2 " className="">
                        <Button color="primary" onClick={handleChangePassword}>
                          Change Password
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>

            <Col md="4" style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form>
                    <p
                      style={{
                        fontWeight: "bold",
                        letterSpacing: ".2rem",
                        fontSize: "18pt",
                        margin: "0",
                        padding: "0 0 0 12px",
                        color: "#368be0",
                      }}
                    >
                      OCCUPATION DETAILS
                    </p>

                    <div style={{ paddingTop: "25px" }}>
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
                                userData?.user_occupation_details?.position ||
                                ""
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
                                userData?.user_occupation_details?.date_hired ||
                                ""
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <p
                      style={{
                        fontWeight: "bold",
                        letterSpacing: ".2rem",
                        fontSize: "18pt",
                        margin: "0",
                        padding: "0 0 0 12px",
                        color: "#368be0",
                      }}
                    >
                      COMPANY ADDRESS
                    </p>

                    <div style={{ paddingTop: "25px" }}>
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
                                userData?.user_occupation_details?.province ||
                                ""
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
                                userData?.user_occupation_details?.city || ""
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
                                userData?.user_occupation_details?.barangay ||
                                ""
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Specific Location/Address Line:</th>
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

                    <div
                      style={{
                        paddingTop: "25px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {editOccupationState ? (
                        <>
                          <Button
                            onClick={() => {
                              const formik = formikRef.current.values;
                              console.log(formik);
                              // console.log(formik);
                              // console.log(formik.amountPaid);
                              // var bodyFormData = getFormData(formik);
                              handleSubmit(
                                {
                                  url: "api/client/edit/occupation-details",
                                  // headers: {
                                  //   "Content-Type": "multipart/form-data",
                                  // },
                                  message: {
                                    title: "Are you sure you want to Proceed?",
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
                            color="success"
                            style={{
                              width: "80px",
                              fontWeight: "600",
                              fontFamily:
                                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            }}
                            disabled={isSubmitting}
                          >
                            Save
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => seteditOccupationState(false)}
                            style={{
                              marginLeft: "15px",
                              width: "80px",
                              fontWeight: "600",
                              fontFamily:
                                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          style={{
                            backgroundColor: "#1a56db",
                            fontWeight: "600",
                            fontFamily:
                              "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            color: "white",
                            width: "80px",
                          }}
                          onClick={() => seteditOccupationState(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>

            {/* <Col md="4">
              <p
                style={{
                  fontWeight: "bold",
                  letterSpacing: ".2rem",
                  fontSize: "18pt",
                  margin: "0",
                  padding: "0 0 0 12px", // top, right, bottom, left
                  color: "#368be0",
                }}
              >
                {"OCCUPATION DETAILS"}
              </p>

              <div style={{ paddingTop: "25px" }}>
                <Table striped>
                  <tbody>
                    <tr>
                      <th scope="row">Company Name:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="companyName"
                            name={`companyName`}
                            placeholder="Enter Company Name"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.company_name ? (
                          userData.user_occupation_details.company_name
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Position:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="position"
                            name={`position`}
                            placeholder="Enter Position"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.position ? (
                          userData.user_occupation_details.position
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Date Hired:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="dateHired"
                            name={`dateHired`}
                            type="date"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.date_hired ? (
                          userData.user_occupation_details.date_hired
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <p
                style={{
                  fontWeight: "bold",
                  letterSpacing: ".2rem",
                  fontSize: "18pt",
                  margin: "0",
                  padding: "0 0 0 12px", // top, right, bottom, left
                  color: "#368be0",
                }}
              >
                {"COMPANY ADDRESS"}
              </p>

              <div style={{ paddingTop: "25px" }}>
                <Table striped>
                  <tbody>
                    <tr>
                      <th scope="row">Province:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="province"
                            name={`province`}
                            placeholder="Enter Province"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.province ? (
                          userData.user_occupation_details.province
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">City:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="city"
                            name={`city`}
                            placeholder="Enter City"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.city ? (
                          userData.user_occupation_details.city
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Barangay:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="barangay"
                            name={`barangay`}
                            placeholder="Enter Barangay"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.barangay ? (
                          userData.user_occupation_details.barangay
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Specific Location/Address Line:</th>
                      <td>
                        {editOccupationState ? (
                          <Input
                            id="addressLine"
                            name={`addressLine`}
                            placeholder="Enter Address Line"
                            // onChange={props.handleChange}
                          />
                        ) : userData?.user_occupation_details?.address_line ? (
                          userData.user_occupation_details.address_line
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div
                style={{
                  paddingTop: "25px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {editOccupationState === false ? (
                  <Button
                    style={{
                      backgroundColor: "#1a56db",
                      fontWeight: "600",
                      fontFamily:
                        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                      color: "white",
                      width: "80px",
                    }}
                    onClick={() => {
                      seteditOccupationState(true);
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    style={{
                      // backgroundColor: "#1a56db",
                      width: "80px",
                      fontWeight: "600",
                      fontFamily:
                        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                      // color: "white",
                    }}
                    color="success"
                    onClick={() => {
                      seteditOccupationState(false);
                    }}
                  >
                    Save
                  </Button>
                )}
              </div>
            </Col> */}
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserProfile;
