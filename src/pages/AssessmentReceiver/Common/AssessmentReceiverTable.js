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

const AssessmentReceiverTable = ({
  data,
  tableData,
  displayRelease,
  api,
  showAging,
  showDetails,
}) => {
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

  const receiveDocument = (id) => {
    Swal.fire({
      title: "Click Yes to Receive",
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
          title: "Receiving...",
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
              dispatch(getForAssessmentReceiving(params));
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
              console.log(error.response.data.message);
              Swal.fire({
                icon: "warning",
                title: "Receive Failed",
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
                    cursor: "pointer",
                  }}
                  onClick={() => sortData("aging_from_initial_receiving")}
                >
                  From Initial Receiving
                </th>
              ) : null}

              {displayRelease || showDetails ? (
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
                          <h5>
                            <Badge color={items.color}>
                              {items.aging_from_initial_receiving}
                            </Badge>
                          </h5>
                        </td>
                      ) : null}

                      {displayRelease ? (
                        <td>
                          <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={(e) => {
                              receiveDocument(items.id);
                            }}
                            style={{ marginBottom: "2px" }}
                          >
                            Receive
                          </Button>
                        </td>
                      ) : null}

                      {showDetails ? (
                        <td>
                          <DetailsButton business_id={items.id} />
                        </td>
                      ) : null}
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

export default AssessmentReceiverTable;
