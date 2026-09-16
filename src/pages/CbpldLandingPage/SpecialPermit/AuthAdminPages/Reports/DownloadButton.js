import React, { useState } from "react";
import { Button } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  singleColumns,
  stageColumns,
  durationColumns,
  remarksColumn,
} from "./Table/reportColumn";
import { formatDuration } from "./Table/reportUtils";

const lastColumnIndex =
  singleColumns.length +
  stageColumns.length * 2 +
  durationColumns.length +
  1 -
  1;

const DownloadButton = () => {
  const dateFilter = useSelector((state) => state.specialPermitReport);
  const [isLoading, setIsLoading] = useState(false);

  const exportDocument = (rows) => {
    const ws_data = [];

    const permitLabel = dateFilter?.filter_type?.label || "";
    ws_data.push([`RECEIVING LOGBOOK REPORT (${permitLabel})`]);
    const dateRange = `${dateFilter?.filter_date_from || ""} - ${
      dateFilter?.filter_date_to || ""
    }`;
    ws_data.push([`Covered Period: "${dateRange}"`]);
    ws_data.push([]);

    const headerRow1 = [];
    const headerRow2 = [];
    singleColumns.forEach((col) => {
      headerRow1.push(col.header);
      headerRow2.push("");
    });
    stageColumns.forEach((col) => {
      headerRow1.push(col.header, "");
      headerRow2.push("Date", "Time");
    });
    durationColumns.forEach((col) => {
      headerRow1.push(col.header);
      headerRow2.push("");
    });
    headerRow1.push(remarksColumn.header);
    headerRow2.push("");

    const headerRowIndex = ws_data.length;
    ws_data.push(headerRow1);
    ws_data.push(headerRow2);

    rows.forEach((row) => {
      const dataRow = [];
      dataRow.push(
        row.document_control_no,
        row.complete_name_of_requestor,
        row.valid_id_number || "",
        row.contact_no,
      );
      stageColumns.forEach((col) => {
        dataRow.push(row[col.key]?.date || "", row[col.key]?.time || "");
      });
      durationColumns.forEach((col) => {
        dataRow.push(formatDuration(row[col.from], row[col.to]));
      });
      dataRow.push(row.remarks || "");
      ws_data.push(dataRow);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(ws_data);

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: lastColumnIndex } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: lastColumnIndex } },
    ];

    let colIndex = 0;
    singleColumns.forEach(() => {
      merges.push({
        s: { r: headerRowIndex, c: colIndex },
        e: { r: headerRowIndex + 1, c: colIndex },
      });
      colIndex += 1;
    });
    stageColumns.forEach(() => {
      merges.push({
        s: { r: headerRowIndex, c: colIndex },
        e: { r: headerRowIndex, c: colIndex + 1 },
      });
      colIndex += 2;
    });
    durationColumns.forEach(() => {
      merges.push({
        s: { r: headerRowIndex, c: colIndex },
        e: { r: headerRowIndex + 1, c: colIndex },
      });
      colIndex += 1;
    });
    merges.push({
      s: { r: headerRowIndex, c: colIndex },
      e: { r: headerRowIndex + 1, c: colIndex },
    });

    worksheet["!merges"] = merges;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const safeDateRange = dateRange.replace(/[\\/:*?"<>|]/g, "-");
    const fileName = `RECEIVING LOGBOOK REPORT ${safeDateRange}`;
    XLSX.writeFile(workbook, fileName + ".xlsx");
  };

  const { filter_date_from, filter_date_to, filter_type } = dateFilter;

  const handleDownloadReport = () => {
    setIsLoading(true);
    axios({
      url: "api/admin/get/receiving-logbook",
      method: "GET",
      params: {
        type: filter_type?.value,
        date_from: filter_date_from,
        date_to: filter_date_to,
        transaction_type: "online",
        // The endpoint still paginates server-side; request a high per_page
        // so the export covers every matching row, not just one page.
        per_page: 10000,
      },
    }).then(
      function (res) {
        const rows = res?.data?.data || [];
        exportDocument(rows);
        setIsLoading(false);
      },
      function () {
        setIsLoading(false);
      },
    );
  };

  return (
    <Button
      className="h4"
      style={{ color: "white", marginTop: "16px" }}
      color="primary"
      disabled={isLoading}
      onClick={() => {
        handleDownloadReport();
      }}
    >
      <i className="mdi mdi-file-download"></i> Download Report
    </Button>
  );
};

export default DownloadButton;
