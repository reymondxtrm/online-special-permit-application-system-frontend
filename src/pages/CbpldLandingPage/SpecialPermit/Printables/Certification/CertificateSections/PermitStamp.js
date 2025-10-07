import React from "react";
import moment from "moment";

export default function PermitStamp({ orNo, ORDate, dateIssued, approvedBy }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div className="footer-left" style={{ padding: "20px" }}>
      <p>
        O.R. No. : <strong>{orNo}</strong>
      </p>
      <p>
        Date of O.R. issued: <strong>{formatDate(ORDate)}</strong>
      </p>

      <p className="footer-small">
        {moment(new Date()).format("MM/DD/YYYY hh:mm A")} by: {approvedBy}
      </p>
    </div>
  );
}
