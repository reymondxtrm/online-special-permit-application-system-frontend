/* eslint-disable padded-blocks */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Table, Badge } from "reactstrap";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import { getForAssessmentReceiving } from "features/AssessmentReceiver/assessmentReceiverSlice";
import { useDispatch } from "react-redux";
import DetailsButton from "components/Common/Buttons/DetailsButton";
import useSubmit from "hooks/Common/useSubmit";
import {
  getUserList,
  getCompanyListUnvalidated,
} from "features/user/userListSlice";
import BasicInputField from "components/Forms/BasicInputField";
import { useFormik } from "formik";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

const UserControlsTable = ({
  isFetching,
  tableData,
  tableName,
  is_validated,
}) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);
  const handleSubmit = useSubmit();

  const toggleRefreshPage = () => {
    setRefreshPage((prev) => !prev);
  };
  console.log(selectedUser);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: selectedUser?.id || null,
      fname: selectedUser?.first_name || "",
      mname: selectedUser?.middle_name || "",
      lname: selectedUser?.last_name || "",
      username: selectedUser?.username || "",
      email: selectedUser?.email || "",
      contact_no: selectedUser?.user_phone_numbers?.[0]?.phone_number || "",
      city:
        selectedUser?.account_type === "individual"
          ? selectedUser?.user_addresses?.[0]?.city || ""
          : selectedUser?.user_address_morph?.[0].city || "",
      address_line:
        selectedUser?.account_type === "individual"
          ? selectedUser?.user_addresses?.[0]?.address_line || ""
          : selectedUser?.user_address_morph?.[0].address_line || "",
      barangay:
        selectedUser?.account_type === "individual"
          ? selectedUser?.user_addresses?.[0]?.barangay || ""
          : selectedUser?.user_address_morph?.[0].barangay || "",
      province:
        selectedUser?.account_type === "individual"
          ? selectedUser?.user_addresses?.[0]?.province || ""
          : selectedUser?.user_address_morph?.[0].province || "",
      subdivision:
        selectedUser?.account_type === "individual"
          ? selectedUser?.user_addresses?.[0]?.subdivision || ""
          : selectedUser?.user_address_morph?.[0].subdivision || "",
    },
    onSubmit: async (values) => {
      handleSubmit(
        {
          url: "api/admin/update-user",
          params: {
            ...values,
          },
          message: { title: "Are you sure to update this user info? " },
        },
        [
          getUserList({ unvalidated_user: 0 }),
          getCompanyListUnvalidated({ unvalidated_user: 1 }),
        ],
        [toggleRefreshPage],
      );
    },
  });
  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction]),
    );
  }, [tableData, sortConfig]);
  const validationHandle = (id) => {
    handleSubmit(
      {
        url: "api/admin/user-validate",
        params: { id: id },
        message: { title: "Are you sure you want to verify this company?" },
      },
      [
        getUserList({ unvalidated_user: 0 }),
        getCompanyListUnvalidated({ unvalidated_user: 1 }),
      ],
      [toggleRefreshPage],
    );
  };
  const sortData = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortedData(_.orderBy(tableData, [key], [direction]));
    setSortConfig({ key, direction });
  };

  const handleDelete = async (userID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`api/admin/delete-user/${userID}`);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.data.message || "User deleted successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text:
              error.response?.data?.message ||
              "Failed to delete user. Please try again.",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="tableFixHead">
        {tableName === "users" && (
          <DashboardFilters
            action={getUserList}
            tableParams={{ unvalidated_user: 0 }}
          />
        )}
        <Table hover>
          <thead
            style={{
              backgroundColor: "white",
            }}
          >
            <tr>
              {/* <th>#</th> */}
              <th>User ID</th>
              {tableName === "company" && (
                <>
                  <th
                    style={{
                      width: "20%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("first_name")}
                  >
                    Company Name
                  </th>
                  <th
                    style={{
                      width: "10%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("email")}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      width: "20%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("")}
                  >
                    Company Address
                  </th>
                </>
              )}

              {tableName === "users" ? (
                <>
                  <th
                    style={{
                      width: "10%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("first_name")}
                  >
                    First Name/Company Name
                  </th>

                  <th
                    style={{
                      width: "10%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("middle_name")}
                  >
                    Middle Initial
                  </th>
                  <th
                    style={{
                      width: "10%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("last_name")}
                  >
                    Last Name
                  </th>
                  <th
                    style={{
                      width: "10%",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("email")}
                  >
                    Email
                  </th>
                </>
              ) : (
                ""
              )}

              {is_validated && (
                <th
                  style={{
                    width: "20%",
                    cursor: "pointer",
                  }}
                  onClick={() => sortData("full_address")}
                >
                  Address
                </th>
              )}
              <th>Contact Number</th>
              <th
                style={{
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("roles")}
              >
                Role(s)
              </th>
              <th
                style={{
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("roles")}
              >
                Username
              </th>
              <th
                style={{
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("roles")}
              >
                Account Type
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <TableLoader row={10} col={10} />
            ) : (
              sortedData &&
              (sortedData?.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No record found
                  </td>
                </tr>
              ) : (
                sortedData?.map((items, index) => {
                  return (
                    <React.Fragment key={items.id}>
                      {items?.id === selectedUser?.id ? (
                        <tr>
                          <td>{items?.id}</td>
                          <td>
                            <BasicInputField
                              name={"fname"}
                              validation={validation}
                              type="text"
                              value={validation.values.fname}
                              touched={validation.touched.fname}
                              errors={validation.errors.fname}
                              col="12"
                            />
                          </td>
                          {is_validated &&
                          selectedUser?.account_type === "individual" ? (
                            <>
                              <td>
                                <BasicInputField
                                  name={"mname"}
                                  validation={validation}
                                  type="text"
                                  value={validation.values.mname}
                                  touched={validation.touched.mname}
                                  errors={validation.errors.mname}
                                  col="12"
                                />
                              </td>
                              <td>
                                <BasicInputField
                                  name={"lname"}
                                  validation={validation}
                                  type="text"
                                  value={validation.values.lname}
                                  touched={validation.touched.lname}
                                  errors={validation.errors.lname}
                                  col="12"
                                />
                              </td>
                            </>
                          ) : (
                            tableName === "users" && (
                              <>
                                <td></td>
                                <td></td>{" "}
                              </>
                            )
                          )}

                          <td>
                            <BasicInputField
                              name={"email"}
                              validation={validation}
                              type="text"
                              value={validation.values.email}
                              touched={validation.touched.email}
                              errors={validation.errors.email}
                              col="12"
                            />
                          </td>
                          <td>
                            <BasicInputField
                              name={"address_line"}
                              validation={validation}
                              type="text"
                              value={validation.values.address_line}
                              touched={validation.touched.address_line}
                              errors={validation.errors.address_line}
                              col="12"
                              label={"Purok/Street"}
                            />
                            <BasicInputField
                              name={"subdivision"}
                              validation={validation}
                              type="text"
                              value={validation.values.subdivision}
                              touched={validation.touched.subdivision}
                              errors={validation.errors.subdivision}
                              col="12"
                              label={"Subdivision"}
                            />
                            <BasicInputField
                              name={"barangay"}
                              validation={validation}
                              type="text"
                              value={validation.values.barangay}
                              touched={validation.touched.barangay}
                              errors={validation.errors.barangay}
                              col="12"
                              label={"Barangay"}
                            />
                            <BasicInputField
                              name={"city"}
                              validation={validation}
                              type="text"
                              value={validation.values.city}
                              touched={validation.touched.city}
                              errors={validation.errors.city}
                              col="12"
                              label={"City"}
                            />
                            <BasicInputField
                              name={"province"}
                              validation={validation}
                              type="text"
                              value={validation.values.province}
                              touched={validation.touched.province}
                              errors={validation.errors.province}
                              col="12"
                              label={"Province"}
                            />
                          </td>
                          <td>
                            <BasicInputField
                              name={"contact_no"}
                              validation={validation}
                              type="text"
                              value={validation.values.contact_no}
                              touched={validation.touched.contact_no}
                              errors={validation.errors.contact_no}
                              col="12"
                            />
                          </td>

                          <td>
                            {items?.user_roles?.length === 0 ? (
                              <h5>
                                {" "}
                                <Badge color="success">
                                  Special Permit User
                                </Badge>
                              </h5>
                            ) : (
                              items?.user_roles?.map((role, index) => (
                                <span key={index}>
                                  <h5>
                                    <Badge color="success">
                                      {role.role_name === "special_permit_admin"
                                        ? "Special Permit Admin"
                                        : null}
                                      {role.role_name === "special_permit_user"
                                        ? "Special Permit user"
                                        : null}
                                    </Badge>{" "}
                                  </h5>
                                </span>
                              ))
                            )}
                          </td>
                          <td>
                            <BasicInputField
                              name={"username"}
                              validation={validation}
                              type="username"
                              value={validation.values.username}
                              touched={validation.touched.username}
                              errors={validation.errors.username}
                              col="12"
                            />
                          </td>
                          <td>
                            <Badge
                              color={
                                items?.account_type === "individual"
                                  ? "success"
                                  : "primary"
                              }
                            >
                              {items?.account_type}
                            </Badge>
                          </td>
                          <td>
                            {
                              <div className="d-flex gap-1">
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    validation.handleSubmit();
                                    setSelectedUser(null);
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  color="danger"
                                  onClick={() => setSelectedUser(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            }
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>{items?.id}</td>
                          <td>{items?.first_name}</td>
                          {tableName === "users" && (
                            <>
                              <td>{`${items?.middle_name || ""}`}</td>
                              <td>{items?.last_name || ""}</td>
                            </>
                          )}
                          <td>{items?.email}</td>
                          {tableName === "company" ? (
                            <td>
                              {items?.user_address_morph?.[0]?.full_address}
                            </td>
                          ) : (
                            <td>{items?.user_addresses?.[0]?.full_address}</td>
                          )}
                          <td>
                            {items?.user_phone_numbers?.[0]?.phone_number}
                          </td>

                          <td>
                            {items?.user_roles?.length === 0 ? (
                              <h5>
                                {" "}
                                <Badge color="success">
                                  Special Permit User
                                </Badge>
                              </h5>
                            ) : (
                              items?.user_roles?.map((role, index) => (
                                <span key={index}>
                                  <h5>
                                    <Badge color="success">
                                      {role.role_name === "special_permit_admin"
                                        ? "Special Permit Admin"
                                        : null}
                                      {role.role_name === "special_permit_user"
                                        ? "Special Permit user"
                                        : null}
                                    </Badge>{" "}
                                  </h5>
                                </span>
                              ))
                            )}
                          </td>
                          <td>{items?.username || "N/A"}</td>
                          <td>
                            <Badge
                              color={
                                items?.account_type === "individual"
                                  ? "success"
                                  : "primary"
                              }
                            >
                              {items?.account_type}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex  gap-2">
                              <i
                                className="mdi mdi-trash-can text-danger fs-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(items?.id)}
                              />
                              <i
                                className="mdi mdi-account-edit fs-2 text-warning"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setIsEditing((prev) => !prev);
                                  setSelectedUser(items);
                                }}
                              ></i>
                              {items?.is_validated === 0 &&
                              items?.account_type === "company" ? (
                                <i
                                  className="mdi mdi-account-multiple-check fs-2 text-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => validationHandle(items.id)}
                                ></i>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default UserControlsTable;
