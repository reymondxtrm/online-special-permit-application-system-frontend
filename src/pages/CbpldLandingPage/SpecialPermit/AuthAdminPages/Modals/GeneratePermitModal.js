import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "reactstrap";
import ReactToPrint from "react-to-print";
import CertificateFormat from "../../Printables/Certification/CertificateFormat";
import axios from "axios";
import {
  CONDITIONS,
  EVENT_CERT_CONDITIONS,
  MOTORCADE_CERT_CONDITIONS,
  PARADE_CERT_CONDITIONS,
  RECORRIDA_CERT_CONDITIONS,
  USE_OF_GOVERNMENT_PROPERTY_CERT_CONDITIONS,
} from "assets/data/data";
import moment from "moment";
import useGetImage from "hooks/Common/useGetImage";
import RoutePlanViewer from "./Common/RoutePlanViewer";
import useSubmit from "hooks/Common/useSubmit";
let debounce = null;
function GeneratePermitModal({
  openModal,
  toggleModal,
  permitType,
  purpose,
  specialPermitID,
}) {
  const [data, setdata] = useState();
  const componentRef = useRef(null);
  const [firstParagraph, setFirstParagraph] = useState("");
  const [firstParagraphTextArea, setFirstParagraphTextArea] = useState("");
  const [additionalParagraphForWithCase, setAdditionalParagraphForWithCase] =
    useState("");
  const [
    additionalParagraphForWithCaseTextArea,
    setAdditionalParagraphForWithCaseTextArea,
  ] = useState("");
  const [withCase, setwithCase] = useState("");
  const [isCase, setIsCase] = useState(false);
  const [secondParagraph, setSecondParagraph] = useState("");
  const [secondParagraphTextArea, setSecondParagraphTextArea] = useState("");
  const [thirdParagraph, setthirdParagraph] = useState();
  const [conditionsTextArea, setConditionsTextArea] = useState("");
  const [activeParagraph, setActiveParagraph] = useState(null);
  const [representativeName, setRepresentativeName] = useState();
  const { currentImage, getImageHandle, isFetching } = useGetImage();
  const handleSubmit = useSubmit();
  const openFirstColumn = useMemo(() => {
    if (
      permitType === "event" ||
      permitType === "motorcade" ||
      permitType === "parade" ||
      permitType === "recorrida" ||
      permitType === "use_of_government_property"
    ) {
      return true;
    } else {
      return false;
    }
  }, [permitType]);

  useEffect(() => {
    let keys = null;
    switch (permitType) {
      case "event":
        keys = EVENT_CERT_CONDITIONS;
        break;
      case "motorcade":
        keys = MOTORCADE_CERT_CONDITIONS;
        break;
      case "parade":
        keys = PARADE_CERT_CONDITIONS;
        break;
      case "recorrida":
        keys = RECORRIDA_CERT_CONDITIONS;
        break;
      case "use_of_government_property":
        keys = USE_OF_GOVERNMENT_PROPERTY_CERT_CONDITIONS;
        break;
      default:
        keys = null;
        break;
    }

    if (keys) {
      const con = keys?.map((key, index) => {
        if (key === 8) {
          return `${CONDITIONS[key]} ${data?.number_of_participants} units.`;
        }

        if (key === 6) {
          return `${CONDITIONS[key]} ${data?.eventToDate} only.`;
        }
        if (key === 9) {
          return ` ${CONDITIONS[key]} ${data?.name_of_property};`;
        }
        return ` ${CONDITIONS[key]}`;
      });
      setConditionsTextArea(arrayToString(con));
    }
  }, [permitType, data]);

  const conditions = useMemo(() => {
    if (conditionsTextArea) {
      const converted = conditionsTextArea
        .split("\n")
        .map((str) => str.replace(/^\d+\.\s*/, ""));
      return converted;
    }
    return "";
  }, [conditionsTextArea]);

  const arrayToString = (array) => {
    let string = array.map((line, index) => `${index + 1}. ${line}`).join("\n");
    return string;
  };

  function getOrdinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }
  useEffect(() => {
    const date = new Date();
    const day = getOrdinal(date.getDate());
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    setthirdParagraph(
      `Issued this ${day} day of ${month} ${year} at the City Hall Building, Butuan City, Philippines.`,
    );
  }, []);

  useEffect(() => {
    let initial = "";

    if (permitType === "mayors_permit") {
      initial += `This certification is issued upon the request of ${data?.applicant_name} for the`;
    } else if (permitType == "good_moral") {
      initial += `This Certificate of Good Moral Character is issued to ${data?.applicant_name} for:`;
    }

    setSecondParagraph(initial);
    setSecondParagraphTextArea(initial);
  }, [permitType, data]);

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  useEffect(() => {
    if (openModal) {
      axios
        .get("api/admin/get/data/certificate", {
          params: { special_permit_id: specialPermitID },
        })
        .then(
          (res) => {
            setdata(res.data);
          },
          (error) => {
            console.log(error);
          },
        );
    }
  }, [openModal]);
  useEffect(() => {
    if (data?.route_plan) {
      getImageHandle({
        path: data?.route_plan,
        url: "api/admin/attachment",
        showLoader: false,
      });
    }
  }, [data]);

  const concatEventDate = useMemo(() => {
    if (!data?.eventFromDate && !data?.eventToDate) return "";

    const timeFrom = moment(data.event_time_from, "h:mm A").format("h:mm A");
    const timeTo =
      data.event_time_to !== null
        ? moment(data.event_time_to, "h:mm A").format("h:mm A")
        : null;

    if (data.eventFromDate === data.eventToDate) {
      if (timeTo) {
        return `${data.eventFromDate} at ${timeFrom} to ${timeTo}`;
      } else {
        return `${data.eventFromDate} at ${timeFrom}`;
      }
    } else {
      if (timeTo) {
        return `${data.eventFromDate} at ${timeFrom} to ${data.eventToDate}  ${timeTo}`;
      } else {
        return `${data.eventFromDate} at ${timeFrom} to ${data.eventToDate} `;
      }
    }
  }, [data]);

  const handleBeforePrint = async () => {
    const originalTitle = document.title;
    document.title = data?.application_reference;
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  };
  const handleAfterPrint = () => {
    if (!data) return;

    if (data.printed_at !== null) return;
    try {
      axios.post("api/admin/permit-printed", {
        special_permit_application_id: specialPermitID,
      });
    } catch (error) {
      console.error("Failed to mark permit as printed:", error);
    }
  };

  const addNameToActiveParagraph = () => {
    if (data?.applicant_name && activeParagraph) {
      if (activeParagraph === "first") {
        setFirstParagraph(
          (prevText) =>
            prevText +
            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.applicant_name?.toUpperCase()}</span>`,
        );
        setFirstParagraphTextArea(
          (prevText) => prevText + data?.applicant_name,
        );
      } else if (activeParagraph === "second") {
        setSecondParagraph(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.applicant_name?.toUpperCase()}</span>`,
        );
        setSecondParagraphTextArea(
          (prevText) => prevText + data?.applicant_name,
        );
      } else if (activeParagraph === "additionalForWithCase") {
        setAdditionalParagraphForWithCase(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.applicant_name?.toUpperCase()}</span>`,
        );
        setAdditionalParagraphForWithCaseTextArea(
          (prevText) => prevText + data?.applicant_name,
        );
      }
    }
  };

  const addOrgaizationToActiveParagraph = () => {
    if (data?.applicant_name && activeParagraph) {
      if (activeParagraph === "first") {
        setFirstParagraph(
          (prevText) =>
            prevText +
            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.requestor_name.toUpperCase()}</span>`,
        );
        setFirstParagraphTextArea(
          (prevText) => prevText + data?.requestor_name,
        );
      } else if (activeParagraph === "second") {
        setSecondParagraph(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.requestor_name.toUpperCase()}</span>`,
        );
        setSecondParagraphTextArea(
          (prevText) => prevText + data?.requestor_name,
        );
      } else if (activeParagraph === "additionalForWithCase") {
        setAdditionalParagraphForWithCase(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.requestor_name.toUpperCase()}</span>`,
        );
        setAdditionalParagraphForWithCaseTextArea(
          (prevText) => prevText + data?.requestor_name,
        );
      }
    }
  };

  const addDateToActiveParagraph = () => {
    if (data?.applicant_name && activeParagraph) {
      if (activeParagraph === "first") {
        setFirstParagraph(
          (prevText) =>
            prevText +
            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${concatEventDate}</span>`,
        );
        setFirstParagraphTextArea((prevText) => prevText + concatEventDate);
      } else if (activeParagraph === "second") {
        setSecondParagraph(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${concatEventDate}</span>`,
        );
        setSecondParagraphTextArea((prevText) => prevText + concatEventDate);
      } else if (activeParagraph === "addtionalForWithCase") {
        setAdditionalParagraphForWithCase(
          (prevText) =>
            prevText +
            ` <span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${concatEventDate}</span>`,
        );
        setAdditionalParagraphForWithCaseTextArea(
          (prevText) => prevText + concatEventDate,
        );
      }
    }
  };
  const addPropertyToActiveTab = () => {
    if (data?.applicant_name && activeParagraph) {
      if (activeParagraph === "first") {
        setFirstParagraph(
          (prevText) =>
            prevText +
            `<span style="fontFamily: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${data?.name_of_property}</span>`,
        );
        setFirstParagraphTextArea(
          (prevText) => prevText + data?.name_of_property,
        );
      } else if (activeParagraph === "second") {
        setSecondParagraph(
          (prevText) =>
            prevText +
            ` <span style="fontFamily: 'Golos Text', sans-serif, serif; font-weight: bold;  text-decoration: underline;">${data?.name_of_property}</span>`,
        );
        setSecondParagraphTextArea(
          (prevText) => prevText + data?.name_of_property,
        );
      }
    }
  };
  const addRepresentativeToActiveParagraph = () => {
    if (representativeName) {
      if (activeParagraph === "first") {
        setFirstParagraph(
          (prevText) =>
            prevText +
            `<span style="fontFamily: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${representativeName}</span>`,
        );
        setFirstParagraphTextArea(
          (prevText) => prevText + `${representativeName}`,
        );
      } else if (activeParagraph === "second") {
        setSecondParagraph(
          (prevText) =>
            prevText +
            `<span style="fontFamily: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${representativeName}</span>`,
        );
        setSecondParagraphTextArea(
          (prevText) => prevText + `${representativeName}`,
        );
      }
    }
  };
  const addAddressToActiveParagraph = () => {
    if (data?.applicant_name && activeParagraph) {
      if (activeParagraph === "first") {
        setFirstParagraph((prevText) => prevText + `${data?.address}`);
        setFirstParagraphTextArea((prevText) => prevText + `${data?.address}`);
      } else if (activeParagraph === "second") {
        setSecondParagraph((prevText) => prevText + `${data?.address}`);
        setSecondParagraphTextArea((prevText) => prevText + `${data?.address}`);
      } else if (activeParagraph === "additionalForWithCase") {
        setAdditionalParagraphForWithCase(
          (prevText) => prevText + `${data?.address}`,
        );
        setAdditionalParagraphForWithCaseTextArea(
          (prevText) => prevText + `${data?.address}`,
        );
      }
    }
  };

  const handleFocus = (paragraph) => {
    setActiveParagraph(paragraph);
  };

  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      fade={true}
      backdrop="static"
      size={openFirstColumn ? "none" : "xl"}
      fullscreen={openFirstColumn}
      className="modal-dialog-centered"
      style={{ maxWidth: !openFirstColumn ? "1400px" : null }}
      unmountOnClose
      onClosed={() => {
        setIsCase(false);
      }}
    >
      <ModalHeader toggle={toggleModal}>
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: "0",
            padding: "0",
            color: "#368be0",
          }}
        >
          {"GENERATE PERMIT"}
        </p>
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto" }}>
        <Row>
          {openFirstColumn && <RoutePlanViewer currentImage={currentImage} />}

          <Col md={openFirstColumn ? 3 : 5}>
            {permitType === "good_moral" && (
              <Row>
                <div>
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "5px 5px 15px ",
                      height: "auto",
                    }}
                  >
                    <CardHeader
                      style={{
                        backgroundColor: "#0d6dfc",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12pt",
                        letterSpacing: ".2rem",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      SPECIAL CONDITIONS
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <div className="d-flex gap-2 align-items-center">
                          <Input
                            type="checkbox"
                            style={{ width: "30px", height: "30px" }}
                            onChange={(e) => setIsCase(e.target.checked)}
                          ></Input>
                          <Label
                            style={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              margin: "0px",
                            }}
                          >
                            WITH CASE
                          </Label>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Row>
            )}
            {isCase && (
              <Row>
                <div>
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "5px 5px 15px ",
                      height: "auto",
                    }}
                  >
                    <CardHeader
                      style={{
                        backgroundColor: "#0d6dfc",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12pt",
                        letterSpacing: ".2rem",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Additional Paragraph For With Cases
                    </CardHeader>
                    <CardBody>
                      <textarea
                        id="additionalParagraphForWithCase"
                        value={additionalParagraphForWithCaseTextArea}
                        onChange={(e) => {
                          const plainText = e.target.value;
                          setAdditionalParagraphForWithCaseTextArea(plainText);

                          const applicantName = data?.applicant_name?.trim();
                          const requestorName = data?.requestor_name?.trim();
                          const propertyName = data?.name_of_property?.trim();
                          const eventDate = concatEventDate;
                          let styledHTML = plainText;
                          if (applicantName) {
                            styledHTML = styledHTML.replace(
                              new RegExp(applicantName, "g"),
                              `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${applicantName}</span>`,
                            );
                          }
                          if (representativeName) {
                            styledHTML = styledHTML.replace(
                              new RegExp(representativeName, "g"),
                              `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${representativeName}</span>`,
                            );
                          }

                          if (requestorName) {
                            styledHTML = styledHTML.replace(
                              new RegExp(requestorName, "g"),
                              `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${requestorName}</span>`,
                            );
                          }
                          if (propertyName) {
                            styledHTML = styledHTML.replace(
                              new RegExp(propertyName, "g"),
                              `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${propertyName}</span>`,
                            );
                          }

                          if (eventDate) {
                            const safeEventDate = escapeRegex(eventDate);
                            styledHTML = styledHTML.replace(
                              new RegExp(safeEventDate, "g"),
                              `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${eventDate}</span>`,
                            );
                          }

                          setAdditionalParagraphForWithCase(styledHTML);
                        }}
                        onFocus={() => handleFocus("additionalForWithCase")}
                        placeholder="Start typing..."
                        style={{
                          width: "100%",
                          height: "100px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          fontFamily: "Cambria, serif",
                          fontWeight: "bold",
                          fontSize: "13pt",
                        }}
                      />

                      <Button
                        // color="primary"
                        onClick={addNameToActiveParagraph}
                        style={{
                          marginTop: "10px",
                          marginBottom: "15px",
                          padding: "10px",
                          fontSize: "14px",
                          backgroundColor: "#0d6dfc",
                          // backgroundColor: "#144071",
                        }}
                      >
                        Add Name
                      </Button>
                      {(permitType === "mayors_permit" ||
                        permitType === "good_moral") && (
                        <Button
                          onClick={addAddressToActiveParagraph}
                          style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            padding: "10px",
                            fontSize: "14px",
                            // backgroundColor: "#144071",
                            backgroundColor: "#0d6dfc",

                            marginLeft: "10px",
                          }}
                        >
                          Add Address
                        </Button>
                      )}
                      {/* {(permitType === "event" ||
                      permitType === "motorcade" ||
                      permitType === "parade" ||
                      permitType === "recorrida" ||
                      permitType === "use_of_government_property") && (
                      <>
                        <Button
                          onClick={addOrgaizationToActiveParagraph}
                          style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            padding: "10px",
                            fontSize: "14px",
                            backgroundColor: "#0d6dfc",

                            marginLeft: "10px",
                          }}
                        >
                          Add Organization
                        </Button>
                        <Button
                          onClick={addDateToActiveParagraph}
                          style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            padding: "10px",
                            fontSize: "14px",
                            // backgroundColor: "#144071",
                            backgroundColor: "#0d6dfc",

                            marginLeft: "10px",
                          }}
                        >
                          Add Date
                        </Button>
                        {permitType === "use_of_government_property" && (
                          <Button
                            onClick={addPropertyToActiveTab}
                            style={{
                              marginTop: "10px",
                              marginBottom: "15px",
                              padding: "10px",
                              fontSize: "14px",
                              // backgroundColor: "#144071",
                              backgroundColor: "#0d6dfc",

                              marginLeft: "10px",
                            }}
                          >
                            Add Property
                          </Button>
                        )}
                        <div className="d-flex justify-content-start">
                          <Input
                            type="text"
                            onChange={(e) => {
                              setRepresentativeName(e.target.value);
                            }}
                            style={{
                              height: "57px",
                              marginTop: "10px",
                              fontSize: "14px",
                            }}
                          />
                          <Button
                            onClick={addRepresentativeToActiveParagraph}
                            style={{
                              marginTop: "10px",
                              marginBottom: "15px",
                              // padding: "10px",
                              fontSize: "14px",
                              backgroundColor: "#0d6dfc",
                              marginLeft: "10px",
                            }}
                          >
                            Add Representative
                          </Button>
                        </div>
                      </>
                    )} */}
                    </CardBody>
                  </Card>
                </div>
              </Row>
            )}

            <Row>
              <div>
                <Card
                  style={{
                    borderRadius: "10px",
                    boxShadow: "5px 5px 15px ",
                    height: "auto",
                  }}
                >
                  <CardHeader
                    style={{
                      backgroundColor: "#0d6dfc",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12pt",
                      letterSpacing: ".2rem",
                      minHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    FIRST PARAGRAPH
                  </CardHeader>
                  <CardBody>
                    <textarea
                      id="firstParagraph"
                      value={firstParagraphTextArea}
                      onChange={(e) => {
                        const plainText = e.target.value;
                        setFirstParagraphTextArea(plainText);

                        const applicantName = data?.applicant_name?.trim();
                        const requestorName = data?.requestor_name?.trim();
                        const propertyName = data?.name_of_property?.trim();
                        const eventDate = concatEventDate;
                        let styledHTML = plainText;
                        if (applicantName) {
                          styledHTML = styledHTML.replace(
                            new RegExp(applicantName, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${applicantName}</span>`,
                          );
                        }
                        if (representativeName) {
                          styledHTML = styledHTML.replace(
                            new RegExp(representativeName, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${representativeName}</span>`,
                          );
                        }

                        if (requestorName) {
                          styledHTML = styledHTML.replace(
                            new RegExp(requestorName, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${requestorName}</span>`,
                          );
                        }
                        if (propertyName) {
                          styledHTML = styledHTML.replace(
                            new RegExp(propertyName, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${propertyName}</span>`,
                          );
                        }

                        if (eventDate) {
                          const safeEventDate = escapeRegex(eventDate);
                          styledHTML = styledHTML.replace(
                            new RegExp(safeEventDate, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold;  text-decoration: underline;">${eventDate}</span>`,
                          );
                        }

                        setFirstParagraph(styledHTML);
                      }}
                      onFocus={() => handleFocus("first")}
                      placeholder="Start typing..."
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontFamily: "Cambria, serif",
                        fontWeight: "bold",
                        fontSize: "13pt",
                      }}
                    />

                    <Button
                      // color="primary"
                      onClick={addNameToActiveParagraph}
                      style={{
                        marginTop: "10px",
                        marginBottom: "15px",
                        padding: "10px",
                        fontSize: "14px",
                        backgroundColor: "#0d6dfc",
                        // backgroundColor: "#144071",
                      }}
                    >
                      Add Name
                    </Button>
                    {(permitType === "mayors_permit" ||
                      permitType === "good_moral") && (
                      <Button
                        onClick={addAddressToActiveParagraph}
                        style={{
                          marginTop: "10px",
                          marginBottom: "15px",
                          padding: "10px",
                          fontSize: "14px",
                          // backgroundColor: "#144071",
                          backgroundColor: "#0d6dfc",

                          marginLeft: "10px",
                        }}
                      >
                        Add Address
                      </Button>
                    )}
                    {(permitType === "event" ||
                      permitType === "motorcade" ||
                      permitType === "parade" ||
                      permitType === "recorrida" ||
                      permitType === "use_of_government_property") && (
                      <>
                        <Button
                          onClick={addOrgaizationToActiveParagraph}
                          style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            padding: "10px",
                            fontSize: "14px",
                            backgroundColor: "#0d6dfc",

                            marginLeft: "10px",
                          }}
                        >
                          Add Organization
                        </Button>
                        <Button
                          onClick={addDateToActiveParagraph}
                          style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            padding: "10px",
                            fontSize: "14px",
                            // backgroundColor: "#144071",
                            backgroundColor: "#0d6dfc",

                            marginLeft: "10px",
                          }}
                        >
                          Add Date
                        </Button>
                        {permitType === "use_of_government_property" && (
                          <Button
                            onClick={addPropertyToActiveTab}
                            style={{
                              marginTop: "10px",
                              marginBottom: "15px",
                              padding: "10px",
                              fontSize: "14px",
                              // backgroundColor: "#144071",
                              backgroundColor: "#0d6dfc",

                              marginLeft: "10px",
                            }}
                          >
                            Add Property
                          </Button>
                        )}
                        <div className="d-flex justify-content-start">
                          <Input
                            type="text"
                            onChange={(e) => {
                              setRepresentativeName(e.target.value);
                            }}
                            style={{
                              height: "57px",
                              marginTop: "10px",
                              fontSize: "14px",
                            }}
                          />
                          <Button
                            onClick={addRepresentativeToActiveParagraph}
                            style={{
                              marginTop: "10px",
                              marginBottom: "15px",
                              // padding: "10px",
                              fontSize: "14px",
                              backgroundColor: "#0d6dfc",
                              marginLeft: "10px",
                            }}
                          >
                            Add Representative
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>
            </Row>

            <Row>
              {(permitType === "good_moral" ||
                permitType === "mayors_permit") && (
                <div>
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "5px 5px 15px ",
                      height: "auto",
                    }}
                  >
                    <CardHeader
                      style={{
                        backgroundColor: "#0d6dfc",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12pt",
                        letterSpacing: ".2rem",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      CASE
                    </CardHeader>
                    <CardBody>
                      <textarea
                        id="withCase"
                        value={withCase} // Set the text from state
                        onChange={(e) => setwithCase(e.target.value)} // Allow the user to continue typing
                        onFocus={() => handleFocus("first")} // Track focus on the first paragraph
                        placeholder="Start typing..."
                        style={{
                          width: "100%",
                          height: "100px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          fontFamily: "Cambria, serif", // Default font for the rest of the text
                          fontWeight: "bold",
                          fontSize: "13pt", // Default font size for Cambria
                        }}
                      />
                    </CardBody>
                  </Card>
                </div>
              )}
            </Row>
            <Row>
              <div>
                <Card
                  style={{
                    borderRadius: "10px",
                    boxShadow: "5px 5px 15px ",
                    height: "auto",
                  }}
                >
                  <CardHeader
                    style={{
                      backgroundColor: "#0d6dfc",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12pt",
                      letterSpacing: ".2rem",
                      minHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    {permitType === "good_moral" ||
                    permitType === "mayors_permit"
                      ? "SECOND PARAGRAPH"
                      : "ROUTE"}
                  </CardHeader>
                  <CardBody>
                    <textarea
                      id="secondParagraph"
                      value={secondParagraphTextArea}
                      onChange={(e) => {
                        const plainText = e.target.value;
                        setSecondParagraphTextArea(plainText);

                        const applicantName = data?.applicant_name?.trim();
                        if (applicantName) {
                          const styledHTML = plainText.replace(
                            new RegExp(applicantName, "g"),
                            `<span style="font-family: 'Golos Text', sans-serif; font-weight: bold; text-decoration: underline;">${applicantName}</span>`,
                          );
                          setSecondParagraph(styledHTML);
                        } else {
                          setSecondParagraph(plainText);
                        }
                      }} // Allow the user to continue typing
                      onFocus={() => handleFocus("second")}
                      placeholder="Start typing..."
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontFamily: "Cambria, serif", // Default font for the rest of the text
                        fontWeight: "bold",
                        fontSize: "13pt", // Default font size for Cambria
                      }}
                    />
                    <Button
                      // color="primary"
                      onClick={addNameToActiveParagraph}
                      style={{
                        marginTop: "10px",
                        marginBottom: "15px",
                        padding: "10px",
                        fontSize: "14px",
                        backgroundColor: "#0d6dfc",
                        // backgroundColor: "#144071",
                      }}
                    >
                      Add Name
                    </Button>
                    <Button
                      onClick={addAddressToActiveParagraph}
                      style={{
                        marginTop: "10px",
                        marginBottom: "15px",
                        padding: "10px",
                        fontSize: "14px",
                        // backgroundColor: "#144071",
                        backgroundColor: "#0d6dfc",
                        marginLeft: "10px",
                      }}
                    >
                      Add Address
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </Row>

            <Row>
              <div>
                <Card
                  style={{
                    borderRadius: "10px",
                    boxShadow: "5px 5px 15px ",
                    height: "auto",
                  }}
                >
                  <CardHeader
                    style={{
                      backgroundColor: "#0d6dfc",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12pt",
                      letterSpacing: ".2rem",
                      minHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    THIRD PARAGRAPH
                  </CardHeader>
                  <CardBody>
                    <textarea
                      id="thirdParagraph"
                      value={thirdParagraph} // Set the text from state
                      onChange={(e) => setthirdParagraph(e.target.value)} // Allow the user to continue typing
                      onFocus={() => handleFocus("third")} // Track focus on the first paragraph
                      placeholder="Start typing..."
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontFamily: "Cambria, serif",
                        fontWeight: "bold",
                        fontSize: "13pt",
                      }}
                    />
                  </CardBody>
                </Card>
              </div>
            </Row>
            {openFirstColumn && (
              <Row>
                <div>
                  <Card
                    style={{
                      borderRadius: "10px",
                      boxShadow: "5px 5px 15px ",
                      height: "auto",
                    }}
                  >
                    <CardHeader
                      style={{
                        backgroundColor: "#0d6dfc",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12pt",
                        letterSpacing: ".2rem",
                        minHeight: "61px",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Conditions
                    </CardHeader>
                    <CardBody>
                      <textarea
                        id="conditions"
                        value={conditionsTextArea} // Set the text from state
                        onChange={(e) => setConditionsTextArea(e.target.value)} // Allow the user to continue typing
                        onFocus={() => handleFocus("conditions")} // Track focus on the first paragraph
                        placeholder="Start typing..."
                        style={{
                          width: "100%",
                          height: "300px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          fontFamily: "Cambria, serif",
                          fontWeight: "bold",
                          fontSize: "13pt",
                        }}
                      />
                    </CardBody>
                  </Card>
                </div>
              </Row>
            )}
          </Col>
          <Col md={openFirstColumn ? 5 : 7}>
            <CertificateFormat
              ref={componentRef}
              permitType={permitType} // Dynamic permitType
              firstParagraph={firstParagraph} // Pass the first paragraph
              withCase={withCase}
              secondParagraph={secondParagraph} // Pass the second paragraph
              thirdParagraph={thirdParagraph}
              address={data?.address} // Pass the second paragraph
              purpose={purpose}
              referenceNo={data?.application_reference}
              dateIssued={data?.created_at}
              ORDate={data?.date_of_payment}
              approvedBy={data?.approved_by}
              orNo={data?.or_no}
              paidAmounmt={data?.paid_amount}
              exemptedCases={data?.exempted_case_name}
              ordinance={data?.exempted_case_ordinance}
              conditions={conditions}
              eventName={data?.event_name}
              specialPermitApplicationId={data?.special_permit_application_id}
              isCase={isCase}
              additionalParagraphForWithCase={additionalParagraphForWithCase}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <ReactToPrint
          trigger={() => <Button color="primary">Print</Button>}
          content={() => componentRef.current}
          onBeforePrint={handleBeforePrint}
          onAfterPrint={handleAfterPrint}
        />
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default GeneratePermitModal;
