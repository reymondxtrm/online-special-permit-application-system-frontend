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
  exemption_proof: "Froof of Exemption",
  certificate_of_ordinance: "Cetificate of Ordinance",
  s_e_c_certificate: "SEC Certificate",
};

export default function FileIconFormat({
  fileType = "police_clearance",
  path,
  toggleIsViewerOpen,
  getImageHandle,
  isAdmin = false,
  label, // optional short text, e.g. "View" when the column header names the file
}) {
  if (!FILE_LABELS[fileType]) return null;
  const text = label || FILE_LABELS[fileType];

  const handleOpen = async () => {
    if (!getImageHandle) {
      if (toggleIsViewerOpen) toggleIsViewerOpen();
      return;
    }
    try {
      if (toggleIsViewerOpen) toggleIsViewerOpen();
      await getImageHandle({
        path: path,
        url: isAdmin ? "api/admin/attachment" : "api/client/attachment",
        showLoader: true,
      });
    } catch (err) {
      toggleIsViewerOpen();
      console.error("Failed to load image", err);
    }
  };

  return (
    <span
      className="file-chip"
      title={`View ${FILE_LABELS[fileType]}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen();
      }}
    >
      <i className="mdi mdi-file-check-outline" />
      {text}
    </span>
  );
}
