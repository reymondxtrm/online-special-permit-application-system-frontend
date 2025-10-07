import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import { Button, Spinner } from "reactstrap";
import { useSelector } from "react-redux";

// HELPER FUNCTION TO CONVERT HH:MM:SS TO HOURS
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
    return 0; // Invalid number format
  }
  return hours + minutes / 60 + seconds / 3600;
};

// HELPER FUNCTION TO CALCULATE AVERAGE
const calculateAverage = (total, count) => {
  return count > 0 ? total / count : 0;
};

const ExportButton = (params) => {
  const dateFilter = useSelector((state) => state.dateFilter.searchParams);
  const [isLoading, setIsLoading] = useState(false);

  const exportDocument = (data) => {
    const ws_data = [];

    // TITLE
    ws_data.push(["TURN AROUND TIME OF BUSINESS APPLICATION TRACKING SYSTEM"]);
    const dateRange = `${dateFilter.date_from || ""} - ${
      dateFilter.date_to || ""
    }`;
    ws_data.push([`Covered Period: "${dateRange}"`]);
    ws_data.push([]);

    // HEADER ROWS
    ws_data.push([
      "Business Code",
      "Business Name",
      "Owner",
      "Type",
      "Status",
      "Initial Received",
      "",
      "Assessment Received",
      "",
      "Assessment Released",
      "",
      "Complete Received",
      "",
      "Permit Printed",
      "",
      "Final Released",
      "",
      "Initial Received - Assessment Released",
      "Assessment Released - Complete Received",
      "Complete Received - Final Released",
      "Total Duration",
      "Total Average",
    ]);
    ws_data.push([
      "",
      "",
      "",
      "",
      "",
      "Date",
      "Time",
      "Date",
      "Time",
      "Date",
      "Time",
      "Date",
      "Time",
      "Date",
      "Time",
      "Date",
      "Time",
      "",
      "",
      "",
      "",
      "",
    ]);

    // ACCUMULATORS FOR AVERAGE CALCULATION
    let totalDur1to3 = 0;
    let totalDur4to5 = 0;
    let totalDur1to5 = 0;
    let validDur1to3 = 0;
    let validDur4to5 = 0;
    let validDur1to5 = 0;

    // DATA ROWS
    data.forEach((item) => {
      const getDateTime = (dt) =>
        dt
          ? [moment(dt).format("MMMM D, YYYY"), moment(dt).format("h:mm:ss a")]
          : ["NONE", "NONE"];

      const stage1 = getDateTime(item.business_stages[0]?.created_at);
      const stage2 = getDateTime(item.business_stages[1]?.created_at);
      const stage3 = getDateTime(item.business_stages[2]?.created_at);
      const stage4 = getDateTime(item.business_stages[3]?.created_at);
      const stage5 = getDateTime(item.business_stages[4]?.created_at);
      const stage6 = getDateTime(item.business_stages[5]?.created_at);

      ws_data.push([
        item.business_code,
        item.business_name,
        item.owner,
        item.type,
        item.status,
        ...stage1,
        ...stage2,
        ...stage3,
        ...stage4,
        ...stage6,
        ...stage5,
        item.durationStage1to3,
        item.durationStage3to4,
        item.durationStage4to6,
        item.durationStage1to5,
        item.avgDurationStage1to5,
      ]);

      const dur1to3Hours = timeStringToHours(item.durationStage1to3);
      if (!isNaN(dur1to3Hours)) {
        totalDur1to3 += dur1to3Hours;
        validDur1to3++;
      }

      const dur4to5Hours = timeStringToHours(item.durationStage4to5);
      if (!isNaN(dur4to5Hours)) {
        totalDur4to5 += dur4to5Hours;
        validDur4to5++;
      }

      const dur1to5Hours = timeStringToHours(item.durationStage1to5);
      if (!isNaN(dur1to5Hours)) {
        totalDur1to5 += dur1to5Hours;
        validDur1to5++;
      }
    });

    // FOOTER: TOTAL AVERAGE (in time format)
    const formatDuration = (hours) => {
      if (!isFinite(hours) || isNaN(hours)) return "0:00:00";
      const totalSeconds = Math.round(hours * 3600);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    };

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
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // formatDuration(calculateAverage(totalDur1to3, validDur1to3)),
      // formatDuration(calculateAverage(totalDur4to5, validDur4to5)),
      // formatDuration(calculateAverage(totalDur1to5, validDur1to5)),
    ]);

    // CREATE WORKSHEET
    const worksheet = XLSX.utils.aoa_to_sheet(ws_data);

    // MERGE CELLS
    worksheet["!merges"] = [
      // Title + Subtitle
      { s: { r: 0, c: 0 }, e: { r: 0, c: 16 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 16 } },
      // Header merge
      { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
      { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } },
      { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } },
      { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } },
      { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } },
      { s: { r: 3, c: 5 }, e: { r: 3, c: 6 } },
      { s: { r: 3, c: 7 }, e: { r: 3, c: 8 } },
      { s: { r: 3, c: 9 }, e: { r: 3, c: 10 } },
      { s: { r: 3, c: 11 }, e: { r: 3, c: 12 } },
      { s: { r: 3, c: 13 }, e: { r: 3, c: 14 } },
      { s: { r: 3, c: 15 }, e: { r: 3, c: 16 } },
      { s: { r: 3, c: 17 }, e: { r: 4, c: 17 } },
      { s: { r: 3, c: 18 }, e: { r: 4, c: 18 } },
      { s: { r: 3, c: 19 }, e: { r: 4, c: 19 } },
      { s: { r: 3, c: 20 }, e: { r: 4, c: 20 } },
    ];

    // EXPORT
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Sanitize file name to avoid invalid characters (e.g., /, \\)
    const safeDateRange = dateRange.replace(/[\\/:*?"<>|]/g, "-");
    const fileName = `BPLD Summary ${safeDateRange}`;
    XLSX.writeFile(workbook, fileName + ".xlsx");
  };

  const { keyword, status, date_from, date_to } = params.params;

  const fetchDataToBeExported = () => {
    setIsLoading(true);
    axios({
      url: "api/summary",
      method: "GET",
      params: {
        keyword: keyword,
        status: status,
        date_from: date_from,
        date_to: date_to,
        export: 1,
      },
    }).then(
      function (res) {
        console.log(res);
        exportDocument(res.data);
        setIsLoading(false);
      },
      function (error) {
        setIsLoading(false);
      }
    );
  };

  return (
    <Button
      type="button"
      color="warning"
      className="btn-sm btn-rounded"
      onClick={(e) => {
        fetchDataToBeExported();
      }}
      style={{ marginBottom: "2px" }}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner size="sm">Loading...</Spinner>
          <span> Exporting...</span>
        </>
      ) : (
        <>
          <i className="fas fa-file-export"></i> Export
        </>
      )}
    </Button>
  );
};

export default ExportButton;
