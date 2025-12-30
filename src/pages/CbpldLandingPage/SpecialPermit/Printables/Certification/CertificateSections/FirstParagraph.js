import React from "react";

export default function FirstParagraph({ firstParagraph }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  return (
    <td colSpan="2">
      <div className="first-paragraph-wrapper">
        <p
          className="first-paragraph-text"
          dangerouslySetInnerHTML={{ __html: firstParagraph }}
        />
      </div>
    </td>
  );
}
