/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import UserControlsTable from "../Common/UserControlsTable";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import axios from "axios";
import AddUserButton from "../Common/AddUserButton";
import Swal from "sweetalert2";
import Select from "react-select";
import * as Yup from "yup";
import Pagination from "components/Pagination";
import { userListSlice, getUserList } from "features/user/userListSlice";
import BasicInputField from "components/Forms/BasicInputField";
import { useFormik } from "formik";
const AssessmentReceiverDashboard = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const userList = useSelector((state) => state.userList);
  const [roleOptions, setRoleOptions] = useState();
  useEffect(() => {
    dispatch(getUserList());
  }, []);
  useEffect(() => {
    axios.get("api/get-roles").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.id,
          label: options.description,
        }));
        setRoleOptions(options);
      },
      (error) => {}
    );
  }, []);

  const validation = useFormik({
    enableReinitialize: false,
    initialValues: {
      fname: "",
      mname: "",
      lname: "",
      password: "",
      confirm_password: "",
      role_id: [],
    },
    validationSchema: Yup.object().shape({
      fname: Yup.string().required("First Name is required!"),
      lname: Yup.string().required("Last Name is required!"),
      role_id: Yup.number().required("User role is required"),
      password: Yup.string()
        .required("Password is required!")
        .min(6, "Password must be at least 6 characters long"),
      confirm_password: Yup.string()
        .required("Please confirm your password!")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values, { resetForm }) => {
      Swal.fire({
        title: "Please wait...",
        text: "Submitting user information",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await axios.post("api/admin/add-user", values);
        dispatch(getUserList());
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "User has been saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        resetForm();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    },
  });
  console.log(validation.errors);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="User Controls" breadcrumbItem="Users" />
          <Row>
            <Col md="4">
              <Card className="shadow-lg mb-3">
                <CardBody>
                  <p
                    style={{
                      fontWeight: "bold",
                      letterSpacing: ".2rem",
                      fontSize: "18pt",
                      margin: "0",
                      padding: "0 0 0 12px", // top, right, bottom, left
                      color: "#368be0",
                      marginBottom: "10px",
                    }}
                  >
                    {"Add New User"}
                  </p>
                  <BasicInputField
                    type={"text"}
                    validation={validation}
                    col={12}
                    placeholder={"First Name"}
                    required
                    name={"fname"}
                    value={validation.values.fname}
                    touched={validation.touched.fname}
                    errors={validation.errors.fname}
                    label={"First Name"}
                  />
                  <BasicInputField
                    type={"text"}
                    validation={validation}
                    col={12}
                    placeholder={"Middle Initial"}
                    name={"mname"}
                    label={"Middle Initial"}
                    touched={validation.touched.mname}
                    errors={validation.errors.mname}
                    value={validation.values.mname}
                  />
                  <BasicInputField
                    type={"text"}
                    validation={validation}
                    col={12}
                    placeholder={"Last Name"}
                    required
                    value={validation.values.lname}
                    touched={validation.touched.lname}
                    errors={validation.errors.lname}
                    name={"lname"}
                    label={"Last Name"}
                  />
                  <BasicInputField
                    type={"password"}
                    validation={validation}
                    col={12}
                    placeholder={"Password"}
                    required
                    name={"password"}
                    value={validation.values.password}
                    touched={validation.touched.password}
                    errors={validation.errors.password}
                    label={"Password"}
                  />
                  <BasicInputField
                    type={"password"}
                    validation={validation}
                    col={12}
                    placeholder={"Confirm Password"}
                    required
                    name={"confirm_password"}
                    value={validation.values.confirm_password}
                    touched={validation.touched.confirm_password}
                    errors={validation.errors.confirm_password}
                    label={"Confirm Password"}
                  />
                  <Label>
                    User Role<span style={{ color: "red" }}>&nbsp;*</span>
                  </Label>
                  <Select
                    options={roleOptions || []}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={(selected) => {
                      const values = selected
                        ? selected.map((opt) => opt.value)
                        : [];
                      validation.setFieldValue("role_id", values);
                    }}
                  />
                  <Row className="mt-2">
                    <Col>
                      <div className="text-end">
                        <Button
                          type="submit"
                          className="me-2"
                          color="success"
                          onClick={() => validation.handleSubmit()}
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          color="danger"
                          onClick={() => validation.resetForm()}
                        >
                          Clear
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md="8">
              <Card className="shadow-lg mb-3">
                <CardBody>
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
                    Users
                  </p>
                  {/* <DashboardFilters action={getUserList} forAction={0} /> */}

                  {/* <AddUserButton roleOptions={roleOptions}></AddUserButton> */}
                  <UserControlsTable
                    data={userList}
                    tableData={userList?.users?.data}
                  />
                  <Pagination
                    dataProps={userList.users}
                    setDataProps={userListSlice.actions.setDataProps}
                    setShowLoading={userListSlice.actions.setShowLoading}
                    isLoading={userList.isFetching}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AssessmentReceiverDashboard;
