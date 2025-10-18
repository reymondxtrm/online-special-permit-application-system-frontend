import React from "react";

export default function ThirdParagraph({ thirdParagraph, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;

  const marginTop = 4 * scale;
  const marginLeftRight = 1.5 * scale; // cm
  const marginBottom = 0.25 * scale; // cm
  const textIndent = 50 * scale; // px

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
          marginBottom: "1em",
          textAlign: "justify",
          lineHeight: "1.5",
        }}
        dangerouslySetInnerHTML={{
          __html: transformText(thirdParagraph),
        }}
      ></p>
    </div>
  );
}
