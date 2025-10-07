import React from "react";

export default function HeadersTitle({ headerTitle, scale }) {
  const baseFontSize = 20; // pt
  const fontSize = baseFontSize * scale;
  return (
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
          color: "#154172",
          padding: 0,
          margin: 0,
          fontFamily: "Bookman Old Style, serif",
        }}
      >
        {headerTitle}
      </p>
    </div>
  );
}
