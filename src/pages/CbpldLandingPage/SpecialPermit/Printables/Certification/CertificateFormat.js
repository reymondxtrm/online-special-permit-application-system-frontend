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
  } = props;
  const [scale, setScale] = useState(1);
  const certificateRef = useRef();
  const renderer = useRef(true);
  const previousScale = useRef(1);
  const previousHeight = useRef(0);
  const adjusting = useRef(false);

  // const adjustLayout = useCallback(() => {
  //   if (!certificateRef.current || adjusting.current) return;
  //   adjusting.current = true;
  //   const maxHeight =
  //     permitType === "good_moral" || permitType === "mayors_certificate"
  //       ? 1094
  //       : 1244;
  //   const height = certificateRef.current.scrollHeight;
  //   const ratio = maxHeight / height;
  //   const newScale = Math.min(ratio, 1);
  //   if (Math.abs(newScale - previousScale.current) < 0.02) {
  //     adjusting.current = false;
  //     return;
  //   }
  //   previousScale.current = newScale;
  //   previousHeight.current = height;
  //   setScale(newScale * 0.9);
  //   setTimeout(() => (adjusting.current = false), 200);
  // }, [permitType]);
  // const debouncedAdjustLayout = useCallback(debounce(adjustLayout, 300), [
  //   adjustLayout,
  // ]);
  // useEffect(() => {
  //   if (renderer.current === true) {
  //     renderer.current = false;
  //   } else {
  //     debouncedAdjustLayout();
  //   }
  // }, [
  //   firstParagraph,
  //   secondParagraph,
  //   thirdParagraph,
  //   purpose,
  //   withCase,
  //   conditions,
  //   eventName,
  //   permitType,
  // ]);
  const maxHeight = useMemo(() => {
    return permitType === "good_moral" || permitType === "mayors_permit"
      ? 1090
      : 1240;
  }, [permitType]);

  // useEffect(() => {
  //   const container = certificateRef.current;
  //   if (!container) return;

  //   let frame; // for requestAnimationFrame control
  //   const scaleRef = { current: scale };

  //   const adjustScale = () => {
  //     const currentHeight = container.scrollHeight;

  //     if (currentHeight > maxHeight && scaleRef.current > 0.5) {
  //       scaleRef.current = +(scaleRef.current - 0.01).toFixed(2);
  //       setScale(scaleRef.current);
  //     } else if (currentHeight < maxHeight - 50 && scaleRef.current < 1) {
  //       scaleRef.current = +(scaleRef.current + 0.01).toFixed(2);
  //       setScale(scaleRef.current);
  //     }
  //     console.log(maxHeight, currentHeight);

  //     frame = requestAnimationFrame(adjustScale); // keep looping smoothly
  //   };

  //   const resizeObserver = new ResizeObserver(() => {
  //     cancelAnimationFrame(frame);
  //     frame = requestAnimationFrame(adjustScale);
  //   });

  //   resizeObserver.observe(container);

  //   frame = requestAnimationFrame(adjustScale);

  //   return () => {
  //     resizeObserver.disconnect();
  //     cancelAnimationFrame(frame);
  //   };
  // }, [maxHeight]);
  useEffect(() => {
    const container = certificateRef.current;
    if (!container) return;

    let timeoutId;
    let isRunning = true;
    const scaleRef = { current: scale }; // keep the latest scale in a ref-like object

    const adjustScale = () => {
      if (!isRunning) return;

      const currentHeight = container.scrollHeight;
      const tolerance = 5;
      const lowerBound = maxHeight - 80;
      const upperBound = maxHeight + tolerance;

      let newScale = scaleRef.current;
      console.log(maxHeight, currentHeight);
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
    <div ref={ref} className={` certificate-wrapper `}>
      <div ref={certificateRef}>
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
                    <div className="d-flex gap-5">
                      <div className="header-text">
                        {" "}
                        <p>Republic of the Philippines</p>
                        <p className="header-title">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="header-title">
                          City Business Permits and Licensing Department
                        </p>
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
                    <img
                      className="header-line"
                      src={headerLine}
                      alt="CGB Logo"
                    />
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
                    color: "#4C9F70",
                    marginRight: "1.5cm",
                  }}
                >
                  {referenceNo}
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ paddingTop: `-${scale * 1}` }}>
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
