import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
// import cgbLogo from "../../../../../assets/images/cgbLogo.png";
// import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import "./RequestForm.css";
export default function RequestForm({ isOpen, toggle }) {
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
                        bottom: "-20px",
                        left: "200px",
                      }}
                    >
                      <h1 className="title">REQUEST FORM FOR SPECIAL PERMIT</h1>
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
                      marginTop: "20px",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>EVENT</th>
                        <th>MOTORCADE</th>
                        <th>PARADE</th>
                        <th>RECORRIDA</th>
                        <th>USE OF GOVERNMENT PROPERTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Request Letter &quot;Received&quot; by the Office of
                            the City Mayor.{" "}
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Request Letter &quot;Received&quot; by the Office of
                            the City Mayor.{" "}
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Request Letter &quot;Received&quot; by the Office of
                            the City Mayor.{" "}
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Request Letter &quot;Received&quot; by the Office of
                            the City Mayor.{" "}
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Request Letter &quot;Received&quot; by the Office of
                            the City Mayor.{" "}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="checkbox"> </div>
                          <p>
                            Official Receipt (pursuant to City Ordinance No.
                            6795 - 2022)
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>Route Plan approved by the CTTMD</p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>Route Plan approved by the CTTMD</p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>Route Plan approved by the CTTMD</p>
                        </td>
                        <td>
                          <div className="checkbox"> </div>
                          <p>
                            Official Receipt (pursuant to City Ordinance No.
                            6795 - 2022)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Official Receipt &#8369;200.00 per day (less than 10
                            vehicles) pursuant to City Ordinance No, 6795 -2022.
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Official Receipt &#8369;200.00 per day (less than 10
                            vehicles) pursuant to City Ordinance No, 6795 -2022.
                          </p>
                        </td>
                        <td>
                          <div className="checkbox"></div>
                          <p>
                            Official Receipt &#8369;200.00 per day pursuant to
                            City Ordinance No. 6795-2022
                          </p>
                        </td>
                        <td></td>
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
                          Name of Requestor/ Organization:
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="bolder-text cambraText">
                          Name of Representative:
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="text-center">
                          <span className="cambraText me-5 ms-5">Surname</span>
                          <span className="cambraText me-5 ms-5">
                            First Name
                          </span>
                          <span className="cambraText me-5 ms-5">
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
                          Name of Event:
                        </td>
                      </tr>
                      <tr>
                        <td className="bolder-text cambraText">
                          Name of Event
                        </td>
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
