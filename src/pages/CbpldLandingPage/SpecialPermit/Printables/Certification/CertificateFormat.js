import React, { useState, useRef, useEffect } from "react";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
// import "./style.css"; // Import the external CSS file
import moment from "moment";

import HeadersTitle from "./CertificateSections/HeadersTitle";
import SubHeader from "./CertificateSections/SubHeader";
import FirstParagraph from "./CertificateSections/FirstParagraph";
import WithCases from "./CertificateSections/WithCases";
import SecondParagraph from "./CertificateSections/SecondParagraph";
import Purpose from "./CertificateSections/Purpose";
import ThirdParagraph from "./CertificateSections/ThirdParagraph";
import MayorSignatory from "./CertificateSections/MayorSignatory";
import PermitStamp from "./CertificateSections/PermitStamp";
import PermitStampWithExemption from "./CertificateSections/PermitStampWithExemption";
import EventName from "./CertificateSections/EventName";
import Conditions from "./CertificateSections/Conditions";
import DepartmentHeadSingnatory from "./CertificateSections/DepartmentHeadSingnatory";
import { REVISION_CODE } from "assets/data/data";
const CertificateFormat = React.forwardRef((props, ref) => {
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
    ORDate,
    exempted,
    ordinance,
    exemptedCases,
    conditions,
    eventName,
  } = props;
  const [scale, setScale] = useState(1);

  const certificateRef = useRef();

  useEffect(() => {
    const adjustFontScale = () => {
      if (certificateRef.current) {
        // const maxHeight = 1212;
        const maxHeight =
          permitType === "good_moral" || permitType === "mayors_certificate"
            ? 1208
            : 1244;
        const height = certificateRef.current.scrollHeight;

        let newScale = 1;

        if (height > maxHeight) {
          const ratio = maxHeight / height;
          newScale = Math.max(ratio, 0.7);
        } else {
          newScale = 1;
        }

        setScale((prev) => {
          if (Math.abs(prev - newScale) < 0.01) return prev;
          return newScale;
        });
      }
    };
    const observer = new ResizeObserver(adjustFontScale);
    if (certificateRef.current) observer.observe(certificateRef.current);
    return () => observer.disconnect();
  }, [
    firstParagraph,
    secondParagraph,
    thirdParagraph,
    purpose,
    withCase,
    conditions,
    eventName,
  ]);

  let headerTitle = "";
  if (permitType === "mayors_permit") {
    headerTitle = "MAYOR'S CERTIFICATION";
  } else if (permitType === "good_moral") {
    headerTitle = "MAYOR'S CLEARANCE";
  } else if (
    permitType === "event" ||
    permitType === "motorcade" ||
    permitType === "parade" ||
    permitType === "recorrida" ||
    permitType === "use_of_government_property"
  ) {
    headerTitle = "SPECIAL PERMIT";
  }

  let subHeader = "";
  if (permitType === "use_of_government_property") {
    subHeader = "USE OF GOVERNMENT PROPERTY";
  } else if (permitType === "recorrida") {
    subHeader = "RECORRIDA";
  } else if (permitType === "parade") {
    subHeader = "PARADE";
  } else if (permitType === "motorcade") {
    subHeader = "MOTORCADE";
  } else if (permitType === "good_moral") {
    subHeader = "Certificate of Good Moral Character";
  } else subHeader = "";

  return (
    <div
      ref={ref}
      className={` certificate-wrapper ${
        permitType === "good_moral" || permitType === "mayors_permit"
          ? "a4"
          : "folio"
      }`}
    >
      <div
        ref={certificateRef}
        style={{
          width:
            permitType === "good_moral" || permitType === "mayors_permit"
              ? "208mm"
              : "215.9mm",
          height:
            permitType === "good_moral" || permitType === "mayors_permit"
              ? "295mm"
              : "330.2mm",
        }}
      >
        <table className="certificate-table">
          <tbody>
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
                      <p className="header-title">
                        City Business Permits and Licensing Department
                      </p>
                      <p>
                        City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                      </p>
                      <img
                        className="header-line"
                        src={headerLine}
                        alt="CGB Logo"
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "right" }}>
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
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <HeadersTitle headerTitle={headerTitle} scale={scale} />
                <SubHeader
                  permitType={permitType}
                  purpose={purpose}
                  subHeader={subHeader}
                  scale={scale}
                />
                <FirstParagraph firstParagraph={firstParagraph} scale={scale} />
                <EventName
                  permitType={permitType}
                  eventName={eventName}
                  scale={scale}
                />
                {!!withCase && <WithCases withCase={withCase} scale={scale} />}
                {!!secondParagraph && (
                  <SecondParagraph
                    secondParagraph={secondParagraph}
                    scale={scale}
                  />
                )}
                <Conditions
                  conditions={conditions}
                  permitType={permitType}
                  scale={scale}
                />
                {permitType === "good_moral" && (
                  <Purpose purpose={purpose} scale={scale} />
                )}
                <ThirdParagraph thirdParagraph={thirdParagraph} scale={scale} />
                {(permitType === "good_moral" ||
                  permitType === "mayors_permit") && (
                  <MayorSignatory permitType={permitType} />
                )}
                <DepartmentHeadSingnatory scale={scale} />
              </td>
            </tr>

            {/* Footer Section */}
            <tr className="certificate-footer">
              <td colSpan="2">
                <div className="footer-content">
                  {orNo && !exempted ? (
                    <PermitStamp
                      orNo={orNo}
                      ORDate={ORDate}
                      dateIssued={dateIssued}
                      approvedBy={approvedBy}
                      scale={scale}
                    />
                  ) : (
                    <PermitStampWithExemption
                      exemptedCases={exemptedCases}
                      dateIssued={dateIssued}
                      approvedBy={approvedBy}
                      ordinance={ordinance}
                      scale={scale}
                    />
                  )}
                  <div className="footer-right">
                    <img src={butuanOnLogo} alt="Butuan On Logo" />
                  </div>
                </div>
                <div className="footer-note">
                  <p className="footer-tagline">
                    “Fast, Efficient and Friendly Service”
                  </p>
                  {(permitType === "good_moral" ||
                    permitType === "mayors_permit") && (
                    <p className="footer-warning">
                      <span style={{ color: "black" }}>Note:</span> This permit
                      is valid until December 31, 2025 only.
                    </p>
                  )}
                  <p className="footer-code">{REVISION_CODE[permitType]}</p>
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
    </div>
  );
});

CertificateFormat.displayName = "CertificateFormat";
export default CertificateFormat;
