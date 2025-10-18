import React from "react";
import "../style.css";

export default function Conditions({ conditions, permitType, scale }) {
  const baseFontSize = 13; // pt
  const fontSize = baseFontSize * scale;

  const marginTop = 3 * scale;
  const marginLeftRight = 1.5 * scale; // cm
  const marginBottom = 0.25 * scale; // cm
  const olMarginTop = 10 * scale;
  const olMarginBottom = 0.25 * scale; // cm

  return (
    <>
      {permitType === "good_moral" || permitType === "mayors_permit" ? null : (
        <tr>
          <td colSpan="2">
            <div
              style={{
                marginTop: `${marginTop}px`,
                marginLeft: `${marginLeftRight}cm`,
                marginBottom: `${marginBottom}cm`,
                marginRight: `${marginLeftRight}cm`,
                lineHeight: "1.2",
              }}
            >
              <p
                style={{
                  fontFamily: "Cambria, serif",
                  fontSize: `${fontSize}pt`,
                  fontWeight: "bold",
                  color: "#154172",
                  marginBottom: "1em",
                  textAlign: "justify",
                  lineHeight: "1.5",
                }}
              >
                Condition:
              </p>

              <ol
                style={{
                  marginTop: `${olMarginTop}px`,
                  marginBottom: `${olMarginBottom}cm`,
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
                        lineHeight: "1",
                        fontStyle: "italic",
                      }}
                    >{`${item}`}</li>
                  );
                })}
              </ol>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
