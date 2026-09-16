export const singleColumns = [
  { key: "document_control_no", header: "Document Control No." },
  { key: "complete_name_of_requestor", header: "Complete Name of Requestor" },
  { key: "valid_id_number", header: "Valid I.D. Presented / ID Number" },
  { key: "contact_no", header: "Contact No." },
];

export const stageColumns = [
  { key: "initial_receiving", header: "Initial Receiving" },
  { key: "initial_action", header: "Initial Action (Approved)" },
  { key: "final_receiving", header: "Final Receiving" },
  { key: "issuance", header: "Issuance" },
  { key: "completed", header: "Completed" },
];

export const durationColumns = [
  {
    key: "duration_initial_receiving_to_approval",
    header: "Duration (Initial Receiving - Approval)",
    from: "initial_receiving",
    to: "initial_action",
  },
  {
    key: "duration_final_receiving_to_completion",
    header: "Duration (Final Receiving - Completed)",
    from: "final_receiving",
    to: "completed",
  },
];

export const remarksColumn = { key: "remarks", header: "Remarks" };
