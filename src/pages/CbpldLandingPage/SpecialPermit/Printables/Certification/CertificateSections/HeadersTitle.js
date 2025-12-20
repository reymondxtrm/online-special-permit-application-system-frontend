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
          padding: 0,
          margin: 0,
          fontWeight: "600",
          fontFamily: "Golos Text, sans-serif",
          color: "#154172",
        }}
      >
        {headerTitle}
      </p>
    </div>
  );
}
