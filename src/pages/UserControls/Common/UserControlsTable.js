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

const UserControlsTable = ({ data, tableData }) => {
  const dispatch = useDispatch();
  const params = {
    for_action: 1,
  };

  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction])
    );
  }, [tableData, sortConfig]);

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

          // 🔄 Optional: refresh your list after deletion
          // fetchUsers();
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
              <th>User ID</th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("first_name")}
              >
                First Name
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
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("roles")}
              >
                Role(s)
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.isFetching ? (
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
                      <td>{items.id}</td>
                      <td>{items.first_name}</td>
                      <td>{`${items.middle_name || ""}`}</td>
                      <td>{items.last_name}</td>
                      <td>
                        {items.user_roles.map((role) => (
                          <span key={role.id + role.role_name}>
                            <h5>
                              <Badge color="success">
                                {role.role_name === "admin" ? "Admin" : null}
                                {role.role_name === "initial_receiver"
                                  ? "Initian Receiver"
                                  : null}
                                {role.role_name === "assessment_receiver"
                                  ? "Assessment Receiver"
                                  : null}
                                {role.role_name === "assessment_releaser"
                                  ? "Assessment Releaser"
                                  : null}
                                {role.role_name === "complete_receiver"
                                  ? "Complete Receiver"
                                  : null}
                                {role.role_name === "final_releaser"
                                  ? "Final Releaser"
                                  : null}
                                {role.role_name === "super_admin"
                                  ? "Super Admin"
                                  : null}
                              </Badge>{" "}
                            </h5>
                          </span>
                        ))}
                      </td>
                      <td>
                        {/* <i
                          className="mdi mdi-pen text-warning fs-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(items.id)}
                        /> */}
                        <i
                          className="mdi mdi-trash-can text-danger fs-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(items.id)}
                        />
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
