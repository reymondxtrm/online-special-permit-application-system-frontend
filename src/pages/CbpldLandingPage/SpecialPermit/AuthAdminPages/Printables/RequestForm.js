import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import tuvLogo from "../../../../../assets/images/TUV.jpg";
import qrCode from "../../../../../assets/images/qr.jpg";
import "./RequestForm.css";
import axios from "axios";
import ReactToPrint from "react-to-print";

// The five permit types the paper form columns stand for, in printed order.
const COLUMNS = [
  { code: "event", label: "EVENT" },
  { code: "motorcade", label: "MOTORCADE" },
  { code: "parade", label: "PARADE" },
  { code: "recorrida", label: "RECORRIDA" },
  { code: "use_of_government_property", label: "USE OF GOVERNMENT PROPERTY" },
];

const REQUEST_LETTER =
  "Request Letter stamped “Received” by the Office of the City Mayor";
const OFFICIAL_RECEIPT =
  "Official Receipt (pursuant to City Ordinance No. 6795-2022)";
const ROUTE_PLAN = "Route Plan approved by the CTTMD";
const VEHICLE_FEE =
  "Official Receipt ₱200.00 per day (less than 10 vehicles) or ₱300.00 per day (more than 10 vehicles) pursuant to City Ordinance No. 6795-2022.";
const RECORRIDA_FEE =
  "Official Receipt ₱200.00 per day pursuant to City Ordinance No. 6795-2022.";

// One row per line of the paper form; `null` is a cell the form leaves blank.
// Most of these repeat across columns, so they are listed once here rather than
// hand-copied into 13 near-identical JSX blocks that can drift apart.
const REQUIREMENT_ROWS = [
  [
    REQUEST_LETTER,
    REQUEST_LETTER,
    REQUEST_LETTER,
    REQUEST_LETTER,
    REQUEST_LETTER,
  ],
  [OFFICIAL_RECEIPT, ROUTE_PLAN, ROUTE_PLAN, ROUTE_PLAN, OFFICIAL_RECEIPT],
  [null, VEHICLE_FEE, VEHICLE_FEE, RECORRIDA_FEE, null],
];

