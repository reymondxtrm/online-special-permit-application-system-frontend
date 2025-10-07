import React from "react";

export default function MayorSignatory({ permitType }) {

  
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
            fontSize: "13pt",
            fontWeight: "bold",
            // color: "#005a99",
            paddingTop: "min(40px, 2vh)", // Shrinks when space is tight
            // paddingTop: "40px",
            margin: 0,
            fontFamily: "Cambria, serif",
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
            fontSize: "13pt",
            // color: "#005a99",
            padding: 0,
            margin: 0,
            fontFamily: "Cambria, serif",
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
            fontSize: "13pt",
            fontStyle: "italic",
            paddingTop: "30px", // Shrinks when space is tight
            margin: 0,
            fontFamily: "Cambria, serif",
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
