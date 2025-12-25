import React from "react";

export default function HeadersTitle({ headerTitle }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  return (
    <div className="headers-title-wrapper">
      <p className="headers-title-text">{headerTitle}</p>
    </div>
  );
}
