/* eslint-disable padded-blocks */
import React, { useState, useEffect } from "react";
import TableLoader from "components/Loaders/TableLoaders";
import moment from "moment";
import { useDispatch } from "react-redux";
import ReleaseButton from "./ReleaseButton";
import { Table, Badge, Modal, ModalBody, Button } from "reactstrap";
import EditButton from "components/Common/Buttons/EditButton";
import DetailsButton from "components/Common/Buttons/DetailsButton";
import AllPermitReceivers from "./AllPermitReceivers";
import axios from "axios";
import PrintButton from "./PrintButton";
const FinalReleaserTable = ({
  data,
  tableData,
  displayRelease,
  displayEdit,
  api,
  showAging,
  showDetails,
  action,
  forAction,
}) => {
  var incomplete = false;
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [primaryIdOptions, setPrimaryIdOptions] = useState([]);
  console.log(forAction);
  if (forAction === 1) {
    useEffect(() => {
      axios
        .get("api/get-primary-id-type")
        .then((response) => {
          console.log(response);
          const options = response.data.map((option) => {
            return {
              value: option.id,
              label: option.name,
            };
          });
          setPrimaryIdOptions(options);
        })
        .catch((errors) => console.log(errors.response));
    }, [tableData]);
  }

  useEffect(() => {
    setSortedData(
      _.orderBy(tableData, [sortConfig.key], [sortConfig.direction])
    );
  }, [tableData, sortConfig]);

  const toggleDetailModal = () => {
    setDetailsModal((prev) => !prev);
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

  return (
    <>
      <Modal isOpen={detailsModal} toggle={toggleDetailModal}>
        <ModalBody>
          <AllPermitReceivers
            businessId={selectedRecord}
            toggle={toggleDetailModal}
          />
        </ModalBody>
      </Modal>

      <div className="tableFixHead">
        {/*add Advance search */}
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
                    ursor: "pointer",
                  }}
                  onClick={() => sortData("aging_from_complete_receiving")}
                >
                  From Complete Receiving
                </th>
              ) : null}

              {displayRelease || showDetails || displayEdit ? (
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
            {data?.isFetching ? (
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
                sortedData?.map((items, index) => {
                  items.permit_type.name === "new" ||
                  items.permit_type.name === "renew"
                    ? !items?.business_code ||
                      !items?.business_permit ||
                      !items?.plate_no
                      ? (incomplete = true)
                      : (incomplete = false)
                    : (incomplete = false);

                  return (
                    <tr key={items.id}>
                      <td>{items?.control_no || ""}</td>
                      <td>{items?.name || ""}</td>
                      <td>{items?.permit_type.name || ""}</td>
                      <td>{items?.gender_type.gender_type || ""}</td>
                      <td>{items?.business_code || ""}</td>

                      <td>{items?.business_permit || ""}</td>
                      <td>{items?.plate_no || ""}</td>
                      <td>{items?.owner || ""}</td>
                      <td>{items?.status || ""}</td>
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
                              {items.aging_from_complete_receiving}
                            </Badge>
                          </h5>
                        </td>
                      ) : null}

                      {forAction === 1 ? (
                        <td>
                          <ReleaseButton
                            api={api}
                            id={items?.id}
                            incomplete={incomplete}
                            plateNo={items?.plate_no}
                            businessCode={items?.business_code}
                            businessPermit={items?.business_permit}
                            status={items?.status}
                            options={primaryIdOptions}
                          />
                        </td>
                      ) : null}

                      {!forAction ? (
                        <td>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <DetailsButton
                              business_id={items.id}
                              forAction={1}
                            />
                            <EditButton
                              control_no={items?.control_no}
                              business_permit={items?.business_permit}
                              api={"api/edit"}
                              action={action}
                              business_id={items?.id}
                              stage={"final_releasing"}
                              plate_no={items?.plate_no}
                            />
                          </div>
                        </td>
                      ) : null}
                      {forAction === 2 ? (
                        <td>
                          <PrintButton
                            api={api}
                            forAction={forAction}
                            id={items?.id}
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

export default FinalReleaserTable;
