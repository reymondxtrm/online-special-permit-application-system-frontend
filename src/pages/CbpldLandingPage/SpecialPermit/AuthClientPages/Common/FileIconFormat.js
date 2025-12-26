import React from "react";

// Lookup table instead of switch
const FILE_LABELS = {
  police_clearance: "Police Clearance",
  community_tax_certificate: "Community Tax Certificate",
  barangay_clearance: "Barangay Clearance",
  fiscal_clearance: "Fiscal Clearance",
  court_clearance: "Court Clearance",
  request_letter: "Request Letter",
  route_plan: "Route Plan",
  certificate_of_employment: "Certificate of Employment", // fixed typo
  id_picture: "ID Picture",
  health_certificate: "Health Certificate",
  training_certificate: "Training Certificate", // fixed typo
  sworn_statement: "Sworn Statement",
  official_receipt: "Official Receipt",
};

export default function FileIconFormat({
  fileType = "police_clearance",
  path,
  toggleIsViewerOpen,
  getImageHandle,
}) {
  const text = FILE_LABELS[fileType] || "";
  if (!text) return null;

  const handleOpen = async () => {
    if (!getImageHandle) {
      if (toggleIsViewerOpen) toggleIsViewerOpen();
      return;
    }
    try {
      if (toggleIsViewerOpen) toggleIsViewerOpen();
      await getImageHandle({
        path: path,
        url: "api/client/attachment",
        showLoader: true,
      });
    } catch (err) {
      toggleIsViewerOpen();
      console.error("Failed to load image", err);
    }
  };

  return (
    <div
      className="d-flex"
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2px",
      }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen();
      }}
    >
      <div
        style={{
          backgroundColor: "#CFD7F5",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i className="mdi mdi-file-check fs-5 text-primary" />
      </div>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "10px",
          textDecoration: "underline",
        }}
        className="text-primary"
      >
        {text}
      </span>
    </div>
  );
}
