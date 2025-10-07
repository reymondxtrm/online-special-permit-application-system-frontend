import React from "react";

export default function FirstParagraph({ firstParagraph, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;
  return (
    <tr>
      <td colSpan="2">
        <div
          style={{
            marginTop: "10px",
            marginLeft: "2.54cm",
            marginBottom: "0.25cm",
            marginRight: "1.5cm",
            lineHeight: "1.2",
          }}
        >
          <p
            style={{
              fontFamily: "Cambria, serif",
              fontSize: `${fontSize}pt`,
              fontWeight: "bold",
              textIndent: "50px",
              marginBottom: "1em",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: firstParagraph }} // Render the text
          ></p>
        </div>
      </td>
    </tr>
  );
}
