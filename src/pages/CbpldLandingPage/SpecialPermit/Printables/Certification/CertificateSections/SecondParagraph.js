import React from "react";

export default function SecondParagraph({ secondParagraph }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  return (
    <div className="second-paragraph-wrapper">
      <p
        className="second-paragraph-text"
        dangerouslySetInnerHTML={{ __html: secondParagraph }}
      />
    </div>
  );
}
