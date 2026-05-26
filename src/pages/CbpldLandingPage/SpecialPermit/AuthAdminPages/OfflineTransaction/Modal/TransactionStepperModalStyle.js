export const S = {
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
    fontFamily: "'Playfair Display', serif",
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

  // ── Receiver card ──
  receiverCard: {
    background: "#F0F7FF",
    border: "0.5px solid rgba(24,95,165,0.18)",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  receiverAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#042C53",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#85B7EB",
  },
  receiverName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "#042C53",
    margin: "0 0 2px",
  },
  receiverMeta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    color: "#6B7280",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
export const STATUS_CONFIG = {
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
