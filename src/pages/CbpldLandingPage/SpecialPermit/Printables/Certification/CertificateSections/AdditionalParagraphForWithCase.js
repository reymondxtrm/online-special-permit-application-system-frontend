import React from "react";

export default function AdditionalParagraphForWithCase({
  additionalParagraphForWithCase,
}) {
  return (
    <div className="additional-paragraph-wrapper">
      <p
        className="additional-paragraph-text"
        dangerouslySetInnerHTML={{ __html: additionalParagraphForWithCase }}
      />
    </div>
  );
}
