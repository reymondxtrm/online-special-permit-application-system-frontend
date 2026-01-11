import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import "./style.css";
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
import { debounce } from "lodash";
import QrCodeGenerator from "./CertificateSections/QrCodeGenerator";
import index from "pages/Dashboard-Blog";
import AdditionalParagraphForWithCase from "./CertificateSections/AdditionalParagraphForWithCase";
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
    withCase,
    ORDate,
    exempted,
    ordinance,
    exemptedCases,
    conditions,
    eventName,
    specialPermitApplicationId,
    isCase,
    additionalParagraphForWithCase,
  } = props;
  const [scale, setScale] = useState(1);
  const certificateRef = useRef();

  const year = new Date();
  const paperSize =
    permitType === "good_moral" || permitType === "mayors_permit"
      ? "a4"
      : "legal";
  const maxHeight = useMemo(() => {
    const baseHeight =
      permitType === "good_moral" || permitType === "mayors_permit"
        ? 1090
        : 1319;

    const minus18mmInPx = (18 * 96) / 25.4; // ~68 px
    return baseHeight - minus18mmInPx;
  }, [permitType]);

  useEffect(() => {
    const container = certificateRef.current;
    if (!container) return;

    let timeoutId;
    let isRunning = true;
    const scaleRef = { current: scale };

    const adjustScale = () => {
      if (!isRunning) return;
      const currentHeight = container.scrollHeight;
      const tolerance = 5;
      const lowerBound = maxHeight - 80;
      const upperBound = maxHeight + tolerance;
      let newScale = scaleRef.current;
      if (currentHeight > upperBound && newScale > 0.5) {
        newScale = +Math.max(newScale - 0.01, 0.5).toFixed(2);
        setScale(newScale);
        scaleRef.current = newScale;
        timeoutId = setTimeout(adjustScale, 200);
      } else if (currentHeight < lowerBound && newScale < 1) {
        newScale = +Math.min(newScale + 0.01, 1).toFixed(2);
        setScale(newScale);
        scaleRef.current = newScale;
        timeoutId = setTimeout(adjustScale, 200);
      } else {
        isRunning = false;
        clearTimeout(timeoutId);
      }
    };
    adjustScale();
    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
    };
  }, [
    maxHeight,
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
    if (isCase) {
      headerTitle = "MAYOR'S CERTIFICATION";
    } else headerTitle = "MAYOR'S CLEARANCE";
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
  } else if (permitType === "good_moral" && !isCase) {
    subHeader = "Certificate of Good Moral Character";
  } else subHeader = "";

  return (
    <div
      ref={ref}
      className={` certificate-wrapper ${paperSize}`}
      style={{ "--scale": scale }}
      id="dynamic-print-style"
    >
      <div ref={certificateRef}>
        <table className="certificate-table">
          <tbody>
            <tr className="certificate-header">
              <td colSpan="2">
                <div className="header-content">
                  <div
                    style={{
                      paddingTop: "5px",
                      paddingLeft: "5px",
                      zIndex: "1000",
                    }}
                  >
                    <img src={cgbLogo} alt="CGB Logo" className="header-logo" />
                  </div>

                  <div style={{ paddingTop: "5px" }}>
                    <div className="d-flex gap-5">
                      <div className="header-text" style={{ color: "black" }}>
                        {" "}
                        <p>Republic of the Philippines</p>
                        <p>CITY GOVERNMENT OF BUTUAN</p>
                        <p>CITY BUSINESS PERMITS AND LICENSING DEPARTMENT</p>
                        <p>
                          City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan
                          City
                        </p>
                      </div>
                      <div className="qr-wrapper d-flex align-items-center">
                        <QrCodeGenerator
                          specialPermitId={specialPermitApplicationId}
                        />
                      </div>
                    </div>
                    {/* <img
                      className="header-line"
                      src={headerLine}
                      alt="CGB Logo"
                    /> */}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: `${scale * 14}pt`,
                    fontWeight: "bold",
                    color: "#11a7ee",
                    marginRight: "1.5cm",
                    marginBottom: "0px",
                  }}
                >
                  {referenceNo}
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ paddingTop: `-${scale * 1}` }}>
                <HeadersTitle headerTitle={headerTitle} />
                <SubHeader
                  permitType={permitType}
                  purpose={purpose}
                  subHeader={subHeader}
                />
                {isCase && (
                  <div className="case-additional-text-wrapper">
                    <p className="case-additional-text">
                      TO WHOM IT MAY CONCERN:
                    </p>
                  </div>
                )}
                <AdditionalParagraphForWithCase
                  additionalParagraphForWithCase={
                    additionalParagraphForWithCase
                  }
                />
                <FirstParagraph firstParagraph={firstParagraph} />
                <EventName permitType={permitType} eventName={eventName} />
                {!!withCase && <WithCases withCase={withCase} />}
                {!!secondParagraph && (
                  <SecondParagraph secondParagraph={secondParagraph} />
                )}
                <Conditions conditions={conditions} permitType={permitType} />
                {permitType === "good_moral" && <Purpose purpose={purpose} />}
                <ThirdParagraph thirdParagraph={thirdParagraph} />

                <MayorSignatory permitType={permitType} />

                {/* {(permitType === "good_moral" ||
                  permitType === "mayors_permit") && (
                  <MayorSignatory permitType={permitType} />
                )} */}
                <DepartmentHeadSingnatory />
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
                      {`Note: This permit is valid until December 31, ${year.getFullYear()} only.`}
                    </p>
                  )}
                  <p className="footer-code">{REVISION_CODE[permitType]}</p>
                  {/* <img
                    style={{ width: "100%" }}
                    src={footerLine}
                    alt="CGB Logo"
                  /> */}
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
