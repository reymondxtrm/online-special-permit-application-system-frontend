import React from "react";
import "../style.css";

export default function Conditions({ conditions, permitType }) {
  if (permitType === "good_moral" || permitType === "mayors_permit") {
    return null;
  }

  return (
    <tr>
      <td colSpan="2">
        <div className="conditions-wrapper">
          <p className="conditions-title">Conditions:</p>

          <ol className="conditions-list">
            {conditions.map((item, index) => (
              <li key={index} className="condition-item">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </td>
    </tr>
  );
}
