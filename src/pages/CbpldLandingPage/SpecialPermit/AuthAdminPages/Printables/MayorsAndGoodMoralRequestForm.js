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
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      className="mayors-request-form-modal"
    >
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            overflowX: "auto",
          }}
          className="testing"
          ref={printRef}
        >
          <table style={{ margin: "10px", height: "990px" }}>
            <tbody>
              {/* ===== HEADER ===== */}
              <tr>
                <td>
                  <div className="form-header">
                    <div className="header-top-row">
                      <div className="header-logo-wrap">
                        <img
                          src={cgbLogo}
                          alt="CGB Logo"
                          className="header-logo-request-form"
                        />
                      </div>
                      <div className="header-text d-flex flex-column gap-1">
                        <p>Republic of the Philippines</p>
                        <p className="header-title">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="header-title">
                          City Business Permits and Licensing Department
                        </p>
                        <p className="header-title">Butuan City</p>
                      </div>
                      <p className="fw-bold revised-date">
                        Revised on March 19, 2026
                      </p>
                    </div>

                    <img
                      className="header-line"
                      src={headerLine}
                      alt="header line"
                    />

                    <div className="title-section text-center">
                      <h1 className="title m-0 p-0">REQUEST FORM</h1>
                      <h1 className="title">
                        (
                        <span style={{ fontStyle: "italic" }}>
                          {" "}
                          Good Moral Character/ Mayor&apos;s Certification{" "}
                        </span>
                        )
                      </h1>
                    </div>
                  </div>
                </td>
              </tr>

              {/* ===== MAIN TABLE ===== */}
              <tr>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <table
                    className="main-table"
                    style={{
                      width: "900px",
                      borderCollapse: "collapse",
                      marginTop: "20px",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "15%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <div className="d-flex align-items-center">
                            <div
                              className="checkbox-square"
                              style={{
                                backgroundColor: column1 ? "black" : "",
                              }}
                            >
                              {" "}
                            </div>
                            <div style={{ marginLeft: "15px" }}>
                              <p className="m-0 p-0">MAYOR&apos;S CLEARANCE</p>
                              <p className="m-0 p-0 fw-normal">
                                (Certificate of Good Moral Character)
                              </p>
                            </div>
                          </div>
                        </th>
                        <th className="where-to-secure-cell">
                          Where to secure:
                        </th>
                        <th>
                          <div className="d-flex align-items-center">
                            <div
                              className="checkbox-square"
                              style={{
                                backgroundColor: !column1 ? "black" : "",
                              }}
                            ></div>
                            <div style={{ marginLeft: "15px" }}>
                              <p className="m-0 p-0">
                                MAYOR&apos;S CERTIFICATION
                              </p>
                            </div>
                          </div>
                        </th>
                        <th className="where-to-secure-cell">
                          Where to secure:
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">Police Clearance</p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Philippine National Police (PNP)
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">Police Clearance</p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Philippine National Police (PNP)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">
                              Community Tax Certificate (Cedula)
                            </p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          City Treasury Department
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">
                              Community Tax Certificate (Cedula)
                            </p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          City Treasury Department
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p
                              className="fw-bold m-0 p-0"
                              style={{ flex: "1" }}
                            >
                              Barangay Clearance{" "}
                              <span className="fw-normal">
                                (as proof of residency)
                              </span>
                            </p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Barangay Hall (to be issued by the Punong Barangay in
                          Butuan City)
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p
                              className="fw-bold m-0 p-0"
                              style={{ flex: "1" }}
                            >
                              Barangay Clearance{" "}
                              <span className="fw-normal">
                                (as proof of residency)
                              </span>
                            </p>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Barangay Hall (to be issued by the Punong Barangay in
                          Butuan City)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="main-table-cell align-items-start">
                            <div
                              className="circle-bullet"
                              style={{ marginTop: "3px" }}
                            ></div>
                            <div>
                              <p className="fw-bold m-0 p-0">
                                Official Receipt (OR){" "}
                                <span className="fw-normal">
                                  as payment for:
                                </span>
                              </p>
                              <ul className="m-0">
                                <li>
                                  Mayor&apos;s Certificate{" "}
                                  <span>(₱100.00)</span>
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
                        </td>
                        <td className="where-to-secure-cell">
                          City Treasury Department
                        </td>
                        <td>
                          <div className="main-table-cell align-items-start">
                            <div
                              className="circle-bullet"
                              style={{ marginTop: "3px" }}
                            ></div>
                            <div>
                              <p className="fw-bold m-0 p-0">
                                Official Receipt (OR){" "}
                                <span className="fw-normal">
                                  as payment for:
                                </span>
                              </p>
                              <ul className="m-0">
                                <li>
                                  Mayor&apos;s Certificate{" "}
                                  <span>(₱100.00)</span>
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
                        </td>
                        <td className="where-to-secure-cell">
                          City Treasury Department
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <div className="main-table-cell">
                              <div className="circle-bullet"></div>
                              <p className="fw-bold m-0 p-0">
                                Fiscal Clearance{" "}
                                <span className="fw-normal">
                                  (Regional Trial Court)
                                </span>
                              </p>
                            </div>
                            <div className="main-table-cell">
                              <div className="circle-bullet"></div>
                              <p className="fw-bold m-0 p-0">
                                Court Clearance{" "}
                                <span className="fw-normal">
                                  (Municipal Trial Court)
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Hall of Justice
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <div className="main-table-cell">
                              <div className="circle-bullet"></div>
                              <p className="fw-bold m-0 p-0">
                                Fiscal Clearance{" "}
                                <span className="fw-normal">
                                  (Regional Trial Court)
                                </span>
                              </p>
                            </div>
                            <div className="main-table-cell">
                              <div className="circle-bullet"></div>
                              <p className="fw-bold m-0 p-0">
                                Court Clearance{" "}
                                <span className="fw-normal">
                                  (Municipal Trial Court)
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="where-to-secure-cell">
                          Hall of Justice
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} rowSpan={2} className="reminders-cell">
                          <p style={{ color: "red", fontStyle: "italic" }}>
                            <span className="fw-bold">Reminders:</span>
                          </p>
                          <ul style={{ color: "red", fontStyle: "italic" }}>
                            <li>
                              Magkuha una og{" "}
                              <span className="fw-bold">Fiscal Clearance</span>{" "}
                              ug{" "}
                              <span className="fw-bold">Court Clearance</span>.
                            </li>
                            <li>
                              Ang mga rekisitos sa{" "}
                              <span className="fw-bold">Fiscal Clearance</span>{" "}
                              mao ang{" "}
                              <span className="fw-bold">Police Clearance</span>{" "}
                              ug{" "}
                              <span className="fw-bold">
                                Barangay Clearance
                              </span>
                              .
                            </li>
                            <li>
                              Ang mga rekisitos sa{" "}
                              <span className="fw-bold">Court Clearance</span>{" "}
                              mao ang{" "}
                              <span className="fw-bold">Fiscal Clearance</span>,{" "}
                              <span className="fw-bold">Police Clearance</span>{" "}
                              ug{" "}
                              <span className="fw-bold">
                                Barangay Clearance
                              </span>
                              .
                            </li>
                            <li>
                              Dapat <span className="fw-bold">BUTUAN CITY</span>{" "}
                              ang address nga ibutang sa mga dokumento. Human ma
                              kompleto ang mga rekisitos, mamahimong mag apply
                              online @{" "}
                              <span style={{ textDecoration: "underline" }}>
                                ospas.butuan.gov.ph
                              </span>
                            </li>
                          </ul>
                        </td>
                        <td colSpan={2}>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">
                              Certificate of Ordination
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="main-table-cell">
                            <div className="circle-bullet"></div>
                            <p className="fw-bold m-0 p-0">
                              Securities and Exchange Commission (SEC)
                              Registration of the church
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* ===== FOOTER FORM FIELDS ===== */}
              <tr>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <table
                    className="footer-table"
                    style={{ width: "900px", marginTop: "30px" }}
                  >
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          <p
                            className="m-0 p-0 cambraText"
                            style={{ fontStyle: "italic", fontSize: "12px" }}
                          >
                            (Please fill-out the following information)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "65%" }}>
                          <div className="d-flex">
                            <span className="bolder-text cambraText">
                              Date:
                            </span>
                            <p className="p-0 m-0">
                              {formater(application?.created_at)}
                            </p>
                          </div>
                        </td>
                        <td style={{ width: "35%" }}>
                          <div className="d-flex">
                            <span className="bolder-text cambraText">
                              Contact No.:
                            </span>
                            <p className="p-0 m-0">
                              {
                                application?.user?.user_phone_numbers[0]
                                  .phone_number
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="d-flex w-100">
                            <span
                              className="bolder-text cambraText"
                              style={{ width: "10%" }}
                            >
                              Name
                            </span>
                            <div
                              className="d-flex justify-content-around"
                              style={{ width: "90%" }}
                            >
                              <p className="m-0 bolder-text">
                                {application?.user?.lname
                                  ? application.user.lname.toUpperCase()
                                  : ""}
                              </p>
                              <p className="m-0 bolder-text ">
                                {application?.user?.fname
                                  ? application.user.fname.toUpperCase()
                                  : ""}
                              </p>
                              <p className="m-0 bolder-text">
                                {application?.user?.mname
                                  ? application.user.mname.toUpperCase()
                                  : ""}
                              </p>
                              <p className="m-0 bolder-text">
                                {application?.user?.suffix
                                  ? application.user.suffix.toUpperCase()
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} className="text-center">
                          <div
                            className="d-flex justify-content-around"
                            style={{ width: "90%", marginLeft: "10%" }}
                          >
                            <span
                              className="cambraText"
                              style={{ fontStyle: "italic" }}
                            >
                              Surname
                            </span>
                            <span
                              className="cambraText"
                              style={{ fontStyle: "italic" }}
                            >
                              First Name
                            </span>
                            <span
                              className="cambraText"
                              style={{ fontStyle: "italic" }}
                            >
                              Middle Initial
                            </span>
                            <span
                              className="cambraText"
                              style={{ fontStyle: "italic" }}
                            >
                              Extension
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="d-flex w-100">
                            <span
                              className="bolder-text cambraText"
                              style={{ width: "10%" }}
                            >
                              Address
                            </span>
                            <div
                              style={{ width: "90%" }}
                              className="d-flex justify-content-around"
                            >
                              <p className="m-0 p-0">
                                {
                                  application?.user?.user_addresses[0]
                                    ?.address_line
                                }
                              </p>
                              <p className="m-0 p-0">
                                {application?.user?.user_addresses[0]
                                  ?.subdivision || " "}
                              </p>
                              <p className="m-0 p-0">
                                {application?.user?.user_addresses[0]?.barangay}
                              </p>
                              <p className="m-0 p-0">
                                {application?.user?.user_addresses[0]?.city}
                              </p>
                              <p className="m-0 p-0">8600</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div
                            className="d-flex justify-content-between"
                            style={{
                              paddingLeft: "60px",
                              paddingRight: "60px",
                            }}
                          >
                            <i className="cambraText">House No./Street/Purok</i>
                            <i className="cambraText">Subdivision</i>
                            <i className="cambraText">Barangay</i>
                            <i className="cambraText">City</i>
                            <i className="cambraText">Zip code</i>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="bolder-text cambraText">
                          Name of Employer/Establishment{" "}
                          <span
                            className="fw-normal"
                            style={{ fontStyle: "italic" }}
                          >
                            (for Certificate of Good Moral Character)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="d-flex gap-2">
                            <span className="bolder-text cambraText">
                              {" "}
                              Purpose:
                            </span>
                            <p className="p-0 m-0 ">
                              {application?.application_purpose?.name}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td>
                  <p
                    className="p-0 m-0 fw-bold"
                    style={{
                      fontStyle: "italic",
                      fontSize: "13px",
                      paddingRight: "10px",
                    }}
                  >
                    &quot; Note. This is system generated. No signature is
                    required.&quot;
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <img src={footerLine} style={{ width: "100%", height: "5px" }} />
          <table style={{ width: "940px" }}>
            <tbody>
              {/* ===== BOTTOM FOOTER ===== */}
              <tr>
                <td
                  style={{
                    paddingRight: "22px",
                    paddingLeft: "22px",
                    // paddingTop: "40px",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-end"
                    style={{ flexWrap: "nowrap", width: "100%" }}
                  >
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ flexWrap: "nowrap", flexShrink: 0 }}
                    >
                      <img
                        src={qrCode}
                        alt="QR Code"
                        style={{ width: "70px" }}
                      />
                      <div
                        className="d-flex flex-column"
                        style={{ fontSize: "12px", maxWidth: "230px" }}
                      >
                        <span className="fw-bold">
                          City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan
                          City
                        </span>
                        <span>
                          Email:{" "}
                          <span style={{ color: "#0563C1" }}>
                            cbpld@butuan.gov.ph
                          </span>
                        </span>
                        <span>Phone: 0951-388-4193</span>
                        <span style={{ color: "#0563C1" }}>
                          www.butuan.gov.ph
                        </span>
                      </div>
                    </div>
                    <div className="text-center" style={{ flexShrink: 0 }}>
                      <img
                        src={tuvLogo}
                        alt="TUV NORD"
                        style={{ width: "110px" }}
                      />
                      <p
                        className="p-0 m-0"
                        style={{ fontSize: "10px", marginTop: "2px" }}
                      >
                        Certificate Registration No. PHP
                        <br />
                        QMS 23 93 0116
                      </p>
                    </div>
                    <div className="text-end" style={{ flexShrink: 0 }}>
                      {/* <p
                        className="p-0 m-0 fw-bold"
                        style={{
                          fontStyle: "italic",
                          fontSize: "13px",
                          paddingRight: "10px",
                        }}
                      >
                        &quot; Note. This is system generated. No signature is
                        required.&quot;
                      </p> */}
                      <img src={butuanOnLogo} style={{ width: "180px" }} />
                      <p
                        className="p-0 m-0 fw-bold"
                        style={{
                          fontStyle: "italic",
                          fontSize: "16px",
                          marginTop: "-10px",
                        }}
                      >
                        CBPLD.BPLD.F.017.REV07
                      </p>
                    </div>
                  </div>
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
