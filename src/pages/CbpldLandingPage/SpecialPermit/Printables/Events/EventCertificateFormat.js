import React from "react";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import "./style.css"; // Import the external CSS file
import moment from "moment";
const EventCertificateFormat = React.forwardRef((props, ref) => {
  const {
    permitType,
    firstParagraph,
    secondParagraph,
    thirdParagraph,
    purpose,
    referenceNo,
    orNo,
    dateIssued,
    approvedBy,
    paidAmounmt,
    withCase,
  } = props;
  console.log(orNo);

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };
  return (
    <div className="certificate-wrapper" ref={ref}>
      <table className="certificate-table">
        <tbody>
          {/* Header Section */}
          <tr className="certificate-header">
            <td colSpan="2">
              <div className="header-content">
                <div
                  style={{
                    paddingTop: "15px",
                    paddingLeft: "20px",
                    zIndex: "1000",
                  }}
                >
                  <img src={cgbLogo} alt="CGB Logo" className="header-logo" />
                </div>
                <div>
                  <div className="header-text">
                    <p>Republic of the Philippines</p>
                    <p className="header-title">CITY GOVERNMENT OF BUTUAN</p>
                    <p>City Business Permits and Licensing Department</p>
                    <p>
                      City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                    </p>
                    <img
                      style={{ width: "100%", marginLeft: "-20px" }}
                      src={headerLine}
                      alt="CGB Logo"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>

          {/* Content Section */}
          <tr>
            <div
              // className="certificate-content"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <p
                style={{
                  fontSize: "14pt",
                  fontWeight: "bold",
                  color: "#4C9F70",
                  marginRight: "1.5cm",
                }}
              >
                {referenceNo}
              </p>
            </div>

            {permitType === "good_moral" && (
              <>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "20pt",
                        fontWeight: "bold",
                        color: "#005a99",
                        padding: 0,
                        margin: 0,
                        fontFamily: "Bookman Old Style, serif",
                      }}
                    >
                      {"MAYOR'S CERTIFICATION"}
                    </p>
                  </div>
                  {!withCase && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "18pt",
                          color: "#005a99",
                          fontFamily: "Bookman Old Style, serif",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {"(Certificate of Good Moral Character)"}
                      </p>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11pt",
                        color: "#4C9F70",
                        fontFamily: "Book Antiqua",
                        padding: 0,
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      {"Series of 2025"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Render the full text with dynamic font styling */}
            <tr>
              <td colSpan="2">
                <div
                  style={{
                    marginTop: "10px", // Top margin
                    marginLeft: "2.54cm", // Left margin
                    marginBottom: "0.25cm", // Bottom margin
                    marginRight: "1.5cm",
                    lineHeight: "1.2",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Cambria, serif",
                      fontSize: "13pt", // Font size for the rest of the text
                      fontWeight: "bold", // Bold for the rest of the text
                      textIndent: "50px", // Indentation for the first line of text
                      marginBottom: "1em", // Add spacing for readability
                      textAlign: "justify", // Justify the text
                      lineHeight: "1.5", // Set line height for readability
                    }}
                    dangerouslySetInnerHTML={{ __html: firstParagraph }} // Render the text
                  ></p>
                </div>
              </td>
            </tr>

            {withCase && (
              <tr>
                <td colSpan="2">
                  <div
                    style={{
                      marginTop: "10px", // Top margin
                      marginLeft: "2.54cm", // Left margin
                      marginBottom: "0.25cm", // Bottom margin
                      marginRight: "1.5cm",
                      lineHeight: "1.2",
                    }}
                  >
                    <div style={{ marginLeft: "50px" }}>
                      <p
                        style={{
                          fontFamily: "Cambria, serif",
                          fontSize: "11pt", // Font size for the rest of the text
                          fontWeight: "bold", // Bold for the rest of the text
                          // textIndent: "50px", // Indentation for the first line of text
                          marginBottom: "1em", // Add spacing for readability
                          textAlign: "justify", // Justify the text
                          lineHeight: "1.5", // Set line height for readability
                        }}
                        dangerouslySetInnerHTML={{ __html: withCase }} // Render the text
                      ></p>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan="2">
                <div
                  style={{
                    marginTop: "10px", // Top margin
                    marginLeft: "2.54cm", // Left margin
                    marginBottom: "0.25cm", // Bottom margin
                    marginRight: "1.5cm",
                    lineHeight: "1.2",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Cambria, serif",
                      fontSize: "13pt", // Font size for the rest of the text
                      fontWeight: "bold", // Bold for the rest of the text
                      textIndent: "50px", // Indentation for the first line of text
                      marginBottom: "1em", // Add spacing for readability
                      textAlign: "justify", // Justify the text
                      lineHeight: "1.5", // Set line height for readability
                    }}
                    dangerouslySetInnerHTML={{ __html: secondParagraph }} // Render the text
                  ></p>
                </div>
              </td>
            </tr>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "18pt",
                  fontWeight: "bold",
                  // color: "#005a99",
                  textDecoration: "underline",
                  padding: 0,
                  margin: 0,
                  fontFamily: "Bookman Old Style, serif",
                }}
              >
                {purpose}
              </p>
            </div>

            <div
              style={{
                marginTop: "10px", // Top margin
                marginLeft: "2.54cm", // Left margin
                marginBottom: "0.25cm", // Bottom margin
                marginRight: "1.5cm",
                lineHeight: "1.2",
              }}
            >
              <p
                style={{
                  fontFamily: "Cambria, serif",
                  fontSize: "13pt", // Font size for the rest of the text
                  fontWeight: "bold", // Bold for the rest of the text
                  textIndent: "50px", // Indentation for the first line of text
                  marginBottom: "1em", // Add spacing for readability
                  textAlign: "justify", // Justify the text
                  lineHeight: "1.5", // Set line height for readability
                }}
                dangerouslySetInnerHTML={{ __html: thirdParagraph }} // Render the text
              ></p>
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
                  fontWeight: "bold",
                  // color: "#005a99",
                  paddingTop: "40px",
                  margin: 0,
                  fontFamily: "Cambria, serif",
                }}
              >
                {"ENGR. RONNIE VICENTE C. LAGNADA"}
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
              }}
            >
              <p
                style={{
                  fontSize: "13pt",
                  // color: "#005a99",
                  fontStyle: "italic",
                  paddingTop: "50px",
                  margin: 0,
                  fontFamily: "Cambria, serif",
                }}
              >
                {"For and by authority of the City Mayor:"}
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
                  fontWeight: "bold",
                  // color: "#005a99",
                  paddingTop: "80px",
                  margin: 0,
                  fontFamily: "Cambria, serif",
                }}
              >
                {"ATTY. MOSHI ARIEL S. CAHOY"}
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
                {"City Business Permits and Licensing Officer"}
              </p>
            </div>
          </tr>

          {/* Footer Section */}
          <tr className="certificate-footer">
            <td colSpan="2">
              <div className="footer-content">
                {orNo ? (
                  <div className="footer-left" style={{ padding: "20px" }}>
                    <p>
                      O.R. No.: <strong>{orNo}</strong>
                    </p>
                    <p>
                      Date issued: <strong>{formatDate(dateIssued)}</strong>
                    </p>
                    <p>
                      Amount Paid: <strong>Php {paidAmounmt}</strong>
                    </p>
                    <p className="footer-small">
                      {moment(dateIssued).format("MM/DD/YYYY hh:mm A")} by:{" "}
                      {approvedBy}
                    </p>
                  </div>
                ) : (
                  <div
                    className="footer-left"
                    style={{ padding: "20px" }}
                  ></div>
                )}
                <div className="footer-right">
                  <img src={butuanOnLogo} alt="Butuan On Logo" />
                </div>
              </div>
              <div className="footer-note">
                <p className="footer-tagline">
                  “Fast, Efficient and Friendly Service”
                </p>
                <p className="footer-warning">
                  Note: This permit is valid until December 31, 2025 only.
                </p>
                <p className="footer-code">CBPLD.BPLD.C.002.REV02</p>
                <img
                  style={{ width: "100%" }}
                  src={footerLine}
                  alt="CGB Logo"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

EventCertificateFormat.displayName = "EventCertificateFormat";
export default EventCertificateFormat;
