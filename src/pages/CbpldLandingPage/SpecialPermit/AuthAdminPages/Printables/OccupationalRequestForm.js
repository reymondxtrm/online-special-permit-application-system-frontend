import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import tuvLogo from "../../../../../assets/images/TUV.jpg";
import qrCode from "../../../../../assets/images/qr.jpg";
import "./OccupationalRequestForm.css";
import axios from "axios";
import ReactToPrint from "react-to-print";

export default function OccupationalRequestForm({
  isOpen,
  toggleModal,
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

  const handleDefaultFileName = () => {
    const originalTitle = document.title;
    document.title = `${
      application?.special_permit_type?.code || "request"
    } Request Form`;
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  };

  const isCompany = application?.user?.account_type === "company";

  // A company application describes one of its members, an individual one
  // describes the account holder. Same fields either way, different relations.
  const person = isCompany
    ? application?.corporation_member
    : application?.user;
  const details = isCompany
    ? application?.corporation_member?.user_details_morph
    : application?.user?.user_details;
  const addressRecord = isCompany
    ? application?.corporation_member?.user_addresses_morph?.[0]
    : application?.user?.user_addresses?.[0];
  const phoneRecord = isCompany
    ? application?.corporation_member?.user_phone_numbers_morph?.[0]
    : application?.user?.user_phone_numbers?.[0];
  const occupation = isCompany
    ? application?.corporation_member?.user_occupation_details_morph
    : application?.user?.user_occupation_details;

  const gender = application?.corporation_member?.sex ?? application?.user?.sex;
  const civilStatus =
    application?.corporation_member?.user_details_morph?.civil_status?.code ??
    application?.user?.user_details?.civil_status?.code;

  const printedName = person
    ? `${person.fname || ""} ${person.mname || ""} ${person.lname || ""}`
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase()
    : "";

  const choice = (label, checked) => (
    <div className="rf19-choice">
      <span
        className="rf19-checkbox"
        style={{ backgroundColor: checked ? "#000" : "" }}
      ></span>
      <span>{label}</span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleModal}
      size="xl"
      className="occupational-request-form-modal"
    >
      <ModalHeader toggle={toggleModal}></ModalHeader>
      <ModalBody>
        <div className="rf19-sheet" ref={printRef}>
          {/* ===== HEADER ===== */}
          <div className="rf19-header">
            <div className="rf19-header-row">
              <img src={cgbLogo} alt="CGB Logo" className="rf19-logo" />
              <div className="rf19-header-text">
                <p className="rf19-header-republic">
                  Republic of the Philippines
                </p>
                <p className="rf19-header-title">CITY GOVERNMENT OF BUTUAN</p>
                <p className="rf19-header-title">
                  City Business Permits and Licensing Department
                </p>
                <p className="rf19-header-city">Butuan City</p>
              </div>
              <p className="rf19-revised">Revised on March 19, 2026</p>
            </div>
          </div>
          <img className="rf19-rule" src={headerLine} alt="" />

          <p className="rf19-title">REQUEST FORM FOR OCCUPATIONAL PERMIT</p>

          {/* ===== APPLICANT DETAILS ===== */}
          <table className="rf19-form-table">
            <colgroup>
              <col style={{ width: "47%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <span className="rf19-label">Date:</span>{" "}
                  <span className="rf19-value">
                    {application?.application_date}
                  </span>
                </td>
                <td colSpan={2}>
                  <span className="rf19-label">Control No.:</span>
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                  <table className="rf19-value-grid">
                    <colgroup>
                      <col style={{ width: "8%" }} />
                      <col style={{ width: "29%" }} />
                      <col style={{ width: "27%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "18%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="rf19-label">Name:</td>
                        <td>{person?.lname}</td>
                        <td>{person?.fname}</td>
                        <td>{person?.mname}</td>
                        <td>{person?.suffix}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr className="rf19-caption-row">
                <td colSpan={4}>
                  <table className="rf19-caption-grid">
                    <colgroup>
                      <col style={{ width: "37%" }} />
                      <col style={{ width: "27%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "18%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>Surname</td>
                        <td>First Name</td>
                        <td>Middle Initial</td>
                        <td>Suffix</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="rf19-label">Date of Birth:</span>{" "}
                  <span className="rf19-hint">(Month-Day-Year)</span>
                  <p className="rf19-value text-center">{details?.birthdate}</p>
                </td>
                <td colSpan={3}>
                  <div className="rf19-choice-group">
                    <span className="rf19-label">Gender :</span>
                    <div className="rf19-choice-col">
                      {choice("Male", gender === "MALE")}
                      {choice("Female", gender === "FEMALE")}
                    </div>
                    <div className="rf19-choice-col">
                      {choice("Prefer not to say", gender === "PREFER NOT TO SAY")}
                      {choice("Other __________", gender === "OTHERS")}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                  <p className="rf19-label">Address:</p>
                  <table className="rf19-value-grid">
                    <colgroup>
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "21%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "17%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>{addressRecord?.address_line}</td>
                        <td>{addressRecord?.subdivision}</td>
                        <td>{addressRecord?.barangay}</td>
                        <td>{addressRecord?.city}</td>
                        <td>8600</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr className="rf19-caption-row">
                <td colSpan={4}>
                  <table className="rf19-caption-grid">
                    <colgroup>
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "21%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "17%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>House No./Street/Purok</td>
                        <td>Subdivision</td>
                        <td>Barangay</td>
                        <td>City</td>
                        <td>Zip Code</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <div className="rf19-choice-group">
                    <span className="rf19-label">Civil Status:</span>
                    <div className="rf19-choice-col">
                      {choice("Single", civilStatus === "single")}
                      {choice("Divorced", civilStatus === "divorced")}
                    </div>
                    <div className="rf19-choice-col">
                      {choice("Married", civilStatus === "married")}
                      {choice("Annulled", civilStatus === "annulled")}
                    </div>
                    <div className="rf19-choice-col">
                      {choice("Separated", civilStatus === "separated")}
                      {choice("Widow/Widower", civilStatus === "widowed")}
                    </div>
                  </div>
                </td>
                <td colSpan={2}>
                  <span className="rf19-label">Contact Number:</span>{" "}
                  <span className="rf19-value">{phoneRecord?.phone_number}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <span className="rf19-label">Educational Attainment:</span>{" "}
                  <span className="rf19-value">
                    {details?.educational_attainment}
                  </span>
                </td>
                <td colSpan={2}>
                  <span className="rf19-label">Occupation/Position:</span>{" "}
                  <span className="rf19-value">{occupation?.position}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                  <span className="rf19-label">
                    Name of Employer/Establishment
                  </span>{" "}
                  <span className="rf19-hint">(if applicable)</span>
                  <span className="rf19-label">:</span>{" "}
                  <span className="rf19-value">{occupation?.company_name}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <span className="rf19-label">Business Address</span>{" "}
                  <span className="rf19-hint">(if applicable)</span>
                  <span className="rf19-label">:</span>{" "}
                  <span className="rf19-value">
                    {occupation?.employeer_address}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ===== DECLARATION ===== */}
          <p className="rf19-declaration-heading">
            DECLARATION AS TO THE CORRECTNESS OF THE INFORMATION GIVEN
          </p>
          <p className="rf19-declaration">
            I hereby voluntarily declare that all the information provided in
            this request form for the occupational permit is true, accurate, and
            complete to the best of my knowledge and belief. I fully understand
            that any false, misleading, or incomplete information may result in
            the disapproval of my application or other legal consequences. I
            further declare that I am of legal age and not below eighteen (18)
            years old at the time of this request.
          </p>

          <div className="rf19-signature">
            <div className="rf19-signature-inner">
              <span className="rf19-signature-name">{printedName}</span>
              <div className="rf19-signature-line">
                <p className="rf19-signature-caption">
                  Signature over Printed Name
                </p>
              </div>
            </div>
          </div>

          <div className="rf19-approval">
            <p>Recommending Approval:</p>
            <p className="rf19-approval-name">ATTY. MOSHI ARIEL S. CAHOY</p>
            <p>City Government Department Head II</p>
          </div>

          {/* ===== REQUIREMENTS ===== */}
          <div className="rf19-requirements">
            <span className="rf19-requirements-heading">REQUIREMENTS:</span>
            <ol>
              <li>Community Tax Certificate (Cedula)</li>
              <li>Certificate of Employment (if employed)</li>
              <li>
                Training Certificate issued by TESDA or any authorized or
                accredited agency (for Massage Therapist)
              </li>
            </ol>
          </div>

          <p className="rf19-apply">
            APPLY OCCUPATIONAL PERMIT ONLINE @{" "}
            <span className="rf19-apply-link">ospas.butuan.gov.ph</span>
          </p>

          <p className="rf19-system-note">
            Note. This is system generated. No signature is required.
          </p>

          {/* ===== BOTTOM FOOTER ===== */}
          <img className="rf19-rule rf19-footer-rule" src={footerLine} alt="" />
          <table className="rf19-bottom">
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "27%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="rf19-bottom-left">
                    <img src={qrCode} alt="QR Code" className="rf19-qr" />
                    <div className="rf19-contact">
                      <span>
                        City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                      </span>
                      <span>
                        Email:{" "}
                        <span className="rf19-link">cbpld@butuan.gov.ph</span>
                      </span>
                      <span>Phone: 0951-388-4193</span>
                      <span className="rf19-link">www.butuan.gov.ph</span>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <img src={tuvLogo} alt="TUV NORD" className="rf19-tuv" />
                  <p className="rf19-cert-no">
                    Certificate Registration No. PHP
                    <br />
                    QMS 23 93 0116
                  </p>
                </td>
                <td className="text-end">
                  <img
                    src={butuanOnLogo}
                    alt="Butuan ON"
                    className="rf19-butuanon"
                  />
                  <p className="rf19-form-code">CBPLD.BPLD.F.019.REV04</p>
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
          <Button onClick={toggleModal}>Close</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
