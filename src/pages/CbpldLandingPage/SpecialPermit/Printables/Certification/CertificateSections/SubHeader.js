import React from "react";

export default function SubHeader({ permitType, purpose, subHeader, scale }) {
  const base1 = 17; // pt
  const base2 = 11; // pt

  const fontSize1 = base1 * scale;
  const fontSize2 = base2 * scale;
  return (
    <>
      {permitType !== "event" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: `${fontSize1}pt`,
              color: "#154172",
              fontFamily: "Bookman Old Style, serif",
              padding: 0,
              margin: 0,
              fontWeight: permitType === "good_moral" ? null : "bold",
            }}
          >
            {`(${permitType === "mayors_permit" ? purpose : subHeader})`}
          </p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize2}pt`,
            color: "#4C9F70",
            fontFamily: "Book Antiqua",
            padding: 0,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {"Series of 2025"}
        </p>
      </div>
    </>
  );
}
