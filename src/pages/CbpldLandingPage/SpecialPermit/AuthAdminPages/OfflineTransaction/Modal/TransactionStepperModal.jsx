import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import ReceiverCard from "./ReceiverCard";
import axios from "axios";
import Swal from "sweetalert2";
// ─── Keyframes + Google Fonts ────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
  @keyframes txnPulse {
    0%   { box-shadow: 0 0 0 0 rgba(55,138,221,0.45); }
    60%  { box-shadow: 0 0 0 9px rgba(55,138,221,0); }
    100% { box-shadow: 0 0 0 0 rgba(55,138,221,0); }
  }
  @keyframes txnBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
`;

// ─── Status config ───────────────────────────────────────────────────────────
// Maps every possible `code` from the API to a display color & icon hint.
// Extend this as your backend adds more statuses.
const S = {
  header: {
    background: "#042C53",
    padding: "1.25rem 1.5rem",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 500,
    color: "#85B7EB",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 3px",
  },
  headerTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    color: "#E6F1FB",
    margin: "0 0 2px",
  },
  headerSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    color: "#85B7EB",
    margin: 0,
  },
  closeBtn: {
    background: "rgba(134,183,235,0.15)",
    border: "0.5px solid rgba(134,183,235,0.3)",
    color: "#85B7EB",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "15px",
    flexShrink: 0,
    padding: 0,
    lineHeight: 1,
  },
  body: { padding: "1.25rem 1.5rem 0.75rem" },

  // ── Detail grid ──
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "1.25rem",
  },
  detailCard: {
    background: "#F8F9FA",
    border: "0.5px solid rgba(0,0,0,0.07)",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  detailCardFull: {
    gridColumn: "1 / -1",
  },
  detailLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 500,
    color: "#9CA3AF",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "0 0 3px",
  },
  detailValue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "#111827",
    margin: 0,
  },
  statusChip: (code) => {
    const cfg = getStatusConfig(code);
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      background: cfg.bg,
      color: cfg.color,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: "20px",
    };
  },

  // ── Stepper ──
  stepperLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 500,
    color: "#9CA3AF",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: "0 0 12px",
  },
  stepper: { display: "flex", flexDirection: "column", gap: 0 },
  step: (isLast) => ({
    display: "flex",
    gap: "14px",
    paddingBottom: isLast ? 0 : "24px",
  }),
  stepLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    width: "30px",
  },
  dot: (status) => ({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    zIndex: 1,
    background:
      status === "done"
        ? "#042C53"
        : status === "active"
        ? "#185FA5"
        : "#F0F2F5",
    border:
      status === "done"
        ? "2px solid #185FA5"
        : status === "active"
        ? "2px solid #378ADD"
        : "2px solid #D1D5DB",
    animation: status === "active" ? "txnPulse 2s ease-out infinite" : "none",
  }),
  line: (status) => ({
    width: "2px",
    flex: 1,
    margin: "4px 0",
    borderRadius: "2px",
    background:
      status === "done"
        ? "#185FA5"
        : status === "active"
        ? "linear-gradient(180deg,#185FA5 0%,#D1D5DB 100%)"
        : "#D1D5DB",
  }),
  stepContent: { flex: 1, paddingTop: "3px", minWidth: 0 },
  stepName: (status) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: status === "pending" ? "#ADB5BD" : "#111827",
    margin: "0 0 3px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    flexWrap: "wrap",
  }),
  stepDate: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: "4px",
    background:
      status === "done"
        ? "#E6F1FB"
        : status === "active"
        ? "#185FA5"
        : "#F0F2F5",
    color:
      status === "done"
        ? "#0C447C"
        : status === "active"
        ? "#E6F1FB"
        : "#ADB5BD",
  }),
  doneBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    fontSize: "10px",
    fontWeight: 500,
    padding: "1px 6px",
    borderRadius: "20px",
    background: "#EAF3DE",
    color: "#27500A",
  },
  activeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    fontWeight: 500,
    padding: "1px 6px",
    borderRadius: "20px",
    background: "#DBEAFE",
    color: "#042C53",
  },

  // ── Footer ──
  footer: {
    borderTop: "0.5px solid rgba(0,0,0,0.07)",
    padding: "0.9rem 1.5rem",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    background: "#fff",
  },
  btnGhost: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    background: "transparent",
    border: "0.5px solid rgba(0,0,0,0.18)",
    color: "#6C757D",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnPrimary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    background: "#042C53",
    border: "none",
    color: "#E6F1FB",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
};
const STATUS_CONFIG = {
  received: {
    label: "Received",
    color: "#0C447C",
    bg: "#E6F1FB",
    dot: "#378ADD",
  },
  processing: {
    label: "Processing",
    color: "#633806",
    bg: "#FAEEDA",
    dot: "#EF9F27",
  },
  approved: {
    label: "Approved",
    color: "#27500A",
    bg: "#EAF3DE",
    dot: "#639922",
  },
  released: {
    label: "Released",
    color: "#27500A",
    bg: "#EAF3DE",
    dot: "#639922",
  },
  rejected: {
    label: "Rejected",
    color: "#791F1F",
    bg: "#FCEBEB",
    dot: "#E24B4A",
  },
  cancelled: {
    label: "Cancelled",
    color: "#444441",
    bg: "#F1EFE8",
    dot: "#888780",
  },
};
const getStatusConfig = (code) => {
  return (
    STATUS_CONFIG[code?.toLowerCase()] ?? {
      label: code ?? "Unknown",
      color: "#444441",
      bg: "#F1EFE8",
      dot: "#888780",
    }
  );
};

// ─── Date formatter ──────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Step status resolver ────────────────────────────────────────────────────
// All history items are "done"; the last one is "active" (current status).
// Any status codes beyond history are "pending".
function resolveStepStatus(index, historyLength) {
  if (index < historyLength - 1) return "done";
  if (index === historyLength - 1) return "active";
  return "pending";
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7l3.5 3.5L12 3.5"
        stroke="#85B7EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ActiveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="#E6F1FB" />
    </svg>
  );
}
function PendingIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#ADB5BD" strokeWidth="2.5" />
    </svg>
  );
}
function ClockIcon({ color = "currentColor" }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path
        d="M12 6v6l4 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke="#85B7EB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="4" stroke="#85B7EB" strokeWidth="2" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
        stroke="#85B7EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="7"
        y1="7"
        x2="7.01"
        y2="7"
        stroke="#85B7EB"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

// ─── Main Component ──────────────────────────────────────────────────────────
/**
 * TransactionStepperModal
 *
 * Props:
 *   isOpen   {boolean}   — controls visibility
 *   toggle   {function}  — open/close handler
 *   data     {object}    — the `data` object from your API response
 *                          (matches the JSON shape provided)
 *   onClose  {function}  — optional extra handler on close button
 */
export default function TransactionStepperModal({
  isOpen,
  toggle,
  data,
  onClose,
}) {
  if (!data) return null;
  const {
    control_number,
    requestor_name,
    current_status,
    date,
    time,
    special_permit_type,
    receivers = [],
    history = [],
  } = data;
  const [pictures, setPictures] = useState({});
  const activeStepIndex = history.length - 1;
  const receiver = receivers[0] ?? null;

  const formattedDate = formatDate(date);
  const currentCfg = getStatusConfig(current_status);
  useEffect(() => {
    if (isOpen && receiver) {
      axios
        .get(`api/admin/get-receiver-images/${receiver?.id}`)
        .then((res) => {
          setPictures({
            picture: res?.data?.photo,
            signature: res?.data?.signature,
          });
          Swal.close();
        })
        .catch((error) => {
          console.log(error.response.data);
          Swal.close();
          Swal.fire({
            icon: "warning",
            title: "No records found in releasing",
            showConfirmButton: false,
            timer: 2000,
          }).then(function () {});
        });
    }
  }, [receiver]);
  const handleClose = () => {
    onClose?.();
    toggle();
  };

  return (
    <>
      <style>{KEYFRAMES}</style>

      <Modal isOpen={isOpen} toggle={handleClose} centered size="md">
        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <p style={S.headerLabel}>Offline · Transaction Detail</p>
            <p style={S.headerTitle}>{control_number}</p>
            {/* <p style={S.headerSub}>
              {special_permit_type?.name ?? "—"} · {formattedDate}{" "}
              {time ? `at ${time}` : ""}
            </p> */}
          </div>
          <button style={S.closeBtn} onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        <ModalBody style={S.body}>
          {/* ── Transaction detail grid ── */}
          <div style={S.detailGrid}>
            <div style={S.detailCard}>
              <p style={S.detailLabel}>Control Number</p>
              <p style={S.detailValue}>{control_number}</p>
            </div>

            <div style={S.detailCard}>
              <p style={S.detailLabel}>Status</p>
              <span style={S.statusChip(current_status)}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: currentCfg.dot,
                    display: "inline-block",
                    animation:
                      current_status?.toLowerCase() !== "released"
                        ? "txnBlink 1.4s ease-in-out infinite"
                        : "none",
                  }}
                />
                {current_status}
              </span>
            </div>

            <div style={S.detailCard}>
              <p style={S.detailLabel}>Requestor</p>
              <p style={S.detailValue}>{requestor_name}</p>
            </div>

            <div style={S.detailCard}>
              <p style={S.detailLabel}>Permit Type</p>
              <p style={S.detailValue}>
                {special_permit_type?.name ?? "—"}
                {special_permit_type?.code ? (
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontWeight: 400,
                      fontSize: "11px",
                      marginLeft: "5px",
                    }}
                  >
                    ({special_permit_type.code})
                  </span>
                ) : null}
              </p>
            </div>
            {/* 
            <div style={{ ...S.detailCard, ...S.detailCardFull }}>
              <p style={S.detailLabel}>Date & Time</p>
              <p style={S.detailValue}>
                {formattedDate} {time ? `· ${time}` : ""}
              </p>
            </div> */}
          </div>

          {/* ── Receiver card ── */}
          {receiver && <ReceiverCard receiver={receiver} pictures={pictures} />}

          {/* ── Stepper ── */}
          <p style={S.stepperLabel}>Transaction History</p>
          <div style={S.stepper}>
            {history.map((step, index) => {
              const status = resolveStepStatus(index, history.length);
              const isLast = index === history.length - 1;

              return (
                <div key={`${step.code}-${index}`} style={S.step(isLast)}>
                  {/* Dot + line */}
                  <div style={S.stepLeft}>
                    <div style={S.dot(status)}>
                      {status === "done" && <CheckIcon />}
                      {status === "active" && <ActiveIcon />}
                      {status === "pending" && <PendingIcon />}
                    </div>
                    {!isLast && <div style={S.line(status)} />}
                  </div>

                  {/* Content */}
                  <div style={S.stepContent}>
                    <p style={S.stepName(status)}>
                      {step.status}
                      {status === "done" && (
                        <span style={S.doneBadge}>
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2 7l3.5 3.5L12 3.5"
                              stroke="#27500A"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Done
                        </span>
                      )}
                      {status === "active" && (
                        <span style={S.activeBadge}>
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#185FA5",
                              display: "inline-block",
                              animation: "txnBlink 1.4s ease-in-out infinite",
                            }}
                          />
                          Current
                        </span>
                      )}
                    </p>

                    {step.date && (
                      <span style={S.stepDate(status)}>
                        <ClockIcon
                          color={
                            status === "done"
                              ? "#0C447C"
                              : status === "active"
                              ? "#E6F1FB"
                              : "#ADB5BD"
                          }
                        />
                        {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ModalBody>

        <ModalFooter style={S.footer}>
          <button style={S.btnGhost} onClick={handleClose}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
