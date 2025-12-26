import React from "react";

export default function Purpose({ purpose }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  return (
    <div className="purpose-wrapper">
      <p className="purpose-text">{purpose}</p>
    </div>
  );
}
