import React from "react";

export default function Purpose({ purpose, scale }) {
  const baseFontSize = 17; // pt
  const fontSize = baseFontSize * scale;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "50px",
      }}
    >
      <p
        style={{
          fontSize: `${fontSize}pt`,
          fontWeight: "bold",
          // color: "#005a99",
          textDecoration: "underline",
          padding: 0,
          margin: 0,
          fontFamily: "Bookman Old Style, serif",
        }}
      >
        {purpose}
      </p>
    </div>
  );
}
