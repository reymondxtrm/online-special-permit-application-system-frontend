import React from "react";

export default function HeadersTitle({ headerTitle, isCase }) {
  return (
    <div className="headers-title-wrapper">
      <p className="headers-title-text">{headerTitle}</p>
    </div>
  );
}
