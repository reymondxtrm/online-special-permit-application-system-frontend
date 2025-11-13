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

const UserControlsTable = ({ isFetching, tableData, tableName }) => {
  const dispatch = useDispatch();
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const handleSubmit = useSubmit();
  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction])
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
      []
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
        <Table hover>
          <thead
            style={{
              backgroundColor: "white",
            }}
          >
            <tr>
              <th>#</th>
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
                </>
              ) : (
                ""
              )}

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
              (sortedData.length === 0 ? (
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
                sortedData.map((items, index) => {
                  return (
                    <tr key={items.id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{items.id}</td>
                      <td>{items.first_name}</td>
                      {tableName === "users" && (
                        <>
                          <td>{`${items.middle_name || ""}`}</td>
                          <td>{items.last_name}</td>
                        </>
                      )}
                      {tableName === "company" && (
                        <td>{items?.user_address_morph[0]?.full_address}</td>
                      )}
                      <td>
                        <Badge
                          color={
                            items.account_type === "individual"
                              ? "success"
                              : "primary"
                          }
                        >
                          {items?.account_type}
                        </Badge>
                      </td>
                      <td>
                        {items.user_roles.length === 0 ? (
                          <h5>
                            {" "}
                            <Badge color="success">Special Permit User</Badge>
                          </h5>
                        ) : (
                          items.user_roles.map((role, index) => (
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
                        <div className="d-flex  gap-2">
                          <i
                            className="mdi mdi-trash-can text-danger fs-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(items.id)}
                          />
                          {items.is_validated === 0 &&
                          items.account_type === "company" ? (
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
