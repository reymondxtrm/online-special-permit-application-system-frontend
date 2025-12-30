import React from "react";

export default function EventName({ eventName, permitType }) {
  // No need to pass scale prop anymore!
  // Component will inherit --scale from parent .certificate-wrapper

  const allowedTypes = [
    "event",
    "use_of_government_property", // Fixed typo: goverment → government
    "recorrida",
    "parade",
    "motorcade",
  ];

  const shouldDisplay = allowedTypes.includes(permitType);

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div className="event-name-wrapper">
      <p className="event-name-text">{`"${eventName?.toUpperCase()}"`}</p>
    </div>
  );
}
