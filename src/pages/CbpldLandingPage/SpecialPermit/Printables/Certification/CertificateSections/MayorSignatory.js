import React from "react";

export default function MayorSignatory({ scale }) {
  const baseFontSize = 14; // pt
  const fontSize = baseFontSize * scale;
  const topPadding = 40 * scale;
  const bottomPadding = 30 * scale;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}pt`,
            // fontWeight: "bold",
            paddingTop: `${topPadding}px`,
            margin: 0,
            fontWeight: "600",
            fontFamily: "Golos Text, sans-serif",
          }}
        >
          {"ATTY. LAWRENCE LEMUEL H. FORTUN"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}pt`,
            padding: 0,
            margin: 0,
            fontFamily: "Golos Text, sans-serif",
            fontWeight: "600",
          }}
        >
          {"City Mayor"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}pt`,
            fontStyle: "italic",
            paddingTop: `${bottomPadding}px`,
            margin: 0,
            fontFamily: "Golos Text, sans-serif",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {"For and by authority of the City Mayor:"}
        </p>
      </div>
    </>
  );
}
