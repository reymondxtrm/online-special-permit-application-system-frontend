import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./MayorsAndGoodMoralRequestForm.css";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import tuvLogo from "../../../../../assets/images/TUV.jpg";
import qrCode from "../../../../../assets/images/qr.jpg";
import axios from "axios";
import ReactToPrint from "react-to-print";

export default function MayorsAndGoodMoralRequestForm({
  isOpen,
  toggle,
  applicationId,
}) {
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
    // set a readable default filename for the print dialog
    document.title = `${
      application?.special_permit_type?.code || "request"
    } Request Form`;
    setTimeout(() => {
      document.title = originalTitle; // Restore the original title after the print dialog opens
    }, 5000); // Slight delay to ensure the print dialog uses the updated title
  };
  const column1 = application?.special_permit_type?.code === "good_moral";
  const formater = (date) => {
    const newDate = new Date(date);
    const formatedDate = newDate.toLocaleDateString("en-US");
    return formatedDate;
  };
  const upper = (value) => (value ? value.toUpperCase() : "");
  const address = application?.user?.user_addresses?.[0];

  // Both clearance columns list the same requirements on the paper form, so
  // they are rendered from one definition instead of two copies that can drift.
  const requirement = (label, note) => (
    <div className="rf17-req">
      <span className="rf17-circle"></span>
      <p className="rf17-req-label">
        {label} <span className="rf17-req-note">{note}</span>
      </p>
    </div>
  );
  const officialReceipt = (
    <div className="rf17-req">
      <span className="rf17-circle"></span>
      <div>
        <p className="rf17-req-label">
          Official Receipt (OR){" "}
          <span className="rf17-req-note">as payment for:</span>
        </p>
        <ul className="rf17-or-list">
          <li>
            Mayor&apos;s Certificate <span>(₱100.00)</span>
          </li>
          <li>
            Fiscal Clearance <span>(₱20.00)</span>
          </li>
          <li>
            Court Clearance <span>(₱20.00)</span>
          </li>
        </ul>
      </div>
    </div>
  );
  const courtClearances = (
    <div className="rf17-req-stack">
      {requirement("Fiscal Clearance", "(Regional Trial Court)")}
      {requirement("Court Clearance", "(Municipal Trial Court)")}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      className="mayors-request-form-modal"
    >
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div className="rf17-sheet" ref={printRef}>
          {/* ===== HEADER ===== */}
          <div className="rf17-header">
            <div className="rf17-header-row">
              <img src={cgbLogo} alt="CGB Logo" className="rf17-logo" />
              <div className="rf17-header-text">
                <p className="rf17-header-republic">
                  Republic of the Philippines
                </p>
                <p className="rf17-header-title">CITY GOVERNMENT OF BUTUAN</p>
                <p className="rf17-header-title">
                  City Business Permits and Licensing Department
                </p>
                <p className="rf17-header-city">Butuan City</p>
              </div>
              <p className="rf17-revised">Revised on March 19, 2026</p>
            </div>
          </div>
          <img className="rf17-rule" src={headerLine} alt="" />

          <div className="rf17-title-section">
            <h1 className="rf17-title">REQUEST FORM</h1>
            <h1 className="rf17-title">
              (
              <span className="rf17-title-italic">
                Good Moral Character/Mayor&apos;s Certification
              </span>
              )
            </h1>
          </div>

          {/* ===== REQUIREMENTS TABLE ===== */}
          <table className="rf17-main-table">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div className="rf17-clearance-head">
                    <div
                      className="rf17-checkbox"
                      style={{ backgroundColor: column1 ? "black" : "" }}
                    ></div>
                    <div className="rf17-clearance-head-text">
                      <p>MAYOR&apos;S CLEARANCE</p>
                      <p className="rf17-clearance-head-sub">
                        (Certificate of Good Moral Character)
                      </p>
                    </div>
                  </div>
                </th>
                <th className="rf17-secure-head">Where to secure:</th>
                <th>
                  <div className="rf17-clearance-head">
                    <div
                      className="rf17-checkbox"
                      style={{ backgroundColor: !column1 ? "black" : "" }}
                    ></div>
                    <div className="rf17-clearance-head-text">
                      <p>MAYOR&apos;S CERTIFICATION</p>
                    </div>
                  </div>
                </th>
                <th className="rf17-secure-head">Where to secure:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{requirement("Police Clearance", "")}</td>
                <td className="rf17-secure">
                  Philippine National Police (PNP)
                </td>
                <td>{requirement("Police Clearance", "")}</td>
                <td className="rf17-secure">
                  Philippine National Police (PNP)
                </td>
              </tr>
              <tr>
                <td>{requirement("Community Tax Certificate", "(Cedula)")}</td>
                <td className="rf17-secure">City Treasury Department</td>
                <td>{requirement("Community Tax Certificate", "(Cedula)")}</td>
                <td className="rf17-secure">City Treasury Department</td>
              </tr>
              <tr>
                <td>
                  {requirement("Barangay Clearance", "(as proof of residency)")}
                </td>
                <td className="rf17-secure">
                  Barangay Hall (to be issued by the Punong Barangay in Butuan
                  City)
                </td>
                <td>
                  {requirement("Barangay Clearance", "(as proof of residency)")}
                </td>
                <td className="rf17-secure">
                  Barangay Hall (to be issued by the Punong Barangay in Butuan
                  City)
                </td>
              </tr>
              <tr>
                <td>{officialReceipt}</td>
                <td className="rf17-secure rf17-secure-middle">
                  City Treasury Department
                </td>
                <td>{officialReceipt}</td>
                <td className="rf17-secure rf17-secure-middle">
                  City Treasury Department
                </td>
              </tr>
              <tr>
                <td>{courtClearances}</td>
                <td className="rf17-secure rf17-secure-middle">
                  Hall of Justice
                </td>
                <td>{courtClearances}</td>
                <td className="rf17-secure rf17-secure-middle">
                  Hall of Justice
                </td>
              </tr>
              <tr>
                <td colSpan={2} rowSpan={2} className="rf17-reminders">
                  <p className="rf17-reminders-title">Reminders:</p>
                  <ul>
                    <li>
                      Magkuha una og <b>Fiscal Clearance</b> ug{" "}
                      <b>Court Clearance</b>.
                    </li>
                    <li>
                      Ang mga rekisitos sa <b>Fiscal Clearance</b> mao ang{" "}
                      <b>Police Clearance</b> ug <b>Barangay Clearance</b>.
                    </li>
                    <li>
                      Ang mga rekisitos sa <b>Court Clearance</b> mao ang{" "}
                      <b>Fiscal Clearance</b>, <b>Police Clearance</b> ug{" "}
                      <b>Barangay Clearance</b>.
                    </li>
                    <li>
                      Dapat <b>BUTUAN CITY</b> ang address nga ibutang sa mga
                      dokumento. Human ma kompleto ang mga rekisitos, mamahimong
                      mag apply online @{" "}
                      <span className="rf17-underline">ospas.butuan.gov.ph</span>
                    </li>
                  </ul>
                </td>
                <td colSpan={2}>{requirement("Certificate of Ordination", "")}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  {requirement(
                    "Securities and Exchange Commission (SEC) Registration of the church",
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ===== FILL-OUT SECTION ===== */}
          <p className="rf17-fillout-note">
            (Please fill-out the following information)
          </p>
          <table className="rf17-footer-table">
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <span className="rf17-field-label">Date:</span>{" "}
                  <span className="rf17-field-value">
                    {formater(application?.created_at)}
                  </span>
                </td>
                <td>
                  <span className="rf17-field-label">Contact No.:</span>{" "}
                  <span className="rf17-field-value">
                    {application?.user?.user_phone_numbers?.[0]?.phone_number}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table className="rf17-field-grid">
                    <colgroup>
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "21%" }} />
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "21%" }} />
                      <col style={{ width: "26%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="rf17-field-label">Name:</td>
                        <td className="rf17-grid-value">
                          {upper(application?.user?.lname)}
                        </td>
                        <td className="rf17-grid-value">
                          {upper(application?.user?.fname)}
                        </td>
                        <td className="rf17-grid-value">
                          {upper(application?.user?.mname)}
                        </td>
                        <td className="rf17-grid-value">
                          {upper(application?.user?.suffix)}
                        </td>
                      </tr>
                      <tr className="rf17-sub-labels">
                        <td></td>
                        <td>Surname</td>
                        <td>First Name</td>
                        <td>Middle Initial</td>
                        <td>Extension</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table className="rf17-field-grid">
                    <colgroup>
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "17%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="rf17-field-label">Address:</td>
                        <td className="rf17-field-value">
                          {address?.address_line}
                        </td>
                        <td className="rf17-field-value">
                          {address?.subdivision}
                        </td>
                        <td className="rf17-field-value">{address?.barangay}</td>
                        <td className="rf17-grid-preprinted">Butuan City</td>
                        <td className="rf17-grid-preprinted">8600</td>
                      </tr>
                      <tr className="rf17-sub-labels">
                        <td></td>
                        <td>House No./Street/Purok</td>
                        <td>Subdivision</td>
                        <td>Barangay</td>
                        <td>City</td>
                        <td>Zip code</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className="rf17-field-label">
                    Name of Employer/Establishment
                  </span>{" "}
                  <span className="rf17-field-note">
                    (for Certificate of Good Moral Character)
                  </span>
                  <span className="rf17-field-label">:</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="rf17-purpose-cell">
                  <span className="rf17-field-label">Purpose:</span>{" "}
                  <span className="rf17-field-value">
                    {application?.application_purpose?.name}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="rf17-system-note">
            &quot; Note. This is system generated. No signature is required.
            &quot;
          </p>

          {/* ===== BOTTOM FOOTER ===== */}
          <img className="rf17-rule" src={footerLine} alt="" />
          <table className="rf17-bottom">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "27%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="rf17-bottom-left">
                    <img src={qrCode} alt="QR Code" className="rf17-qr" />
                    <div className="rf17-contact">
                      <span>
                        City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                      </span>
                      <span>
                        Email:{" "}
                        <span className="rf17-link">cbpld@butuan.gov.ph</span>
                      </span>
                      <span>Phone: 0951-388-4193</span>
                      <span className="rf17-link">www.butuan.gov.ph</span>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <img src={tuvLogo} alt="TUV NORD" className="rf17-tuv" />
                  <p className="rf17-cert-no">
                    Certificate Registration No. PHP
                    <br />
                    QMS 23 93 0116
                  </p>
                </td>
                <td className="text-end">
                  <img
                    src={butuanOnLogo}
                    alt="Butuan ON"
                    className="rf17-butuanon"
                  />
                  <p className="rf17-form-code">CBPLD.BPLD.F.017.REV07</p>
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
