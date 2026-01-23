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
  console.log(dateFilter?.filter_type);

  const exportDocument = (data) => {
    const ws_data = [];

    // TITLE
    // if (dateFilter.filter_type === "")

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
        "Date Issued",
        "Control No",
        "Name",
        "Gender",
        "Address",
        "Purpose",
      ]);
    } else if (dateFilter.filter_type.label === "Occupational Permit") {
      ws_data.push([
        "No of permits issued per day ",
        "Date Issued",
        "Control No",
        "Requestor Name",
      ]);
    } else {
      ws_data.push([
        "No of permits issued per day ",
        "Date Issued",
        "Control No",
        "Name of Organization",
        "Name of Representative",
        "Name of Event",
        "Date of Event",
        "Time of Event",
      ]);
    }
    if (
      dateFilter.filter_type.label === "Good Moral" ||
      dateFilter.filter_type.label === "Mayors Permit"
    ) {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.ended_at,
          item.control_number,
          item.name_of_requestor,
          item.gender,
          item.address,
          item.purpose,
        ]);
      });
    } else if (dateFilter.filter_type.label === "Occupational Permit") {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.ended_at,
          item.control_number,
          item.name_of_requestor,
        ]);
      });
    } else {
      data.forEach((item) => {
        ws_data.push([
          item.sequence,
          item.ended_at,
          item.control_number,
          item.name_of_organization,
          item.name_of_requestor,
          item.name_of_event,
          item.date_of_event,
          item.time_of_event,
        ]);
      });
    }
    // let totalDur1to3 = 0;
    // let totalDur4to5 = 0;
    // let totalDur1to5 = 0;
    // let validDur1to3 = 0;
    // let validDur4to5 = 0;
    // let validDur1to5 = 0;

    // // DATA ROWS
    // data.forEach((item) => {
    //   const getDateTime = (dt) =>
    //     dt
    //       ? [moment(dt).format("MMMM D, YYYY"), moment(dt).format("h:mm:ss a")]
    //       : ["NONE", "NONE"];

    //   const stage1 = getDateTime(item.business_stages[0]?.created_at);
    //   const stage2 = getDateTime(item.business_stages[1]?.created_at);
    //   const stage3 = getDateTime(item.business_stages[2]?.created_at);
    //   const stage4 = getDateTime(item.business_stages[3]?.created_at);
    //   const stage5 = getDateTime(item.business_stages[4]?.created_at);
    //   const stage6 = getDateTime(item.business_stages[5]?.created_at);

    //   ws_data.push([
    //     item.business_code,
    //     item.business_name,
    //     item.owner,
    //     item.type,
    //     item.status,
    //     ...stage1,
    //     ...stage2,
    //     ...stage3,
    //     ...stage4,
    //     ...stage6,
    //     ...stage5,
    //     item.durationStage1to3,
    //     item.durationStage3to4,
    //     item.durationStage4to6,
    //     item.durationStage1to5,
    //     item.avgDurationStage1to5,
    //   ]);

    //   const dur1to3Hours = timeStringToHours(item.durationStage1to3);
    //   if (!isNaN(dur1to3Hours)) {
    //     totalDur1to3 += dur1to3Hours;
    //     validDur1to3++;
    //   }

    //   const dur4to5Hours = timeStringToHours(item.durationStage4to5);
    //   if (!isNaN(dur4to5Hours)) {
    //     totalDur4to5 += dur4to5Hours;
    //     validDur4to5++;
    //   }

    //   const dur1to5Hours = timeStringToHours(item.durationStage1to5);
    //   if (!isNaN(dur1to5Hours)) {
    //     totalDur1to5 += dur1to5Hours;
    //     validDur1to5++;
    //   }
    // });

    // // FOOTER: TOTAL AVERAGE (in time format)
    // const formatDuration = (hours) => {
    //   if (!isFinite(hours) || isNaN(hours)) return "0:00:00";
    //   const totalSeconds = Math.round(hours * 3600);
    //   const h = Math.floor(totalSeconds / 3600);
    //   const m = Math.floor((totalSeconds % 3600) / 60);
    //   const s = totalSeconds % 60;
    //   return `${h}:${m.toString().padStart(2, "0")}:${s
    //     .toString()
    //     .padStart(2, "0")}`;
    // };

    // ws_data.push([
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   // formatDuration(calculateAverage(totalDur1to3, validDur1to3)),
    //   // formatDuration(calculateAverage(totalDur4to5, validDur4to5)),
    //   // formatDuration(calculateAverage(totalDur1to5, validDur1to5)),
    // ]);

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
