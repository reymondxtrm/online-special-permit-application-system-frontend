import React, { useMemo } from "react";

export default function WithCases({ withCase }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  const formatWithNewlines = (text) => {
    return text.replace(/\n/g, "<br>");
  };

  // Memoize formatted text to avoid unnecessary recalculations
  const formattedText = useMemo(() => formatWithNewlines(withCase), [withCase]);

  return (
    <div className="with-cases-wrapper">
      <div className="with-cases-inner">
        <p
          className="with-cases-text"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </div>
    </div>
  );
}
