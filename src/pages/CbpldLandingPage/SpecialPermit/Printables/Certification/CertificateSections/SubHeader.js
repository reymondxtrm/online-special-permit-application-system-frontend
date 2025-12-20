import React from "react";

export default function SubHeader({ permitType, purpose, subHeader, scale }) {
  const base1 = 17; // pt
  const base2 = 11; // pt

  const fontSize1 = base1 * scale;
  const fontSize2 = base2 * scale;
  const currentYear = new Date().getFullYear();

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
              // fontWeight: "500",
              fontFamily: "Golos Text, sans-serif",
              padding: 0,
              margin: 0,
              fontWeight: permitType === "good_moral" ? null : "500",
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
            color: "#11a7ee",
            fontFamily: "Book Antiqua",
            padding: 0,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {`Series of ${currentYear}`}
        </p>
      </div>
    </>
  );
}
