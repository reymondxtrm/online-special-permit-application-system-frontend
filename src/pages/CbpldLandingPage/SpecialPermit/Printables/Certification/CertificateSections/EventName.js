import React from "react";

export default function EventName({ eventName, permitType, scale }) {
  const baseFontSize = 17; // pt
  const fontSize = baseFontSize * scale;
  const allowed = [
    "event",
    "use_of_goverment_property",
    "recorrida",
    "parade",
    "motorcade",
  ];
  const go = allowed.some((item) => item === permitType);
  return (
    <>
      {go ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Cambria, serif",
              fontSize: `${fontSize}pt`, // Font size for the rest of the text
              fontWeight: "bold", // Bold for the rest of the text
              marginBottom: "1em", // Add spacing for readability
              textAlign: "center", // Justify the text
              lineHeight: "1.5", // Set line height for readability
            }}
          >{`"${eventName}"`}</p>
        </div>
      ) : null}
    </>
  );
}
