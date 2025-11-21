import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import logo from "../../../../../assets/images/cgbLogo.png";
import "./OccupationalCertificate.css";
import permitHeaderLine from "../../../../../assets/images/permitHeaderLine.png";
import permitFooterLine from "../../../../../assets/images/permitFooterLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import axios from "axios";

const OccupationalCertificate = forwardRef(({ applicationDetails }, ref) => {
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = endOfYear.toLocaleDateString("en-US", options);
  const [currentImage, setCurrentImage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  console.log(currentImage);

  const concatString = (convert, { fname, mname, lname }) => {
    if (convert === "toUpper") {
      return `${fname} ${mname} ${lname}`.toUpperCase();
    } else {
      return `${fname} ${mname} ${lname}`;
    }
  };
  const currentDate = useMemo(() => {
    const today = new Date();

    const formatted =
      String(today.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(today.getDate()).padStart(2, "0") +
      "/" +
      today.getFullYear();
    return formatted;
  }, [applicationDetails]);

  useEffect(() => {
    if (applicationDetails) {
      const fetchImage = async () => {
        setIsFetching(true);
        try {
          const response = await axios({
            url: "/api/admin/attachment",
            method: "GET",
            params: { filepath: applicationDetails?.uploaded_file?.id_picture },
            responseType: "blob",
          });

          if (response?.data) {
            const blobUrl = URL.createObjectURL(response.data);
            setCurrentImage(blobUrl);
          }
          setIsFetching(false);
        } catch (error) {
          setIsFetching(false);
          console.log(error?.response?.data?.message || error);
        }
      };

      fetchImage();
    }
  }, [applicationDetails]);
  return (
    <div className="permit-container" ref={ref}>
      <div className="permit-header">
        <div className="permit-header-upper-section">
          <div>
            <img src={logo} className="permit-logo" />
          </div>
          <div className="permit-header-text">
            <p>Republic of the Philippines</p>
            <p className="fw-bold"> CITY GOVERNMENT OF BUTUAN</p>
            <p className="fw-bold">
              {" "}
              CITY BUSINESS PERMITS AND LICENSING DEPARTMENT
            </p>
            <p> City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City</p>
            <img src={permitHeaderLine} className="permit-headerline" />
          </div>
        </div>
        <div className="permit-header-title">
          <span>OCCUPATIONAL PERMIT</span>
        </div>
      </div>
      <div className="permit-body">
        <div className="body-reference-number">
          <span className="fw-bold ">Permit No.:</span>
          <span className="text-decoration-underline fw-bold text-danger">
            2025-OP-1231
          </span>
        </div>
        <div className="top">
          <div className="user-name">
            <span>Name:</span>
            <span className="fw-bold text-decoration-underline ">
              {concatString("toUpper", {
                fname: applicationDetails?.corporation_member?.fname,
                mname: applicationDetails?.corporation_member?.mname || "",
                lname: applicationDetails?.corporation_member?.lname,
              })}
            </span>
          </div>
          <div className="user-details">
            <div className="user-details-birth">
              <div>
                <span>Date if Birth:</span>
                <span className="fw-bold text-decoration-underline ">
                  {
                    applicationDetails?.corporation_member?.user_details_morph
                      ?.birthdate
                  }
                </span>
              </div>
              <div>
                <span>Age:</span>
                <span className="fw-bold text-decoration-underline ">
                  {
                    applicationDetails?.corporation_member?.user_details_morph
                      ?.age
                  }
                </span>
              </div>
              <div>
                <span>Sex:</span>
                <span className="fw-bold text-decoration-underline">
                  {applicationDetails?.corporation_member?.sex}
                </span>
              </div>
            </div>
            <div>
              <span>Home Address:</span>
              <span className="fw-bold text-decoration-underline">
                {
                  applicationDetails?.corporation_member
                    ?.user_addresses_morph[0]?.full_address
                }
              </span>
            </div>
            <div>
              <span>Occupation:</span>
              <span className="fw-bold text-decoration-underline">
                {
                  applicationDetails?.corporation_member
                    ?.user_occupation_details_morph?.position
                }
              </span>
            </div>
            <div>
              <span>Company Name:</span>
              <span className="fw-bold text-decoration-underline">
                {
                  applicationDetails?.corporation_member
                    ?.user_occupation_details_morph?.company_name
                }
              </span>
            </div>
            <div>
              <span>Company Address:</span>
              <span className="fw-bold text-decoration-underline">
                {
                  applicationDetails?.corporation_member
                    ?.user_occupation_details_morph?.company_name
                }
              </span>
            </div>
            <div>
              <span>Date Issued:</span>
              <span className="fw-bold text-decoration-underline">
                {currentDate}
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="note">
            NOTE: THIS PERMIT IS VALID UNTIL <span>{formatted}</span>
          </p>
        </div>
        <div className="picture-section">
          <div className="idpicture-box">
            {currentImage ? (
              <img src={currentImage} alt="ID picture" />
            ) : (
              <>
                <span>ID PICTURE</span>
                <span>Passport Size</span>
              </>
            )}
          </div>
          <div className="signatories-container">
            <div className="mayor">
              <span className="mayor-name">
                ATTY. LAWRENCE LEMUEL H. FORTUN
              </span>
              <span>City Mayor</span>
            </div>
            <div className="signatories-container">
              <div>
                <span className="authority">
                  For and by the authority of the City Mayor
                </span>
              </div>
              <div className="signatories">
                <span className="signatories-name">
                  ATTY. MOSHI ARIEL S. CAHOY
                </span>
                <span>City Government Department Head II</span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="permit-footer">
        <div className="permit-footer-upper">
          <div className="or-section">
            <div>
              <span>O.R. No:</span>
              <span>
                {" "}
                {applicationDetails?.order_of_payment?.payment_detail?.or_no}
              </span>
            </div>
            <div>
              <span>Date Issued: </span>
              <span>
                {" "}
                {
                  applicationDetails?.order_of_payment?.payment_detail
                    ?.date_of_payment
                }
              </span>
            </div>
          </div>
          <div className="logo-section">
            <img src={butuanOnLogo} className="butuan-on-logo" />
            <span className="fw-bold">CBPLD.BPLD.P.013.REV02</span>
          </div>
        </div>
        <img src={permitFooterLine} className="footer-line" />
      </div>
    </div>
  );
});
OccupationalCertificate.displayName = "OccupationalPermit";
export default OccupationalCertificate;
