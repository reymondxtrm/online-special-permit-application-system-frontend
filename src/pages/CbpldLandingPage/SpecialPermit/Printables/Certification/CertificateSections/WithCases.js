import React from "react";

export default function WithCases({ withCase, scale }) {
  const baseFontSize = 11; // pt
  const fontSize = baseFontSize * scale;
  const formatWithNewlines = (text) => {
    return text.replace(/\n/g, "<br>");
  };
  return (
    <div
      style={{
        marginTop: "10px", // Top margin
        marginLeft: "2.54cm", // Left margin
        marginBottom: "0.25cm", // Bottom margin
        marginRight: "1.5cm",
        lineHeight: "1.2",
      }}
    >
      <div style={{ marginLeft: "50px" }}>
        <p
          style={{
            fontFamily: "Cambria, serif",
            fontSize: `${fontSize}pt`, // Font size for the rest of the text
            fontWeight: "bold", // Bold for the rest of the text

            marginBottom: "1em", // Add spacing for readability
            textAlign: "justify", // Justify the text
            lineHeight: "1.5", // Set line height for readability
          }}
          dangerouslySetInnerHTML={{ __html: formatWithNewlines(withCase) }} // Render the text
        ></p>
      </div>
    </div>
  );
}
