import React, { useState } from "react";
import { Button, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
const timeStringToHours = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    return 0; // Or perhaps null or throw an error depending on your needs
  }
  const parts = timeString.split(":");
  if (parts.length !== 3) {
    return 0; // Invalid format
  }
  const [hours, minutes, seconds] = parts.map(Number);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return 0;
  }
  return hours + minutes / 60 + seconds / 3600;
};
const DownloadButton = () => {
  const dateFilter = useSelector((state) => state.specialPermitAdmin);

  const [isLoading, setIsLoading] = useState(false);

  const exportDocument = (initialData) => {
    const data = initialData?.permits || [];
    const ws_data = [];

    ws_data.push([`SPECIAL PERMIT REPORT (${dateFilter.filter_type.label})`]);
    const dateRange = `${dateFilter.filter_date_from || ""} - ${
      dateFilter.filter_date_to || ""
    }`;
    ws_data.push([`Covered Period: "${dateRange}"`]);
    ws_data.push([]);

    // HEADER ROWS
    if (
      dateFilter.filter_type.label === "Good Moral" ||
      dateFilter.filter_type.label === "Mayors Permit"
    ) {
      ws_data.push([
        "No of permits issued per day ",
        "Date Received",
        "Time Received",
        "Date Issued",
        "Time Issued",
        "Control No",
        "Name",
        "Gender",
        "Address",
        "Purpose",
        "Duration  (in minutes)",
      ]);
    } else if (dateFilter.filter_type.label === "Occupational Permit") {
      ws_data.push([
        "No of permits issued per day ",
        "Date Received",
        "Time Received",
        "Date Issued",
        "Time Issued",
        "Control No",
        "Requestor Name",
        "Duration  (in minutes)",
      ]);
    } else {
      ws_data.push([
        "No of permits issued per day ",
        "Date Received",
        "Time Received",
        "Date Issued",
        "Time Issued",
        "Control No",
        "Name of Organization",
        "Name of Representative",
        "Name of Event",
        "Date of Event",
        "Time of Event",
        "Duration (in minutes)",
      ]);
    }

    if (
      dateFilter.filter_type.label === "Good Moral" ||
      dateFilter.filter_type.label === "Mayors Permit"
    ) {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.start_at_date,
          item.start_at_time,
          item.ended_at_date,
          item.ended_at_time,
          item.control_number,
          item.name_of_requestor,
          item.gender,
          item.address,
          item.purpose,
          item.parsed_duration,
        ]);
      });
      ws_data.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Average Turn Around Time:",
        initialData.average_duration,
      ]);
    } else if (dateFilter.filter_type.label === "Occupational Permit") {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.start_at_date,
          item.start_at_time,
          item.ended_at_date,
          item.ended_at_time,
          item.control_number,
          item.name_of_requestor,
          item.parsed_duration,
        ]);
      });
      ws_data.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "Average Turn Around Time:",
        initialData.average_duration,
      ]);
    } else {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.start_at_date,
          item.start_at_time,
          item.ended_at_date,
          item.ended_at_time,
          item.control_number,
          item.name_of_organization,
          item.name_of_requestor,
          item.name_of_event,
          item.date_of_event,
          item.time_of_event,
          item.parsed_duration,
        ]);
      });
      ws_data.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Average Turn Around Time:",
        initialData.average_duration,
      ]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(ws_data);

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Sanitize file name to avoid invalid characters (e.g., /, \\)
    const safeDateRange = dateRange.replace(/[\\/:*?"<>|]/g, "-");
    const fileName = `SPECIAL PERMIT REPORT ${safeDateRange}`;
    XLSX.writeFile(workbook, fileName + ".xlsx");
  };

  const { filter_date_from, filter_date_to, filter_type } = dateFilter;

  const handleDownloadReport = () => {
    setIsLoading(true);
    axios({
      url: "api/admin/get/reports",
      method: "GET",
      params: {
        type: filter_type.value,
        date_from: filter_date_from,
        date_to: filter_date_to,
      },
    }).then(
      function (res) {
        exportDocument(res.data);
        setIsLoading(false);
      },
      function (error) {
        setIsLoading(false);
      },
    );
  };

  return (
    <Button
      className="h4 "
      style={{ color: "white", marginTop: "16px" }}
      color="primary"
      onClick={() => {
        handleDownloadReport();
      }}
    >
      <i className="mdi mdi-file-download "></i> Download Report
    </Button>
  );
};

export default DownloadButton;
