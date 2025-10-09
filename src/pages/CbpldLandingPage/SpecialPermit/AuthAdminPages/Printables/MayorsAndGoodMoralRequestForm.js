import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";

export default function MayorsAndGoodMoralRequestForm({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <table>
            <tbody>
              <tr>
                {console.log("wew")}
                <td>
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
                    <div>
                      <div className="header-text">
                        <p>Republic of the Philippines</p>
                        <p className="header-title">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="header-title">
                          CITY GOVERNMENT PERMITS AND LICENSING DEPARTMENT
                        </p>
                        <p>
                          City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan
                          City
                        </p>
                        <div style={{ marginTop: "5px" }}>
                          <img
                            className="header-line"
                            src={headerLine}
                            alt="CGB Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-center"
                      style={{
                        position: "absolute",
                        bottom: "-50px",
                        left: "200px",
                      }}
                    >
                      <h1 className="title">REQUEST FORM </h1>
                      <h1 className="title" style={{ fontStyle: "italic" }}>
                        ( Good Moral Character/ Mayor&apos;s Certification)
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
                      width: "800px",
                      borderCollapse: "collapse",
                      marginTop: "50px",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>
                          <div className="d-flex gap-5">
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "red",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <div>
                              <p className="m-0 p-0">MAYOR&apos;S CLEARANCE</p>
                              <p className="m-0 p-0">
                                (Certificate of Good Moral Character)
                              </p>
                            </div>
                          </div>
                        </th>
                        <th>
                          <div className=" d-flex  gap-5">
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "red",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="m-0 p-0">
                              MAYOR&apos;S CERTIFICATION
                            </p>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
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
                              Police Clearance or NBI Clearance
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Police Clearance</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
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
                              Community Tax Certificate(Cedula)
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
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
                              {" "}
                              Community Tax Certificate(Cedula)
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex justify-content-center ">
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
                              Baragay Clearance
                              <span className="fw-normal ">
                                (to be issued by the Punong Barangay in Butuan
                                City, as proof of residency)
                              </span>
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center ">
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
                          <div className="d-flex justify-content-center gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
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
                          <div className="d-flex justify-content-center gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
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
                          <div className="d-flex justify-content-center gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Fiscal Clearance</p>
                          </div>
                          <div className="d-flex justify-content-center mt-3 gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Court Clearance</p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Fiscal Clearance</p>
                          </div>
                          <div className="d-flex justify-content-center mt-3 gap-2">
                            <div
                              style={{
                                border: "2px solid",
                                borderRadius: "50%",
                                borderColor: "black",
                                width: "20px",
                                height: "20px",
                              }}
                            ></div>
                            <p className="fw-bold m-0 p-0">Court Clearance</p>
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
                          <div className="d-flex justify-content-center gap-2">
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
                              Certificate of Ordination
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {" "}
                          <div className="d-flex justify-content-center gap-3">
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
                    style={{ width: "900px", marginTop: "20px" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "65%" }}>
                          <span className="bolder-text cambraText">Date:</span>
                        </td>
                        <td style={{ width: "35%" }}>
                          <span className="bolder-text cambraText">
                            Contact No.:
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="bolder-text cambraText">
                          Name
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} className="text-center">
                          <span
                            className="cambraText me-5 ms-5"
                            style={{ fontStyle: "italic" }}
                          >
                            Surname
                          </span>
                          <span
                            className="cambraText me-5 ms-5"
                            style={{ fontStyle: "italic" }}
                          >
                            First Name
                          </span>
                          <span
                            className="cambraText me-5 ms-5"
                            style={{ fontStyle: "italic" }}
                          >
                            Middle Name
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="bolder-text cambraText">
                          Address:
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
                        <td className="bolder-text cambraText">Purpose</td>
                        <td className="bolder-text cambraText">
                          {" "}
                          Time of Event
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <p
                    style={{ marginTop: "30px" }}
                    className="cambraText bolder-text fs-5"
                  >
                    DECLARATION AS TO THE CORRECTNESS OF THE INFORMATION GIVEN
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ width: "800px" }}>
                  <p
                    style={{ marginTop: "30px", textIndent: "40px" }}
                    className="cambraText"
                  >
                    I hereby voluntarily declare that all the information
                    provided in this request form for the special permit is
                    true, accurate, and complete to the best of my knowledge and
                    belief. I fully understand that any false, misleading, or
                    incomplete information may result in the disapproval of my
                    application.
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <hr
                    style={{
                      width: "200px",
                      border: "1px solid #000000",
                      marginTop: "80px",
                    }}
                  />
                  <p className="cambraText">Signature over Printed Name</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalBody>
    </Modal>
  );
}
