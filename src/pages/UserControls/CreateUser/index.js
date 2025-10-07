import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  Row,
  Col,
  Alert,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb2";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import BasicInputField from "components/Forms/BasicInputField";
import Select2InputField from "components/Forms/select2InputField";
// @ts-ignore

const CreateUser = () => {
  const offices = useSelector((state) => state.office.offices);
  const userDetails = useSelector((state) => state.user);
  const dropDownOptions = useSelector((state) => state.userList);
  const [divisionOptions, setDivisionOptions] = useState();
  const [userRoleOptions, setUserRoleOptions] = useState();
  const [failErrorMessage, setFailErrorMessage] = useState(null);
  useEffect(() => {
    if (dropDownOptions.divisions) {
      const options = dropDownOptions.divisions.map((item) => ({
        label: item.division,
        value: item.divisions_id,
      }));
      setDivisionOptions(options);
    }
    if (dropDownOptions.userRoles) {
      if (userDetails.role === "Administrator") {
        const options = dropDownOptions.userRoles.filter(
          (item) => item.user_roles_id !== 2
        );
        let userRoleOptions = options.map((item) => ({
          label: item.role,
          value: item.user_roles_id,
        }));
        setUserRoleOptions(userRoleOptions);
      } else if (userDetails.role === "Division Head") {
        const rolesList = dropDownOptions.userRoles.filter(
          (item) => item.user_roles_id !== 1 && item.user_roles_id !== 3
        );
        const options = rolesList.map((item) => ({
          label: item.role,
          value: item.user_roles_id,
        }));
        setUserRoleOptions(options);
      }
    }
  }, [dropDownOptions.divisions, dropDownOptions.userRoles]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      userRole: "",
      division: "",
      position: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      lastName: Yup.string().required("Please Enter Last Name"),
      contactNumber: Yup.string().required("Please Enter Contact Number"),
      position: Yup.string().required("Please Enter Position"),
      userRole: Yup.object().shape({
        label: Yup.string().required("Please Enter User Role"),
      }),
      email: Yup.string().required("Please Enter Email").email("Invalid Email"),
      division: Yup.object().when("userRole", {
        is: (userRole) =>
          userRole.value !== 1 && userDetails.role !== "Division Head",
        then: Yup.object().required("Please Enter Division"),
        otherwise: Yup.object().shape(),
      }),

      // division: Yup.object().shape({
      //     label: Yup.string().required("Please Enter Division"),
      // })
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Click Yes to Create User",
        icon: "warning",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(function (result) {
        if (result.value) {
          Swal.fire({
            title: "Creating User...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
          axios
            .post("api/admin/create-user", values, {
              credentials: "include",
            })
            .then(
              (res) => {
                setFailErrorMessage(null);
                Swal.fire({
                  icon: "success",
                  title: "Request successfully submitted",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              },
              (error) => {
                if (error.response.status === 401) {
                }
                console.log(error.response.data.message);
                setFailErrorMessage(error.response.data.message);
                Swal.fire({
                  icon: "warning",
                  title: "User Creation Failed",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              }
            );
        } else {
          console.log("cancel");
        }
      });
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className="vh-100 d-flex flex-column">
          <Breadcrumbs
            title="Create User"
            breadcrumbItems={[
              { title: "User Management" },
              { title: "User Controls" },
              { title: "Create User" },
            ]}
          />
          <Card>
            <CardHeader></CardHeader>
            <CardBody>
              <div className="p-2">
                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <BasicInputField
                      col={"4"}
                      label={"First Name"}
                      id={"firstName"}
                      placeholder={"Enter First Name"}
                      validation={validation}
                      type={"text"}
                    />
                    <BasicInputField
                      col={"3"}
                      label={"Middle Name"}
                      id={"middleName"}
                      placeholder={"Enter Middle Name"}
                      validation={validation}
                      type={"text"}
                    />
                    <BasicInputField
                      col={"3"}
                      label={"Last Name"}
                      id={"lastName"}
                      placeholder={"Enter Last Name"}
                      validation={validation}
                      type={"text"}
                    />
                    <BasicInputField
                      col={"2"}
                      label={"Suffix"}
                      id={"suffix"}
                      placeholder={""}
                      validation={validation}
                      type={"text"}
                    />
                  </Row>
                  <Row>
                    <BasicInputField
                      col={"4"}
                      label={"Contact Number"}
                      id={"contactNumber"}
                      placeholder={"Enter Contact Number"}
                      validation={validation}
                      type={"text"}
                    />
                    <BasicInputField
                      col={"4"}
                      label={"Email"}
                      id={"email"}
                      placeholder={"Enter Email"}
                      validation={validation}
                      type={"email"}
                    />
                    <BasicInputField
                      col={"4"}
                      label={"Position"}
                      id={"position"}
                      placeholder={"Enter Position"}
                      validation={validation}
                      type={"text"}
                    />
                  </Row>
                  <Row>
                    <Select2InputField
                      col={"12"}
                      label={"User Role"}
                      id={"userRole"}
                      placeholder={"Select Role"}
                      validation={validation}
                      options={userRoleOptions}
                      onChangeFunctions={(userRoleOptions) => {
                        validation.setFieldValue("userRole", userRoleOptions);
                        validation.setFieldValue("division", "");
                      }}
                    />
                  </Row>
                  {userDetails &&
                    (userDetails.role === "Administrator" &&
                    validation.values.userRole.value !== 1 ? (
                      <Row>
                        <Select2InputField
                          col={"12"}
                          label={"Division"}
                          id={"division"}
                          placeholder={"Select Division"}
                          validation={validation}
                          options={divisionOptions}
                          onChangeFunctions={(offices) => {
                            validation.setFieldValue("division", offices);
                          }}
                        />
                      </Row>
                    ) : (
                      ""
                    ))}

                  <Row>
                    <Col md="12">
                      {failErrorMessage && (
                        <Alert
                          color="danger"
                          className="alert fade show"
                          role="alert"
                        >
                          <i className="mdi mdi-account-cancel me-2"></i>
                          {failErrorMessage}
                        </Alert>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <button
                        className="btn btn-primary btn-block "
                        type="submit"
                      >
                        Submit
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateUser;
