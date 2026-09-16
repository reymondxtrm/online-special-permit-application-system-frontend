import React from "react";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import {
  singleColumns,
  stageColumns,
  durationColumns,
  remarksColumn,
} from "./reportColumn";
import { formatDuration } from "./reportUtils";

const totalColumnCount =
  singleColumns.length + stageColumns.length * 2 + durationColumns.length + 1;

const ReportTable = () => {
  const specialPermitReport = useSelector(
    (state) => state.specialPermitReport || {},
  );
  const rows = specialPermitReport?.reportData?.data || [];
  const isLoading = specialPermitReport?.getReportByTypeIsFetching;

  return (
    <div style={{ maxHeight: "70vh", overflow: "auto" }}>
      <Table bordered className="mb-0" style={{ minWidth: "1500px" }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
          <tr>
            {singleColumns.map((col) => (
              <th
                key={col.key}
                rowSpan={2}
                className="text-center align-middle bg-white"
              >
                {col.header}
              </th>
            ))}
            {stageColumns.map((col) => (
              <th key={col.key} colSpan={2} className="text-center bg-white">
                {col.header}
              </th>
            ))}
            {durationColumns.map((col) => (
              <th
                key={col.key}
                rowSpan={2}
                className="text-center align-middle bg-white"
              >
                {col.header}
              </th>
            ))}
            <th rowSpan={2} className="text-center align-middle bg-white">
              {remarksColumn.header}
            </th>
          </tr>
          <tr>
            {stageColumns.map((col) => (
              <React.Fragment key={col.key}>
                <th className="text-center bg-white">Date</th>
                <th className="text-center bg-white">Time</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={totalColumnCount} className="text-center">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={totalColumnCount} className="text-center">
                No data found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.document_control_no || index}>
                <td>{row.document_control_no}</td>
                <td>{row.complete_name_of_requestor}</td>
                <td>{row.valid_id_number || "—"}</td>
                <td>{row.contact_no}</td>
                {stageColumns.map((col) => (
                  <React.Fragment key={col.key}>
                    <td>{row[col.key]?.date || "—"}</td>
                    <td>{row[col.key]?.time || "—"}</td>
                  </React.Fragment>
                ))}
                {durationColumns.map((col) => (
                  <td key={col.key}>
                    {formatDuration(row[col.from], row[col.to])}
                  </td>
                ))}
                <td>{row.remarks || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportTable;
