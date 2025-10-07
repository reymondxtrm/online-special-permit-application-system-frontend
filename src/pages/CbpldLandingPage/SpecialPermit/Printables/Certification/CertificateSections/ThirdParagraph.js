import React from "react";

export default function ThirdParagraph({ thirdParagraph, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;
  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const transformText = (input) => {
    if (!input) return "";

    let t = escapeHtml(input);

    t = t.replace(
      /\b(\d+)(st|nd|rd|th)\b/gi,
      (_, num, suffix) => `<u>${num}<sup>${suffix}</sup></u>&nbsp;`
    );

    const months =
      "January|February|March|April|May|June|July|August|September|October|November|December";
    const monthRegex = new RegExp(`\\b(${months})\\b`, "gi");
    t = t.replace(
      monthRegex,
      (m) => `<span style="text-decoration:underline;">${m}</span>`
    );

    return t;
  };
  return (
    <div
      style={{
        marginTop: "4px", // Top margin
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
        dangerouslySetInnerHTML={{
          __html: transformText(thirdParagraph),
        }}
      ></p>
    </div>
  );
}
