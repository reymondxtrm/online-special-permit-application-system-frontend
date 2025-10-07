/* eslint-disable padded-blocks */
import React, { useState, useEffect } from "react";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import { useDispatch } from "react-redux";
import { Table, Badge } from "reactstrap";

const SummaryTable = ({ data, tableData }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction])
    );
  }, [tableData, sortConfig]);

  // console.log(tableData);

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

  const checkStatus = (status) => {
    if (status === "initial_received") {
      return "Initial Received";
    }
    if (status === "assessment_received") {
      return "Assessment Received";
    }
    if (status === "assessment_released") {
      return "Assessment Released";
    }
    if (status === "complete_received") {
      return "Complete Received";
    }
    if (status === "final_released") {
      return "Final Released";
    }
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
                rowSpan="2"
                style={{
                  width: "8%",
                  cursor: "pointer",
                  //   textAlign: "center",
                  verticalAlign: "bottom",
                }}
                onClick={() => sortData("control_no")}
              >
                Business Code.
              </th>
              <th
                rowSpan="2"
                style={{
                  width: "15%",
                  cursor: "pointer",
                  //   textAlign: "center",
                  verticalAlign: "bottom",
                }}
                onClick={() => sortData("control_no")}
              >
                Business Name.
              </th>
              <th
                rowSpan="2"
                style={{
                  width: "10%",
                  cursor: "pointer",
                  //   textAlign: "center",
                  verticalAlign: "bottom",
                }}
                onClick={() => sortData("control_no")}
              >
                Owner.
              </th>
              <th
                rowSpan="2"
                style={{
                  width: "5%",
                  cursor: "pointer",
                  //   textAlign: "center",
                  verticalAlign: "bottom",
                }}
                onClick={() => sortData("control_no")}
              >
                Type.
              </th>
              <th
                rowSpan="2"
                style={{
                  width: "8%",
                  cursor: "pointer",
                  //   textAlign: "center",
                  verticalAlign: "bottom",
                }}
                onClick={() => sortData("control_no")}
              >
                Status.
              </th>

              <th
                colSpan={5}
                style={{
                  width: "15%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("created_at")}
              >
                <h3>TIME</h3>
              </th>
              <th
                colSpan={3}
                style={{
                  width: "15%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("created_at")}
              >
                <h3>Duration</h3>
              </th>
            </tr>
            <tr>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Initial Received
              </th>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Assessment Received
              </th>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Assessment Released
              </th>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Complete Received
              </th>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Permit Printed
              </th>
              <th
                style={{
                  width: "5%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Final Released
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Intial Received - Assessment Released
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Assessment Released - Complete Received
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Complete Received - Final Released
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Total Duration
              </th>
              <th
                style={{
                  width: "10%",
                  cursor: "pointer",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
                onClick={() => sortData("status")}
              >
                Total Average
              </th>
            </tr>
          </thead>
          <tbody>
            {data.isFetching ? (
              <TableLoader row={13} col={10} />
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
                      <td>
                        {items.business_code ? items.business_code : "NONE"}
                      </td>
                      <td>{items.business_name}</td>
                      <td>{items.owner}</td>
                      <td>{items.type === "renew" ? "Renew" : " New"}</td>
                      <td>{checkStatus(items.status)}</td>
                      <td>
                        <h6>
                          <Badge color={"success"}>
                            {moment(items.business_stages[0].created_at).format(
                              "MMMM D, YYYY, h:mm:ss a"
                            )}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h6>
                          <Badge
                            color={
                              items.business_stages[1]?.created_at
                                ? "success"
                                : "secondary"
                            }
                          >
                            {items.business_stages[1]?.created_at
                              ? moment(
                                  items.business_stages[1].created_at
                                ).format("MMMM D, YYYY, h:mm:ss a")
                              : "NONE"}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h6>
                          <Badge
                            color={
                              items.business_stages[2]?.created_at
                                ? "success"
                                : "secondary"
                            }
                          >
                            {items.business_stages[2]?.created_at
                              ? moment(
                                  items.business_stages[2].created_at
                                ).format("MMMM D, YYYY, h:mm:ss a")
                              : "NONE"}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h6>
                          <Badge
                            color={
                              items.business_stages[3]?.created_at
                                ? "success"
                                : "secondary"
                            }
                          >
                            {items.business_stages[3]?.created_at
                              ? moment(
                                  items.business_stages[3].created_at
                                ).format("MMMM D, YYYY, h:mm:ss a")
                              : "NONE"}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h6>
                          <Badge
                            color={
                              items.business_stages[5]?.created_at
                                ? "success"
                                : "secondary"
                            }
                          >
                            {items.business_stages[5]?.created_at
                              ? moment(
                                  items.business_stages[5].created_at
                                ).format("MMMM D, YYYY, h:mm:ss a")
                              : "NONE"}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h6>
                          <Badge
                            color={
                              items.business_stages[4]?.created_at
                                ? "success"
                                : "secondary"
                            }
                          >
                            {items.business_stages[4]?.created_at
                              ? moment(
                                  items.business_stages[4].created_at
                                ).format("MMMM D, YYYY, h:mm:ss a")
                              : "NONE"}
                          </Badge>
                        </h6>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h5>
                          <Badge
                            color={
                              items.type === "renew" &&
                              moment
                                .duration(items.durationStage1to3)
                                .asMinutes() < 56.3 &&
                              moment
                                .duration(items.durationStage1to3)
                                .asMinutes() !== 0
                                ? "success"
                                : moment
                                    .duration(items.durationStage1to3)
                                    .asMinutes() < 58.3 &&
                                  moment
                                    .duration(items.durationStage1to3)
                                    .asMinutes() !== 0
                                ? "success"
                                : moment
                                    .duration(items.durationStage1to3)
                                    .asMinutes() === 0
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {items.durationStage1to3}
                          </Badge>
                        </h5>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h5>
                          <Badge
                            color={
                              items.type === "renew" &&
                              moment
                                .duration(items.durationStage3to4)
                                .asMinutes() < 28 &&
                              moment
                                .duration(items.durationStage1to3)
                                .asMinutes() !== 0
                                ? "success"
                                : moment
                                    .duration(items.durationStage3to4)
                                    .asMinutes() === 0
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {items.durationStage3to4}
                          </Badge>
                        </h5>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <h5>
                          <Badge
                            color={
                              items.type === "renew" &&
                              moment
                                .duration(items.durationStage4to6)
                                .asMinutes() < 28 &&
                              moment
                                .duration(items.durationStage1to3)
                                .asMinutes() !== 0
                                ? "success"
                                : moment
                                    .duration(items.durationStage4to6)
                                    .asMinutes() === 0
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {items.durationStage4to6}
                          </Badge>
                        </h5>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h5>
                          <Badge color={"success"}>
                            {items.durationStage1to5}
                          </Badge>
                        </h5>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <h5>
                          <Badge color={"success"}>
                            {items.avgDurationStage1to5}
                          </Badge>
                        </h5>
                      </td>
                      {/* <td style={{ textAlign: "center" }}>
                          <h5>
                            <Badge color={"success"}>
                              {items.durationStage4to5}
                            </Badge>
                          </h5>
                        </td> */}
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

export default SummaryTable;
