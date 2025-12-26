import React, { useMemo } from "react";

export default function ThirdParagraph({ thirdParagraph }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const transformText = (input) => {
    if (!input) return "";

    let t = escapeHtml(input);

    // Transform ordinal numbers (1st, 2nd, 3rd, etc.) to underlined with superscript
    t = t.replace(
      /\b(\d+)(st|nd|rd|th)\b/gi,
      (_, num, suffix) => `<u>${num}<sup>${suffix}</sup></u>&nbsp;`
    );

    // Underline month names
    const months =
      "January|February|March|April|May|June|July|August|September|October|November|December";
    const monthRegex = new RegExp(`\\b(${months})\\b`, "gi");
    t = t.replace(
      monthRegex,
      (m) => `<span style="text-decoration:underline;">${m}</span>`
    );

    return t;
  };

  // Memoize transformed text to avoid unnecessary recalculations
  const transformedText = useMemo(
    () => transformText(thirdParagraph),
    [thirdParagraph]
  );

  return (
    <div className="third-paragraph-wrapper">
      <p
        className="third-paragraph-text"
        dangerouslySetInnerHTML={{ __html: transformedText }}
      />
    </div>
  );
}
