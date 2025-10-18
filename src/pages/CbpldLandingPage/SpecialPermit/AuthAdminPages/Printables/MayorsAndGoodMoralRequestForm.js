import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./MayorsAndGoodMoralRequestForm.css";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
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
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          className="testing"
          ref={printRef}
        >
          <table style={{ margin: "10px", height: "990px" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="header-content"
                    style={{ position: "relative" }}
                  >
                    <div
                      style={{
                        paddingTop: "15px",
                        paddingLeft: "20px",
                        zIndex: "1000",
                      }}
                    >
                      <img
                        src={cgbLogo}
                        alt="CGB Logo"
                        className="header-logo"
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <div className="header-text d-flex flex-column gap-1">
                        <p>Republic of the Philippines</p>
                        <p className="header-title ">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="header-title ">
                          CITY GOVERNMENT PERMITS AND LICENSING DEPARTMENT
                        </p>
                        <p>
                          City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan
                          City
                        </p>
                        <div style={{ marginTop: "px", marginLeft: "-30px" }}>
                          <img
                            className="header-line"
                            src={headerLine}
                            alt="CGB Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-center d-flex flex-column"
                      style={{
                        position: "absolute",
                        bottom: "-70px",
                        left: "250px",
                      }}
                    >
                      <h1 className="title m-0 p-0">REQUEST FORM </h1>
                      <h1 className="title ">
                        ({" "}
                        <span style={{ fontStyle: "italic" }}>
                          Good Moral Character/ Mayor&apos;s Certification)
                        </span>
                      </h1>
                    </div>
                  </div>
                </td>
              </tr>
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
                      marginTop: "70px",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>
                          <div className="d-flex align-items-center">
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "red",
                                width: "30px",
                                height: "30px",
                                backgroundColor: column1 ? "black" : "",
                              }}
                            >
                              {" "}
                            </div>
                            <div style={{ marginLeft: "100px" }}>
                              <p className="m-0 p-0">MAYOR&apos;S CLEARANCE</p>
                              <p className="m-0 p-0">
                                (Certificate of Good Moral Character)
                              </p>
                            </div>
                          </div>
                        </th>
                        <th>
                          <div className="d-flex align-items-center">
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "red",
                                width: "30px",
                                height: "30px",
                                backgroundColor: !column1 ? "black" : "",
                              }}
                            ></div>
                            <div style={{ marginLeft: "120px" }}>
                              <p className="m-0 p-0">
                                MAYOR&apos;S CERTIFICATION
                              </p>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.police_clearance && column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">
                              Police Clearance or NBI Clearance
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.police_clearance && !column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Police Clearance</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.community_tax_certificate && column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">
                              Community Tax Certificate(Cedula)
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.community_tax_certificate && !column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">
                              Community Tax Certificate(Cedula)
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="main-table-cell ">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.barangay_clearance && column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p
                              className="fw-bold m-0 p-0"
                              style={{ flex: "1" }}
                            >
                              Baragay Clearance
                              <span className="fw-normal ">
                                (to be issued by the Punong Barangay in Butuan
                                City, as proof of residency)
                              </span>
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.barangay_clearance && !column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p
                              className="fw-bold m-0 p-0"
                              style={{ flex: "1" }}
                            >
                              Baragay Clearance
                              <span className="fw-normal ">
                                (to be issued by the Punong Barangay in Butuan
                                City, as proof of residency)
                              </span>
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                marginLeft: "30px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <div>
                              <p className="fw-bold m-0 p-0">
                                Official Receipt(OR){" "}
                                <span className="fw-normal">
                                  as payment for:
                                </span>
                                <ul>
                                  <li>
                                    Mayor&apos; Certificate{" "}
                                    <span>(₱100.00)</span>
                                  </li>
                                  <li>
                                    Fiscal Clearance <span>(₱20.00)</span>
                                  </li>
                                  <li>
                                    Court Clearance <span>(₱20.00)</span>
                                  </li>
                                </ul>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                marginLeft: "30px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <div>
                              <p className="fw-bold m-0 p-0">
                                Official Receipt(OR){" "}
                                <span className="fw-normal">
                                  as payment for:
                                </span>
                                <ul>
                                  <li>
                                    Mayor&apos; Certificate{" "}
                                    <span>(₱100.00)</span>
                                  </li>
                                  <li>
                                    Fiscal Clearance <span>(₱20.00)</span>
                                  </li>
                                  <li>
                                    Court Clearance <span>(₱20.00)</span>
                                  </li>
                                </ul>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-column gap-2">
                            <div className="main-table-cell">
                              <div
                                style={{
                                  border: "2px solid",
                                  borderRadius: "50%",

                                  width: "20px",
                                  height: "20px",
                                  backgroundColor:
                                    !!application?.uploaded_file
                                      ?.fiscal_clearance && column1
                                      ? "black"
                                      : "",
                                }}
                              ></div>
                              <p className="fw-bold m-0 p-0">
                                Fiscal Clearance
                              </p>
                            </div>
                            <div className="main-table-cell">
                              <div
                                style={{
                                  border: "2px solid",
                                  borderRadius: "50%",

                                  width: "20px",
                                  height: "20px",
                                  backgroundColor:
                                    !!application?.uploaded_file
                                      ?.court_clearance && column1
                                      ? "black"
                                      : "",
                                }}
                              ></div>
                              <p className="fw-bold m-0 p-0">Court Clearance</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-2">
                            <div className="main-table-cell">
                              <div
                                style={{
                                  border: "2px solid",
                                  borderRadius: "50%",

                                  width: "20px",
                                  height: "20px",
                                  backgroundColor:
                                    !!application?.uploaded_file
                                      ?.fiscal_clearance && !column1
                                      ? "black"
                                      : "",
                                }}
                              ></div>
                              <p className="fw-bold m-0 p-0">
                                Fiscal Clearance
                              </p>
                            </div>
                            <div className="main-table-cell">
                              <div
                                style={{
                                  border: "2px solid",
                                  borderRadius: "50%",

                                  width: "20px",
                                  height: "20px",
                                  backgroundColor:
                                    !!application?.uploaded_file
                                      ?.court_clearance && !column1
                                      ? "black"
                                      : "",
                                }}
                              ></div>
                              <p className="fw-bold m-0 p-0">Court Clearance</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td rowSpan={2}>
                          <p style={{ color: "red" }}>
                            <span className="fw-bold">Note:</span> Magbayad usa
                            og <span className="fw-bold">₱140.00</span> sa
                            <span className="fw-bold">
                              Cashier Window 23, 24 o 26{" "}
                            </span>
                            para sa<span className="fw-bold">Fiscal</span> ug{" "}
                            <span className="fw-bold">Court Clearances </span>
                            adisir moadto sa Hall of Justice. Dapat BUTUAN CITY
                            ang address nga ibutang sa dokumento sama sa Fiscal,
                            Court, ug Brgy. Clearances. Mubalik sa
                            <span className="fw-bold"> CBPLD </span> og ipakita
                            ang tanan{" "}
                            <span className="fw-bold"> original </span>
                            nga mga dokumento (apil ang mga
                            <span className="fw-bold"> photocopy</span> ) alang
                            sa pag issue sa certificate.
                          </p>
                        </td>
                        <td>
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.court_clearance && !column1
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">
                              Certificate of Ordination
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {" "}
                          <div className="main-table-cell">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">
                              Securities and Exchange Commission () Registration
                              of the church
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
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
                    style={{ width: "900px", marginTop: "50px" }}
                  >
                    <tbody>
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
                                {application?.user?.lname
                                  ? application.user.lname.toUpperCase()
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
                              Middle Name
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
                            <i className="cambraText">Zip Code</i>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="bolder-text cambraText">
                          Name of Employer{" "}
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
              <tr>
                <td
                  className="text-end"
                  style={{
                    paddingRight: "22px",
                    paddingLeft: "22px",
                    paddingTop: "40px",
                  }}
                >
                  <img src={butuanOnLogo} style={{ width: "180px" }} />
                  <p
                    className="p-0 m-0 fw-bold"
                    style={{
                      fontStyle: "italic",
                      fontSize: "16px",
                      marginTop: "-10px",
                    }}
                  >
                    CBPLD.BPLD.F.107.REV04
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <img src={footerLine} style={{ width: "100%" }} />
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
