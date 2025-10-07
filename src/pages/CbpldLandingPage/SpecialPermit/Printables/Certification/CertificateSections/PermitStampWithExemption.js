import React from "react";
import moment from "moment";
export default function PermitStampWithExemption({
  exemptedCases,
  dateIssued,
  approvedBy,
  ordinance,
}) {
  const toPascalCaseWithSpaces = (str) => {
    return str
      .replace(/[_\s]+/g, " ") // Replace underscores or multiple spaces with single space
      .split(" ") // Split string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
      .join(" "); // Join words with spaces
  };
  return (
    <div className="footer-left" style={{ padding: "20px" }}>
      <p
        className="fw-bold"
        style={{
          fontFamily: "Bookman Old Style, serif",
          fontSize: "13px",
        }}
      >{`EXEMPTED PER ${ordinance ?? ""} `}</p>
      <p
        className="fw-bold"
        style={{
          fontFamily: "Bookman Old Style, serif",
          fontSize: "13px",
        }}
      >{`(${toPascalCaseWithSpaces(exemptedCases ?? "")})`}</p>
      <p className="footer-small" style={{ fontSize: "12px" }}>
        {moment(dateIssued).format("MM/DD/YYYY hh:mm A")} by: {approvedBy}
      </p>
    </div>
  );
}
