import React from "react";

export default function SecondParagraph({ secondParagraph, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;
  return (
    <div>
      <div
        style={{
          marginTop: "10px", // Top margin
          marginLeft: "2.54cm", // Left margin
          marginBottom: "0.25cm", // Bottom margin
          marginRight: "1.5cm",
          lineHeight: "1.2",
        }}
      >
        <p
          style={{
            fontFamily: "Cambria, serif",
            fontSize: `${fontSize}pt`, // Font size for the rest of the text
            fontWeight: "bold", // Bold for the rest of the text
            textIndent: "50px", // Indentation for the first line of text
            marginBottom: "1em", // Add spacing for readability
            textAlign: "justify", // Justify the text
            lineHeight: "1.5", // Set line height for readability
          }}
          dangerouslySetInnerHTML={{ __html: secondParagraph }} // Render the text
        ></p>
      </div>
    </div>
  );
}
