import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
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
  console.log(applicationId);
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

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="xl">
      <ModalHeader toggle={toggleModal}></ModalHeader>
      <ModalBody>
        <div
          className="wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          ref={printRef}
        >
          <table style={{ margin: "10px", height: "990px", width: "765px" }}>
            <tbody>
              <tr>
                <td>
                  <div className="header-content d-flex flex-column">
                    <div className="d-flex flex-row">
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
                          <div style={{ marginTop: "px", marginLeft: "-30px" }}>
                            <img
                              className="header-line"
                              src={headerLine}
                              alt="Line"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center" style={{ marginTop: "50px" }}>
                      <h1 className="title">
                        REQUEST FORM FOR OCCUPATIONAL PERMIT
                      </h1>
                    </div>
                  </div>
                </td>
              </tr>

              {/* FORM TABLE */}
              <tr>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "765px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    {/* Table 1: 50-50 split */}
                    <table className="form-table split-70-30">
                      <colgroup>
                        <col style={{ width: "60%" }} />
                        <col style={{ width: "40%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className="label">Date:</td>
                          <td className="label">Control No.:</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 2: Full width */}
                    <table className="form-table">
                      <tbody>
                        <tr>
                          <td className="label">Name:</td>
                        </tr>
                        <tr className="sub-labels">
                          <td className="d-flex justify-content-around">
                            <span>Surname</span>
                            <span>First Name</span>
                            <span>Middle Initial / Suffix</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 3: 60-40 split */}
                    <table className="form-table split-50-50">
                      <colgroup>
                        <col style={{ width: "50%" }} />
                        <col style={{ width: "50%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className="label">
                            Date of Birth: <span>(Month-Day-Year)</span>
                          </td>
                          <td className="label">
                            <div className="d-flex">
                              Gender:
                              <div className="d-flex flex-column">
                                <div>
                                  <span className="checkbox ms-2"></span> Male
                                </div>
                                <div>
                                  <span className="checkbox ms-2"></span> Female
                                </div>
                              </div>
                              <div>
                                <div>
                                  <span className="checkbox ms-2"></span> Prefer
                                  not to say
                                </div>
                                <div>
                                  <span className="checkbox ms-2"></span> Other
                                  _______
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 4: Full width */}
                    <table className="form-table">
                      <tbody>
                        <tr>
                          <td className="label">Address:</td>
                        </tr>
                        <tr className="sub-labels">
                          <td className="d-flex justify-content-around">
                            <span>House No./Street/Purok</span>
                            <span>Barangay</span>
                            <span>City / Zip Code</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 5: 50-50 split */}
                    <table className="form-table ">
                      <colgroup>
                        <col style={{ width: "60%" }} />
                        <col style={{ width: "40%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className="label">
                            <div className="d-flex">
                              Civil Status:
                              <div className="d-flex flex-column">
                                <div>
                                  <span className="checkbox  ms-2"></span>{" "}
                                  Single
                                </div>
                                <div>
                                  <span className="checkbox  ms-2"></span>{" "}
                                  Divorced
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div>
                                  <span className="checkbox  ms-2"></span>{" "}
                                  Married
                                </div>
                                <div>
                                  <span className="checkbox ms-2 "></span>{" "}
                                  Annulled
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div>
                                  <span className="checkbox  ms-2"></span>{" "}
                                  Separated
                                </div>
                                <div>
                                  <span className="checkbox  ms-2"></span>{" "}
                                  Widowed/Widower
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="label">Contact Number:</td>
                        </tr>
                        <tr>
                          <td className="label">Educational Attainment:</td>
                          <td className="label">Occupation / Position:</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 6: Full width */}
                    <table className="form-table">
                      <tbody>
                        <tr>
                          <td className="label">
                            Name of Employer / Establishment:
                          </td>
                        </tr>
                        <tr>
                          <td className="label">Business Address:</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              {/* DECLARATION */}
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
                <td style={{ width: "900px" }}>
                  <p
                    style={{
                      textIndent: "40px",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                      fontSize: "12pt",
                    }}
                    className="cambraText"
                  >
                    I hereby voluntarily declare that all the information
                    provided in this request form for the occupational permit is
                    true, accurate, and complete to the best of my knowledge and
                    belief. I fully understand that any false, misleading, or
                    incomplete information may result in the disapproval of my
                    application or other legal consequences. I further declare
                    that I am of legal age and not below eighteen (18) years old
                    at the time of this request.
                  </p>
                </td>
              </tr>

              {/* SIGNATURE */}
              <tr>
                <td>
                  <div
                    style={{ width: "200px" }}
                    className="d-flex align-items-center flex-column"
                  >
                    <hr
                      style={{
                        width: "200px",
                        border: "1px solid #000000",
                        marginTop: "40px",
                        marginBottom: "0px",
                      }}
                    />
                    <p className="cambraText p-0 m-0">
                      Signature over Printed Name
                    </p>
                  </div>
                </td>
              </tr>

              {/* APPROVAL */}
              <tr>
                <td className="text-center ">
                  <div
                    style={{
                      gap: "70px",
                      marginTop: "30px",
                      marginBottom: "30px",
                    }}
                    className="d-flex flex-column text-center cambraText"
                  >
                    <p>Recomminding Approval:</p>
                    <div className="d-flex flex-column text-center cambraText">
                      <span className="fw-bold">ATTY.MOSHI ARIEL S. CAHOY</span>
                      <span>City Government Department Head II</span>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="d-flex gap-2">
                      <div
                        className="d-flex flex-column"
                        style={{ fontSize: "11pt" }}
                      >
                        <span>Mobile #</span>
                        <span>Email</span>
                        <span>Website</span>
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{ fontSize: "11pt" }}
                      >
                        <span>: 09513884193</span>
                        <span>: cpld@butuan.gov.ph</span>
                        <span>: http://www.butuan.gov.ph</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <img
                        src={butuanOnLogo}
                        style={{ width: "180px" }}
                        alt="Butuan Logo"
                      />
                      <p
                        className="p-0 m-0 fw-bold"
                        style={{ fontStyle: "italic", fontSize: "16px" }}
                      >
                        CBPLD.BPLD.F.019.REV02
                      </p>
                    </div>
                  </div>
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
          <Button onClick={toggleModal}>Close</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
