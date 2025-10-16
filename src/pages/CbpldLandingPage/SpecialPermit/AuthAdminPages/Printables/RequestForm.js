import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Button,
  ButtonToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
// import cgbLogo from "../../../../../assets/images/cgbLogo.png";
// import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import headerLine from "../../../../../assets/images/permitHeaderLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import footerLine from "../../../../../assets/images/permitFooterLine.png";
import "./RequestForm.css";
import axios from "axios";
import moment from "moment";
import ReactToPrint from "react-to-print";
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
  const column1 = application?.special_permit_type?.code === "good_moral";
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
  const formater = (date) => {
    const newDate = new Date(date);
    const formatedDate = newDate.toLocaleDateString("en-US");
    return formatedDate;
  };
  const type = application?.special_permit_type?.code;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px",
          }}
          ref={printRef}
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
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.request_letter && type === "event"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Request Letter &quot;Received&quot; by the Office
                              of the City Mayor.{" "}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.request_letter && type === "motorcade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Request Letter &quot;Received&quot; by the Office
                              of the City Mayor.{" "}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.request_letter && type === "parade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Request Letter &quot;Received&quot; by the Office
                              of the City Mayor.{" "}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.request_letter && type === "recorrida"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Request Letter &quot;Received&quot; by the Office
                              of the City Mayor.{" "}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.request_letter &&
                                  type === "use_of_government_property"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Request Letter &quot;Received&quot; by the Office
                              of the City Mayor.{" "}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && type === "event"
                                    ? "black"
                                    : "",
                              }}
                            >
                              {" "}
                            </div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Official Receipt (pursuant to City Ordinance No.
                              6795 - 2022)
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file?.route_plan &&
                                  type === "motorcade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Route Plan approved by the CTTMD
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file?.route_plan &&
                                  type === "parade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Route Plan approved by the CTTMD
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file?.route_plan &&
                                  type === "recorrida"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Route Plan approved by the CTTMD
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt &&
                                  type === "use_of_government_property"
                                    ? "black"
                                    : "",
                              }}
                            >
                              {" "}
                            </div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Official Receipt (pursuant to City Ordinance No.
                              6795 - 2022)
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && type === "motorcade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Official Receipt &#8369;200.00 per day (less than
                              10 vehicles) pursuant to City Ordinance No, 6795
                              -2022.
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && type === "parade"
                                    ? "black"
                                    : "",
                              }}
                            ></div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Official Receipt &#8369;200.00 per day (less than
                              10 vehicles) pursuant to City Ordinance No, 6795
                              -2022.
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <div
                              className="checkbox"
                              style={{
                                backgroundColor:
                                  !!application?.uploaded_file
                                    ?.official_receipt && type === "recorrida"
                                    ? "black"
                                    : "",
                              }}
                            >
                              {" "}
                            </div>
                            <p style={{ flex: "1" }} className="m-0 p-0">
                              Official Receipt &#8369;200.00 per day pursuant to
                              City Ordinance No. 6795-2022
                            </p>
                          </div>
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
                    style={{
                      width: "900px",
                      marginTop: "20px",
                      tableLayout: "fixed",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "65%" }} className="m-0 p-0">
                          <div className="d-flex align-items-center gap-2">
                            <p className="label">Date:</p>
                            <p className="p-0 m-0">
                              {new Date(
                                application?.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td style={{ width: "35%" }} className="m-0 p-0">
                          <div className="d-flex align-items-center gap-2">
                            <p className="label">Contact No.:</p>
                            <p className="p-0 m-0">
                              {" "}
                              {
                                application?.user?.user_phone_numbers[0]
                                  ?.phone_number
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="m-0 p-0">
                          <div className="d-flex align-items-center gap-2">
                            <p className="label">
                              Name of Requestor/ Organization:
                            </p>
                            <p className="p-0 m-0">
                              {application?.requestor_name}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className=" m-0 p-0">
                          <div className="d-flex gap-2 h-100">
                            <p className="label" style={{ width: "20%" }}>
                              Name of Representative:
                            </p>
                            <div
                              className="d-flex justify-content-around"
                              style={{ width: "80%" }}
                            >
                              <p className="p-0 m-0">
                                {application?.user?.lname}
                              </p>
                              <p className="m-0 p-0">
                                {application?.user?.fname}
                              </p>
                              <p className="m-0 p-0">
                                {application?.user?.mname}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="text-center p-0">
                          <div
                            className="d-flex justify-content-around"
                            style={{ marginLeft: "10%" }}
                          >
                            <span className="cambraText me-5 ms-5 fst-italic">
                              Surname
                            </span>
                            <span className="cambraText me-5 ms-5 fst-italic">
                              First Name
                            </span>
                            <span className="cambraText me-5 ms-5 fst-italic">
                              Middle Name
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className=" m-0 p-0">
                          <div className="d-flex gap-2">
                            <p className="label">Address:</p>
                            <p className="p-0 m-0 ">
                              {`${
                                application?.user?.user_addresses[0]
                                  ?.address_line || ""
                              } ${
                                application?.user?.user_addresses[0]?.barangay
                              } ${application?.user?.user_addresses[0]?.city} ${
                                application?.user?.user_addresses[0]?.province
                              }`}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="t m-0 p-0">
                          <div className="d-flex gap-2">
                            <p className="label">Name of Event:</p>
                            <p className="p-0 m-0">{application?.event_name}</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className=" m-0 p-0">
                          <div className="d-flex gap-2">
                            <p className="label">Date of Event</p>
                            <p className="p-0 m-0">{`${
                              application?.event_date_from
                            }  ${
                              application?.event_date_to
                                ? "to " + application?.event_date_to
                                : ""
                            }`}</p>
                          </div>
                        </td>
                        <td className=" m-0 p-0">
                          <div className="d-flex gap-2">
                            <p className="label">Time of Event</p>
                            <p className="m-0 p-0">{`${application?.event_time_from} to ${application?.event_time_to}`}</p>
                          </div>
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
              <tr>
                <td className="text-end">
                  <img src={butuanOnLogo} style={{ width: "180px" }} />
                  <p
                    className="p-0 m-0 fw-bold"
                    style={{ fontStyle: "italic", fontSize: "16px" }}
                  >
                    CBPLD.BPLD.F.018.REV02
                  </p>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style={{ width: "100%" }}>
                  <img src={footerLine} style={{ width: "100%" }} />
                </td>
              </tr>
            </tfoot>
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
