import React, { useMemo } from "react";
import "../style.css";
export default function Conditions({ conditions, permitType, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;
  return (
    <>
      {permitType === "good_moral" || permitType === "mayors_permit" ? null : (
        <tr>
          <td colSpan="2">
            <div
              style={{
                marginTop: "3px",
                marginLeft: "2.54cm",
                marginBottom: "0.25cm",
                marginRight: "1.5cm",
                lineHeight: "1.2",
              }}
            >
              <p
                style={{
                  fontFamily: "Cambria, serif",
                  fontSize: "13pt",
                  fontWeight: "bold",
                  color: "#154172",
                  // textIndent: "50px", // Indentation for the first line of text
                  marginBottom: "1em", // Add spacing for readability
                  textAlign: "justify", // Justify the text
                  lineHeight: "1.5", // S
                }}
              >
                Condition:
              </p>

              <ol
                style={{
                  marginTop: "10px",
                  marginBottom: "0.25cm",
                  lineHeight: "1.2",
                }}
              >
                {conditions.map((item, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        fontFamily: "Cambria, serif",
                        fontSize: `${fontSize}pt`,
                        fontWeight: "bold",

                        textAlign: "justify",
                        lineHeight: "1", // Set line height for readability
                        fontStyle: "italic",
                        // whiteSpace: "pre-wrap",
                      }}
                    >{`${item}`}</li>
                  );
                })}
                {/* <p
                  style={{
                    fontFamily: "Cambria, serif",
                    fontSize: "13pt", // Font size for the rest of the text
                    fontWeight: "bold", // Bold for the rest of the text
                    marginBottom: "1em", // Add spacing for readability
                    textAlign: "justify", // Justify the text
                    lineHeight: "1.5", // Set line height for readability
                    fontStyle: "italic",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: conditions,
                  }}
                ></p> */}
              </ol>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
