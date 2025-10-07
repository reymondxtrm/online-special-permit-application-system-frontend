/* eslint-disable padded-blocks */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Table, Badge } from "reactstrap";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import { getForAssessmentReleasing } from "features/AssessmentReleaser/assessmentReleaserSlice";
import { useDispatch } from "react-redux";
import DetailsButton from "components/Common/Buttons/DetailsButton";
import ReleasingButton from "./ReleasingButton";

const AssessmentReleaserTable = ({
  data,
  tableData,
  displayRelease,
  displayEdit,
  api,
  showAging,
  showDetails,
}) => {
  var openModal = false;
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
                <>
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
                  <th
                    style={{
                      width: "15%",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => sortData("aging_from_assessment_receiving")}
                  >
                    From Assessment Receiving
                  </th>
                </>
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
                  items.permit_type.name === "new"
                    ? items.business_code
                      ? (openModal = false)
                      : (openModal = true)
                    : (openModal = false);
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
                        <Badge color={"success"}>
                          {moment(items.created_at).format(
                            "MMMM D, YYYY, h:mm:ss a"
                          )}
                        </Badge>
                      </td>
                      {showAging ? (
                        <>
                          <td>
                            <h5>
                              <Badge color={"success"}>
                                {items.aging_from_initial_receiving}
                              </Badge>
                            </h5>
                          </td>
                          <td>
                            <h5>
                              <Badge color={items.color}>
                                {items.aging_from_assessment_receiving}
                              </Badge>
                            </h5>
                          </td>
                        </>
                      ) : null}

                      {displayRelease ? (
                        <>
                          <td>
                            <ReleasingButton
                              api={api}
                              openModal={openModal}
                              id={items.id}
                            />
                          </td>
                        </>
                      ) : null}
                      {showDetails ? (
                        <td>
                          <DetailsButton
                            business_id={items.id}
                            // openModal={openModal}
                          />
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

export default AssessmentReleaserTable;
