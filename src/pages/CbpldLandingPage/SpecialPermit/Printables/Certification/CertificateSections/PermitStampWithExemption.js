import React from "react";
import moment from "moment";
export default function PermitStampWithExemption({
  exemptedCases,
  dateIssued,
  approvedBy,
  ordinance,
}) {
  const toPascalCaseWithSpaces = (str = "") => {
    return str
      .replace(/[_\s]+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  return (
    <div className="footer-left" style={{ padding: "20px" }}>
      <p
        className="fw-bold"
        style={{
          fontFamily: "Bookman Old Style, serif",
          fontSize: "10px",
        }}
      >{`EXEMPTED PER ${ordinance ?? ""} `}</p>
      <p
        className="fw-bold"
        style={{
          fontFamily: "Bookman Old Style, serif",
          fontSize: "10px",
        }}
      >
        {exemptedCases ? `(${toPascalCaseWithSpaces(exemptedCases)})` : ""}
      </p>
      <p className="footer-small" style={{ fontSize: "9x" }}>
        {moment(dateIssued).format("MM/DD/YYYY hh:mm A")} by: {approvedBy}
      </p>
    </div>
  );
}