export default function RequestForm({ isOpen, toggle, applicationId }) {
  const [application, setApplication] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/admin/get-request-form-data`, {
          params: { id: applicationId },
          withCredentials: true,
        });

        if (mounted && response) {
          setApplication(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (applicationId) fetchData();

    return () => {
      mounted = false;
    };
  }, [applicationId]);

  const handleDefaultFileName = async () => {
    const originalTitle = document.title;
    document.title = `${
      application?.special_permit_type?.code || "request"
    } Request Form`;
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  };

  const formater = (date) =>
    date ? new Date(date).toLocaleDateString("en-US") : "";

  const type = application?.special_permit_type?.code;
  const user = application?.user;
  const address = user?.user_addresses?.[0];

  // Every part is optional on the backend, so filter before joining -- an
  // applicant with no subdivision or province must not print "undefined".
  const addressText = [
    address?.address_line,
    address?.barangay,
    address?.city,
    address?.province,
  ]
    .filter(Boolean)
    .join(" ");
  const eventDates = [application?.event_date_from, application?.event_date_to]
    .filter(Boolean)
    .join(" to ");
  const eventTimes = [application?.event_time_from, application?.event_time_to]
    .filter(Boolean)
    .join(" to ");
  const printedName = [user?.fname, user?.mname, user?.lname]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  const requirement = (text) =>
    text ? (
      <div className="rf18-req">
        <span className="rf18-checkbox"></span>
        <p className="rf18-req-text">{text}</p>
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      className="special-permit-request-form-modal"
    >
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div className="rf18-sheet" ref={printRef}>
          {/* ===== HEADER ===== */}
          <div className="rf18-header">
            <div className="rf18-header-content">
              <img src={cgbLogo} alt="CGB Logo" className="rf18-logo" />
              <div className="rf18-header-text">
                <p className="rf18-header-republic">
                  Republic of the Philippines
                </p>
                <p className="rf18-header-department">
                  CITY GOVERNMENT OF BUTUAN
                </p>
                <p className="rf18-header-department">
                  City Business Permits and Licensing Department
                </p>
                <p className="rf18-header-city">Butuan City</p>
              </div>
              <p className="rf18-revised">Revised on March 19, 2026</p>
            </div>
          </div>
          <img className="rf18-rule" src={headerLine} alt="" />

          <p className="rf18-title">REQUEST FORM FOR SPECIAL PERMIT</p>

          {/* ===== REQUIREMENTS TABLE ===== */}
          <table className="rf18-main-table">
            <colgroup>
              {COLUMNS.map((column) => (
                <col key={column.code} style={{ width: "20%" }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.code}
                    style={{
                      color: type === column.code ? "white" : "black",
                      backgroundColor:
                        type === column.code ? "#0c7dcc" : "white",
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REQUIREMENT_ROWS.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((text, cellIndex) => (
                    <td key={COLUMNS[cellIndex].code}>{requirement(text)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===== FILL-OUT SECTION ===== */}
          <table className="rf18-form-table">
            <colgroup>
              <col style={{ width: "60%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <span className="rf18-label">Date:</span>{" "}
                  <span className="rf18-value">
                    {formater(application?.created_at)}
                  </span>
                </td>
                <td>
                  <span className="rf18-label">Contact No.:</span>{" "}
                  <span className="rf18-value">
                    {user?.user_phone_numbers?.[0]?.phone_number}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className="rf18-label">
                    Name of Requestor/Organization:
                  </span>{" "}
                  <span className="rf18-value">
                    {application?.requestor_name}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table className="rf18-value-grid">
                    <colgroup>
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="rf18-label">Name of Representative:</td>
                        <td>{user?.lname}</td>
                        <td>{user?.fname}</td>
                        <td>{user?.mname}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr className="rf18-caption-row">
                <td colSpan={2}>
                  <table className="rf18-caption-grid">
                    <colgroup>
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>Surname</td>
                        <td>First Name</td>
                        <td>Middle Name</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className="rf18-label">Address:</span>{" "}
                  <span className="rf18-value">{addressText}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className="rf18-label">Name of Event:</span>{" "}
                  <span className="rf18-value">{application?.event_name}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="rf18-label">Date of Event:</span>{" "}
                  <span className="rf18-value">{eventDates}</span>
                </td>
                <td>
                  <span className="rf18-label">Time of Event:</span>{" "}
                  <span className="rf18-value">{eventTimes}</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ===== DECLARATION ===== */}
          <p className="rf18-declaration-heading">
            DECLARATION AS TO THE CORRECTNESS OF THE INFORMATION GIVEN
          </p>
          <p className="rf18-declaration">
            I hereby voluntarily declare that all the information provided in
            this request form for the special permit is true, accurate, and
            complete to the best of my knowledge and belief. I fully understand
            that any false, misleading, or incomplete information may result in
            the disapproval of my application.
          </p>

          <div className="rf18-signature">
            <div className="rf18-signature-inner">
              <span className="rf18-signature-name">{printedName}</span>
              <div className="rf18-signature-line">
                <p className="rf18-signature-caption">
                  Signature over Printed Name
                </p>
              </div>
            </div>
          </div>

          <p className="rf18-apply">
            APPLY SPECIAL PERMIT ONLINE @{" "}
            <span className="rf18-apply-link">ospas.butuan.gov.ph</span>
          </p>

          <p className="rf18-system-note">
            Note: This is system generated. No signature is required.
          </p>

          {/* ===== BOTTOM FOOTER ===== */}
          <img className="rf18-rule rf18-footer-rule" src={footerLine} alt="" />
          <table className="rf18-bottom">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "27%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="rf18-bottom-left">
                    <img src={qrCode} alt="QR Code" className="rf18-qr" />
                    <div className="rf18-contact">
                      <span>
                        City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                      </span>
                      <span>
                        Email:{" "}
                        <span className="rf18-link">cbpld@butuan.gov.ph</span>
                      </span>
                      <span>Phone: 0938-312-0415</span>
                      <span className="rf18-link">www.butuan.gov.ph</span>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <img src={tuvLogo} alt="TUV NORD" className="rf18-tuv" />
                  <p className="rf18-cert-no">
                    Certificate Registration No. PHP
                    <br />
                    QMS 23 93 0116
                  </p>
                </td>
                <td className="text-end">
                  <img
                    src={butuanOnLogo}
                    alt="Butuan ON"
                    className="rf18-butuanon"
                  />
                  <p className="rf18-form-code">CBPLD.BPLD.F.018.REV06</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-2">
          <ReactToPrint
            trigger={() => <Button color="primary">Print</Button>}
            content={() => printRef.current}
            onBeforePrint={handleDefaultFileName}
          />
          <Button onClick={toggle}>Close</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
