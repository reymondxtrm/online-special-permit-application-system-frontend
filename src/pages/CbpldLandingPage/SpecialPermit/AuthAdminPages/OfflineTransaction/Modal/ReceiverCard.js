import React, { useState } from "react";
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="#85B7EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const S = {
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
};
// ─── Helper: initials from name ───────────────────────────────────────────────
function initials(name = "") {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const ReceiverCard = ({ receiver, pictures }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  // const pictureUrl = buildUrl(receiver.picture);
  // const signatureUrl = buildUrl(receiver.signature);
  const pictureUrl = null;
  const signatureUrl = null;

  const handleImgError = (key) =>
    setImgErrors((prev) => ({ ...prev, [key]: true }));

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {/* ── Top row (always visible) ── */}
      <div
        style={{
          ...S.receiverCard,
          marginBottom: 0,
          borderRadius: expanded ? "8px 8px 0 0" : "8px",
          cursor: "pointer",
          userSelect: "none",
          transition: "border-radius 0.2s",
        }}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      >
        <div style={S.receiverAvatar}>{initials(receiver.name)}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={S.receiverName}>{receiver.name}</p>
          <p style={S.receiverMeta}>
            <PhoneIcon />
            {receiver.phone_number}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              color: "#6B7280",
              textAlign: "right",
            }}
          >
            <div
              style={{ fontWeight: 500, marginBottom: "2px", color: "#0C447C" }}
            >
              Receiver
            </div>
            <div>ID #{receiver.id}</div>
          </div>

          {/* Chevron toggle */}
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: expanded ? "#042C53" : "rgba(24,95,165,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke={expanded ? "#E6F1FB" : "#185FA5"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Expandable image panel ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? "300px" : "0px",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          background: "#F0F7FF",
          borderLeft: expanded ? "0.5px solid rgba(24,95,165,0.18)" : "none",
          borderRight: expanded ? "0.5px solid rgba(24,95,165,0.18)" : "none",
          borderBottom: expanded ? "0.5px solid rgba(24,95,165,0.18)" : "none",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <div
          style={{
            padding: "12px 14px 14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {/* ID Picture */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                color: "#6B7280",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              ID Picture
            </p>
            <div
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                background: "#E0EDFA",
                border: "0.5px solid rgba(24,95,165,0.2)",
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pictures?.picture ? (
                <img
                  src={pictures?.picture}
                  alt="Receiver ID"
                  onError={() => handleImgError("picture")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="#378ADD"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="8.5"
                    cy="8.5"
                    r="1.5"
                    stroke="#378ADD"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M21 15l-5-5L5 21"
                    stroke="#378ADD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Signature */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                color: "#6B7280",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Signature
            </p>
            <div
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                background: "#fff",
                border: "0.5px solid rgba(24,95,165,0.2)",
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pictures?.signature ? (
                <img
                  src={pictures?.signature}
                  alt="Receiver Signature"
                  onError={() => handleImgError("signature")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    padding: "8px",
                  }}
                />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 17c3-3 5-5 7-3s3 4 6 1"
                    stroke="#378ADD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 8l4-4M3 21h4"
                    stroke="#378ADD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReceiverCard;
