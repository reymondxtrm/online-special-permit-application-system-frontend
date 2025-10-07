/* eslint-disable padded-blocks */
import React from "react";
import { Table, Button, Badge } from "reactstrap";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import ReleaseButton from "components/Common/Buttons/ReleaseButton";
import EditButton from "components/Common/Buttons/EditButton";
import FinalReleaseButton from "components/Common/Buttons/FinalReleaseButton";
import { getForAssessmentReceiving } from "features/AssessmentReceiver/assessmentReceiverSlice";

const TableDashboard = ({
  data,
  tableData,
  displayRelease,
  displayEdit,
  api = null,
  route,
  assessment_receiver,
  assessment_releaser,
  complete_receiver,
  final_releaser,
  buttonName,
  addBusinessCode,
  finalRelease,
  showModal,
}) => {
  var businessCodeModal = false;
  var controlNo = false;
  var businessPermit = false;
  var plateNo = false;
  var finalRelaseModal = false;

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
                }}
              >
                Control No.
              </th>
              <th
                style={{
                  width: "20%",
                }}
              >
                Business Name
              </th>
              <th
                style={{
                  width: "5%",
                }}
              >
                Type
              </th>

              <th
                style={{
                  width: "10%",
                }}
              >
                Gender - Type
              </th>
              <th
                style={{
                  width: "10%",
                }}
              >
                Business Code
              </th>

              <th
                style={{
                  width: "10%",
                }}
              >
                Business Permit
              </th>
              <th
                style={{
                  width: "10%",
                }}
              >
                PLate No.
              </th>
              <th
                style={{
                  width: "10%",
                }}
              >
                Owner
              </th>
              <th
                style={{
                  width: "10%",
                }}
              >
                Status
              </th>
              <th
                style={{
                  width: "15%",
                }}
              >
                Date
              </th>
              {assessment_receiver ||
              assessment_releaser ||
              complete_receiver ? (
                <th
                  style={{
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  From Initial Receiving
                </th>
              ) : null}
              {assessment_releaser ? (
                <th
                  style={{
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  From Assessment Receiving
                </th>
              ) : null}
              {final_releaser ? (
                <th
                  style={{
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  From Complete Receiving
                </th>
              ) : null}
              {displayRelease || displayEdit ? (
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
              tableData &&
              (tableData.length === 0 ? (
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
                tableData.map((items, index) => {
                  addBusinessCode
                    ? items.permit_type.name === "new"
                      ? items.business_code
                        ? (businessCodeModal = false)
                        : (businessCodeModal = true)
                      : (businessCodeModal = false)
                    : null;

                  items.permit_type.name === "new"
                    ? (finalRelaseModal = true)
                    : (finalRelaseModal = false);
                  finalRelease
                    ? items.permit_type.name === "new"
                      ? items.control_no
                        ? (controlNo = false)
                        : (controlNo = true)
                      : (controlNo = false)
                    : null;

                  finalRelease
                    ? items.permit_type.name === "new"
                      ? items.business_permit
                        ? (businessPermit = false)
                        : (businessPermit = true)
                      : (businessPermit = false)
                    : null;

                  finalRelease
                    ? items.permit_type.name === "new"
                      ? items.plate_no
                        ? (plateNo = false)
                        : (plateNo = true)
                      : (plateNo = false)
                    : null;

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

                      {assessment_receiver ||
                      assessment_releaser ||
                      complete_receiver ? (
                        <td>
                          <Badge
                            color={
                              assessment_releaser ? "success" : items.color
                            }
                          >
                            {items.aging_from_initial_receiving}
                          </Badge>
                        </td>
                      ) : null}

                      {assessment_releaser ? (
                        <td>
                          <Badge color={items.color}>
                            {items.aging_from_assessment_receiving}
                          </Badge>
                        </td>
                      ) : null}

                      {final_releaser ? (
                        <td>
                          <Badge color={items.color}>
                            {items.aging_from_complete_receiving}
                          </Badge>
                        </td>
                      ) : null}

                      {displayRelease ? (
                        finalRelease ? (
                          <td>
                            <FinalReleaseButton
                              api={api}
                              id={items.id}
                              refreshTableFunction={getForAssessmentReceiving}
                              buttonName={buttonName}
                              openModal={finalRelaseModal}
                              businessCode={businessCodeModal}
                              controlNo={controlNo}
                              businessPermit={businessPermit}
                              plateNo={plateNo}
                            />
                          </td>
                        ) : (
                          <td>
                            <ReleaseButton
                              api={api}
                              id={items.id}
                              refreshTableFunction={getForAssessmentReceiving}
                              buttonName={buttonName}
                              openModal={businessCodeModal}
                            />
                          </td>
                        )
                      ) : null}
                      {displayEdit ? (
                        <td>
                          <EditButton
                            api={api}
                            id={items.id}
                            refreshTableFunction={getForAssessmentReceiving}
                            buttonName={buttonName}
                            openModal={businessCodeModal}
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

export default TableDashboard;
