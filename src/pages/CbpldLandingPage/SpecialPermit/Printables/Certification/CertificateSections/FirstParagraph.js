import React from "react";

export default function FirstParagraph({ firstParagraph, scale }) {
  const baseFontSize = 13;
  const fontSize = baseFontSize * scale;

  const marginTop = 10 * scale;
  const marginLeftRight = 1.5 * scale;
  const marginBottom = 0.25 * scale;
  const textIndent = 50 * scale; // px

  return (
    <tr>
      <td colSpan="2">
        <div
          style={{
            marginTop: `${marginTop}px`,
            marginLeft: `${marginLeftRight}cm`,
            marginBottom: `${marginBottom}cm`,
            marginRight: `${marginLeftRight}cm`,
            lineHeight: "1.2",
          }}
        >
          <p
            style={{
              fontFamily: "Cambria, serif",
              fontSize: `${fontSize}pt`,
              fontWeight: "bold",
              textIndent: `${textIndent}px`,
              marginBottom: "1em", // em scales with font size automatically
              textAlign: "justify",
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: firstParagraph }}
          ></p>
        </div>
      </td>
    </tr>
  );
}
