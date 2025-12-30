import React, { useEffect, useState, useRef, useMemo } from "react";
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

  const gender = application?.corporation_member?.sex ?? application?.user?.sex;

  const civilStatus =
    application?.corporation_member?.user_details_morph?.civil_status?.code ??
    application?.user?.user_details?.civil_status?.code;

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
                          className="header-logo-request-form"
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
                    <div
                      className="text-center "
                      style={{ marginTop: "50px", width: "100%" }}
                    >
                      <h1 className="title">
                        REQUEST FORM FOR OCCUPATIONAL PERMIT
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
                  <div style={{ width: "765px" }}>
                    <table className="form-table split-70-30">
                      <colgroup>
                        <col style={{ width: "60%" }} />
                        <col style={{ width: "40%" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className="label">
                            Date:
                            <span className="fw-normal">
                              {" "}
                              {application?.application_date}
                            </span>
                          </td>
                          <td className="label">Control No.:</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 2: Full width */}
                    <table className="form-table">
                      <tbody>
                        <tr>
                          <td className="label d-flex ">
                            Name:
                            <div className="w-100 d-flex justify-content-around  ">
                              <span>
                                {isCompany
                                  ? application?.corporation_member?.lname
                                  : application?.user?.lname || ""}
                              </span>
                              <span>
                                {isCompany
                                  ? application?.corporation_member?.fname
                                  : application?.user?.fname || ""}
                              </span>
                              <span>
                                {isCompany
                                  ? application?.corporation_member?.mname
                                  : application?.user?.mname || ""}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr className="sub-labels">
                          <td>
                            <div className="d-flex justify-content-around ms-5">
                              <span>Surname</span>
                              <span>First Name</span>
                              <span>Middle Initial / Suffix</span>
                            </div>
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
                            <div>
                              Date of Birth: <span>(Year-Month-Day)</span>
                            </div>
                            <div className="text-center fw-normal">
                              <span>
                                {isCompany
                                  ? application?.corporation_member
                                      ?.user_details_morph?.birthdate
                                  : application?.user?.user_details
                                      ?.birthdate || ""}
                              </span>
                            </div>
                          </td>
                          <td className="label">
                            <div className="d-flex">
                              Gender:
                              <div className="d-flex flex-column">
                                <div>
                                  <span
                                    className="checkbox ms-2"
                                    style={{
                                      backgroundColor:
                                        gender === "MALE" ? "black" : null,
                                    }}
                                  ></span>{" "}
                                  Male
                                </div>
                                <div>
                                  <span
                                    className="checkbox ms-2"
                                    style={{
                                      backgroundColor:
                                        gender === "FEMALE" ? "black" : null,
                                    }}
                                  ></span>{" "}
                                  FEMALE
                                </div>
                              </div>
                              <div>
                                <div>
                                  <span
                                    className="checkbox ms-2"
                                    style={{
                                      backgroundColor:
                                        gender === "PREFER NOT TO SAY"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Prefer not to say
                                </div>
                                <div>
                                  <span
                                    className="checkbox ms-2"
                                    style={{
                                      backgroundColor:
                                        gender === "OTHERS" ? "black" : null,
                                    }}
                                  ></span>{" "}
                                  Other _______
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
                          <td className="label">
                            Address:
                            <div className="d-flex justify-content-around">
                              <span>
                                {isCompany
                                  ? application?.corporation_member
                                      ?.user_addresses_morph?.[0]?.address_line
                                  : application?.user?.user_addresses?.[0]
                                      ?.address_line}
                              </span>
                              <span>
                                {isCompany
                                  ? application?.corporation_member
                                      ?.user_addresses_morph?.[0]?.barangay
                                  : application?.user?.user_addresses?.[0]
                                      ?.barangay}
                              </span>
                              <span>
                                {isCompany
                                  ? application?.corporation_member
                                      ?.user_addresses_morph?.[0]?.city
                                  : application?.user?.user_addresses?.[0]
                                      ?.city}{" "}
                                / 8600
                              </span>
                            </div>
                          </td>
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
                                  <span
                                    className="checkbox  ms-2"
                                    style={{
                                      backgroundColor:
                                        civilStatus === "single"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Single
                                </div>
                                <div>
                                  <span
                                    className="checkbox  ms-2"
                                    style={{
                                      backgroundColor:
                                        civilStatus === "divorced"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Divorced
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div>
                                  <span
                                    className="checkbox  ms-2"
                                    style={{
                                      backgroundColor:
                                        civilStatus === "married"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Married
                                </div>
                                <div>
                                  <span
                                    className="checkbox ms-2 "
                                    style={{
                                      backgroundColor:
                                        civilStatus === "annulled"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Annulled
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <div>
                                  <span
                                    className="checkbox  ms-2"
                                    style={{
                                      backgroundColor:
                                        civilStatus === "separated"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Separated
                                </div>
                                <div>
                                  <span
                                    className="checkbox  ms-2"
                                    style={{
                                      backgroundColor:
                                        civilStatus === "widowed"
                                          ? "black"
                                          : null,
                                    }}
                                  ></span>{" "}
                                  Widowed/Widower
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="label">
                            <div>Contact Number:</div>
                            <div className="text-center">
                              <span className="fw-normal">
                                {isCompany
                                  ? application?.corporation_member
                                      ?.user_phone_numbers_morph?.[0]
                                      ?.phone_number
                                  : application?.user?.user_phone_numbers?.[0]
                                      ?.phone_number || ""}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">
                            Educational Attainment:{" "}
                            <span className="fw-normal">
                              {isCompany
                                ? application?.corporation_member
                                    ?.user_details_morph?.educational_attainment
                                : application?.user?.user_details
                                    ?.educational_attainment || ""}
                            </span>
                          </td>
                          <td className="label">
                            Occupation / Position:{" "}
                            {isCompany
                              ? application?.corporation_member
                                  ?.user_occupation_details_morph?.position
                              : application?.user?.user_occupation_details
                                  ?.position || ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Table 6: Full width */}
                    <table className="form-table">
                      <tbody>
                        <tr>
                          <td className="label">
                            Name of Employer / Establishment:{" "}
                            <span className="fw-normal">
                              {isCompany
                                ? application?.corporation_member
                                    ?.user_occupation_details_morph
                                    ?.company_name
                                : application?.user?.user_occupation_details
                                    ?.company_name || ""}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">
                            Business Address:{" "}
                            <span className="fw-normal">
                              {isCompany
                                ? application?.corporation_member
                                    ?.user_occupation_details_morph
                                    ?.employeer_address
                                : application?.user?.user_occupation_details
                                    ?.employeer_address || ""}
                            </span>
                          </td>
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
                    <span className="fw-bold" style={{ marginTop: "60px" }}>
                      {" "}
                      {isCompany
                        ? `${application?.corporation_member?.fname} ${
                            application?.corporation_member?.mname || ""
                          } ${
                            application?.corporation_member?.lname
                          }`.toUpperCase()
                        : `${application?.user?.fname} ${
                            application?.user?.mname || ""
                          } ${application?.user?.lname}`.toUpperCase() || ""}
                    </span>
                    <hr
                      style={{
                        width: "200px",
                        border: "1px solid #000000",
                        marginTop: "0px",
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
