import React from "react";

export default function SubHeader({ permitType, purpose, subHeader }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  const currentYear = new Date().getFullYear();

  // Determine if we should show the permit type header
  const showPermitTypeHeader = permitType !== "event";

  // Determine what text to display in the header
  const headerText = permitType === "mayors_permit" ? purpose : subHeader;

  // Determine if font weight should be lighter (for good_moral)
  const isGoodMoral = permitType === "good_moral";
  const text = headerText ? `(${headerText})` : "";
  return (
    <div className="subheader-section">
      {showPermitTypeHeader && (
        <div className="subheader-wrapper">
          <p
            className={`subheader-title ${
              isGoodMoral ? "subheader-title--light" : ""
            }`}
          >
            {text}
          </p>
        </div>
      )}

      <div className="subheader-wrapper">
        <p className="subheader-series">Series of {currentYear}</p>
      </div>
    </div>
  );
}
