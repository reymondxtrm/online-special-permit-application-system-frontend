import React from "react";

export default function DepartmentHeadSingnatory({ scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;
  const padding = 120 * scale;
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}pt`,
            fontWeight: "bold",
            // color: "#005a99",
            paddingTop: `${padding}px`,
            margin: 0,
            fontFamily: "Cambria, serif",
          }}
        >
          {"ATTY. MOSHI ARIEL S. CAHOY"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}pt`,

            padding: 0,
            margin: 0,
            fontFamily: "Cambria, serif",
          }}
        >
          {"City Goverment Department Head II"}
        </p>
      </div>
    </>
  );
}
