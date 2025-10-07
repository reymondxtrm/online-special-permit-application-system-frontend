/* eslint-disable padded-blocks */
import React, { useState, useEffect } from "react";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import { useDispatch } from "react-redux";
// import ReceiveButton from "./ReceiveButton";
import { Table, Badge, Button } from "reactstrap";
import EditButton from "components/Common/Buttons/EditButton";
import DetailsButton from "components/Common/Buttons/DetailsButton";
import { getForCompleteReceiving } from "features/CompleteReceiver/completeReceiverSlice";
import axios from "axios";
import Swal from "sweetalert2";

const CompleteReceiverTable = ({
  data,
  tableData,
  displayReceive,
  displayEdit,
  action,
  api,
  showAging,
  showDetails,
}) => {
  // var openModal = false;
  const dispatch = useDispatch();
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction])
    );
  }, [tableData, sortConfig]);
  const params = { for_action: 1 };

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

  const handleRelease = (id) => {
    Swal.fire({
      title: "Click Yes to Release",
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
          title: "Releasing...",
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
          .post(
            api,
            {
              business_id: id,
            },
            {
              credentials: "include",
            }
          )
          .then(
            (res) => {
              dispatch(getForCompleteReceiving(params));
              Swal.fire({
                icon: "success",
                title: "Document Successfully Released",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {});
            },
            (error) => {
              if (error.response.status === 401) {
              }
             
              Swal.fire({
                icon: "warning",
                title: "Releasing Failed",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {});
            }
          );
      } else {
        console.log("cancel");
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
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("control_no")}
              >
                Control No.
              </th>
              <th
                style={{
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("name")}
              >
                Business Name
              </th>
              <th
                style={{
                  width: "20%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("permit_type.name")}
              >
                Type
              </th>

              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("gender_type.gender_type")}
              >
                Gender - Type
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("business_code")}
              >
                Business Code
              </th>

              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("business_permit")}
              >
                Business Permit
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("plate_no")}
              >
                PLate No.
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("owner")}
              >
                Owner
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("status")}
              >
                Status
              </th>
              <th
                style={{
                  width: "15%",
                  cursor: "pointer",
                }}
                onClick={() => sortData("created_at")}
              >
                Date
              </th>
              {showAging ? (
                <th
                  style={{
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  From Initial Receiving
                </th>
              ) : null}

              {displayReceive || showDetails || displayEdit ? (
                <th
                  style={{
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  Action
                </th>
              ) : null}
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
                  // items.permit_type.name === "new"
                  //   ? items.business_code
                  //     ? (openModal = false)
                  //     : (openModal = true)
                  //   : (openModal = false);
                  return (
                    <tr key={items.id}>
                      <td>{items.control_no}</td>
                      <td>{items.name}</td>
                      <td>{items.permit_type.name}</td>
                      <td>{items.gender_type.gender_type}</td>
                      <td>{items.business_code}</td>

                      <td>{items.business_permit}</td>
                      <td>{items.plate_no}</td>
                      <td>{items.owner}</td>
                      <td>{items.status}</td>
                      <td>
                        <h5>
                          <Badge color={"success"}>
                            {moment(items.created_at).format(
                              "MMMM D, YYYY, h:mm:ss a"
                            )}
                          </Badge>
                        </h5>
                      </td>
                      {showAging ? (
                        <td>
                          <Badge color={items.color}>
                            {items.aging_from_initial_receiving}
                          </Badge>
                        </td>
                      ) : null}

                      {displayReceive ? (
                        <td>
                          {/* <ReceiveButton
                            api={api}
                            id={items.id}
                            openModal={openModal}
                          /> */}

                          <Button
                            onClick={() => handleRelease(items.id)}
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            style={{ marginBottom: "2px" }}
                          >
                            Receive
                          </Button>
                        </td>
                      ) : null}
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {showDetails ? (
                            <DetailsButton business_id={items.id} />
                          ) : null}
                          {displayEdit ? (
                            <EditButton
                              control_no={items.control_no}
                              business_code={items.business_code}
                              business_owner={items.owner}
                              business_name={items.name}
                              api={"api/edit"}
                              action={action}
                              business_id={items.id}
                              stage={"complete_receiving"}
                            />
                          ) : null}
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

export default CompleteReceiverTable;
