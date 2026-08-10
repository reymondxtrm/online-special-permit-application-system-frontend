import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import logo from "../../../../../assets/images/cgbLogo.png";
import "./OccupationalCertificate.css";
import permitHeaderLine from "../../../../../assets/images/permitHeaderLine.png";
import permitFooterLine from "../../../../../assets/images/permitFooterLine.png";
import butuanOnLogo from "../../../../../assets/images/butuanOnLogo.png";
import axios from "axios";
import QrCodeGenerator from "../Certification/CertificateSections/QrCodeGenerator";

const OccupationalCertificate = forwardRef(({ applicationDetails }, ref) => {
  console.log(applicationDetails);
  const endOfYear = new Date();

  const oneYearLater = new Date(endOfYear);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = oneYearLater.toLocaleDateString("en-US", options);
  const [currentImage, setCurrentImage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const isCompany = applicationDetails?.user?.account_type === "company";
  const concatString = (convert, { fname, mname, lname, suffix }) => {
    if (convert === "toUpper") {
      return `${fname} ${mname} ${lname} ${suffix ?? ""}`.toUpperCase();
    } else {
      return `${fname} ${mname} ${lname} ${suffix ?? ""}`;
    }
  };
  const name = useMemo(() => {
    const val = isCompany
      ? concatString("toUpper", {
          fname: applicationDetails?.corporation_member?.fname,
          mname: applicationDetails?.corporation_member?.mname || "",
          lname: applicationDetails?.corporation_member?.lname,
          suffix: applicationDetails?.corporation_member?.suffix || "",
        })
      : concatString("toUpper", {
          fname: applicationDetails?.user?.fname,
          mname: applicationDetails?.user?.mname || "",
          lname: applicationDetails?.user?.lname,
          suffix: applicationDetails?.user?.suffix,
        }) || "";
    return val;
  }, [applicationDetails]);

  const getNameFontSize = (name) => {
    if (name?.length > 23) {
      return 13;
    } else {
      return 18;
    }
  };
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };
  const gender =
    applicationDetails?.corporation_member?.sex ??
    applicationDetails?.user?.sex;
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
  const dateFormat = (timeStamp) => {
    const date = new Date(timeStamp);
    return date.toLocaleDateString("en-US");
  };
  useEffect(() => {
    if (applicationDetails) {
      const fetchImage = async () => {
        setIsFetching(true);
        try {
          const response = await axios({
            url: "/api/admin/attachment",
            method: "GET",
            params: {
              filepath: applicationDetails?.uploaded_file?.id_picture,
            },
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
          <div style={{ width: "10px" }}>
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
            {/* <img src={permitHeaderLine} className="permit-headerline" /> */}
          </div>
        </div>
        <div className="permit-header-title">
          <span>OCCUPATIONAL PERMIT</span>
        </div>
      </div>
      <div className="permit-body">
        <div className="picture-section">
          <div className="idpicture-box">
            {currentImage ? (
              <img
                src={currentImage}
                alt="ID picture"
                className="custom-image"
              />
            ) : (
              <>
                <span>ID PICTURE</span>
                <span>Passport Size</span>
              </>
            )}
          </div>

          <div className="user-details">
            <div className="text-justify">
              <span>PERMIT NO:</span>
              <span className="text-decoration-underline fw-bold">
                {applicationDetails?.reference_no}
              </span>
            </div>
            <div className="user-details-birth">
              <div className="text-justify">
                <span>DATE OF BIRTH: </span>
                <span className="text-decoration-underline ">
                  {isCompany
                    ? applicationDetails?.corporation_member?.user_details_morph
                        ?.birthdate
                    : applicationDetails?.user?.user_details?.birthdate || ""}
                </span>{" "}
                <span>AGE: </span>
                <span className="text-decoration-underline ">
                  {calculateAge(
                    isCompany
                      ? applicationDetails?.corporation_member
                          ?.user_details_morph?.birthdate
                      : applicationDetails?.user?.user_details?.birthdate || 0,
                  )}
                </span>{" "}
                <span>SEX: </span>
                <span className=" text-decoration-underline">{gender}</span>
              </div>
            </div>
            <div className="text-justify">
              <span>HOME ADDRESS: </span>
              <span className=" text-decoration-underline">
                {isCompany
                  ? applicationDetails?.corporation_member?.user_addresses_morph?.[0]?.full_address?.toUpperCase()
                  : applicationDetails?.user?.user_addresses?.[0]?.full_address?.toUpperCase()}
              </span>
            </div>

            <div>
              <span>COMPANY NAME: </span>
              <span className=" text-decoration-underline fw-bold">
                {isCompany
                  ? applicationDetails?.corporation_member?.user_occupation_details_morph?.company_name?.toUpperCase()
                  : applicationDetails?.user?.user_occupation_details?.company_name?.toUpperCase() ||
                    ""}
              </span>
            </div>

            <div>
              <span>COMPANY ADDRESS: </span>
              <span className=" text-decoration-underline">
                {isCompany
                  ? applicationDetails?.corporation_member?.user_occupation_details_morph?.employeer_address?.toUpperCase()
                  : applicationDetails?.user?.user_occupation_details?.employeer_address?.toUpperCase() ||
                    ""}
              </span>
            </div>
            <div className="occupation-section">
              <span>OCCUPATION: </span>
              <span className=" text-decoration-underline fw-bold">
                {isCompany
                  ? applicationDetails?.corporation_member?.user_occupation_details_morph?.position?.toUpperCase()
                  : applicationDetails?.user?.user_occupation_details?.position?.toUpperCase() ||
                    ""}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="top">
        <p className="fw-bold text-center name-container">
          <span>NAME: </span>
          <span
            className="name"
            style={{
              fontSize: `${getNameFontSize(name)}px`,
            }}
          >
            {name}
          </span>
        </p>

        <div className="mayor">
          <span className="mayor-name">ATTY. LAWRENCE LEMUEL H. FORTUN</span>
          <span>City Mayor</span>
        </div>
        <div className="signatories-container text-center">
          <span className="authority">
            For and by authority of the City Mayor:
          </span>
        </div>

        <div style={{ width: "40px", marginLeft: "7px" }}>
          <QrCodeGenerator specialPermitId={applicationDetails?.id} size={70} />
        </div>
        <div className="signatories">
          <span className="signatories-name">ATTY. MOSHI ARIEL S. CAHOY</span>
          <span>City Government Department Head II</span>
          <span></span>
        </div>
      </div>
      <div className="permit-footer">
        <div className="permit-footer-upper">
          <div className="or-section stamp">
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
                {dateFormat(
                  applicationDetails?.order_of_payment?.payment_detail
                    ?.created_at,
                )}
              </span>
            </div>
          </div>
          <div className="logo-section">
            <img src={butuanOnLogo} className="butuan-on-logo" />
            <span className="fw-bold rev-code">CBPLD.BPLD.P.013.REV03</span>
          </div>
        </div>
        <div>
          <p className="note">
            NOTE: THIS PERMIT IS VALID UNTIL <span>{formatted}</span>
          </p>
        </div>
        {/* <img src={permitFooterLine} className="footer-line" /> */}
      </div>
    </div>
  );
});
OccupationalCertificate.displayName = "OccupationalPermit";
export default OccupationalCertificate;
