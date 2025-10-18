import React from "react";

export default function WithCases({ withCase, scale }) {
  const baseFontSize = 11; // pt
  const fontSize = baseFontSize * scale;

  // Scale all margins and spacing
  const marginTop = 10 * scale;
  const marginLeft = 2.54 * scale; // cm
  const marginBottom = 0.25 * scale; // cm
  const marginRight = 1.5 * scale; // cm
  const innerMarginLeft = 50 * scale; // px

  const formatWithNewlines = (text) => {
    return text.replace(/\n/g, "<br>");
  };

  return (
    <div
      style={{
        marginTop: `${marginTop}px`,
        marginLeft: `${marginLeft}cm`,
        marginBottom: `${marginBottom}cm`,
        marginRight: `${marginRight}cm`,
        lineHeight: "1.2",
      }}
    >
      <div style={{ marginLeft: `${innerMarginLeft}px` }}>
        <p
          style={{
            fontFamily: "Cambria, serif",
            fontSize: `${fontSize}pt`,
            fontWeight: "bold",
            marginBottom: "1em", // em scales with font size automatically
            textAlign: "justify",
            lineHeight: "1.5",
          }}
          dangerouslySetInnerHTML={{ __html: formatWithNewlines(withCase) }}
        ></p>
      </div>
    </div>
  );
}
