import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import bg from "../../../../../assets/images/cgb-bg.jpg";
import MayorsCertificateModal from "../../../Modals/MayorsCertificateModal";
import GoodMoralModal from "../../../Modals/GoodMoralModal";
import EventModal from "../../../Modals/EventModal";
import MotorcadeModal from "../../../Modals/MotorcadeModal";
import ParadeModal from "../../../Modals/ParadeModal";
import RecorridaModal from "../../../Modals/RecorridaModal";
import UseOfGovernmentPropertyModal from "../../../Modals/UseOfGovernmentPropertyModal";
import OccupationalPermitModal from "../../../Modals/OccupationalPermitModal";
import { useSelector } from "react-redux";
import CompanyOccupationalPermitModal from "pages/CbpldLandingPage/Modals/CompanyOccupationalPermitModal";

const PermitCard = ({ title, content, onClick, isDisabled }) => {
  document.title = "Email Verification";
  const popoverId = `permitHelp-${title.replace(/\s+/g, "-")}`;

  let info = "";
  switch (title) {
    case "MAYORS CERTIFICATE":
      info =
        "Certificate issued by the City Mayor which confirms the residency of an individual and others.";
      break;
    case "CERTIFICATE OF GOOD MORAL CHARACTER":
      info =
        "Clearance issued by the City Mayor which shall serve as a proof of good moral character of an individual as required by a public / private entity for employment purposes.";
      break;
    case "MOTORCADE":
      info =
        "Procession or convoy of vehicles, typically consisting of motor vehicles.";
      break;
    case "PARADE":
      info = "Public procession or organized march.";
      break;
    case "RECORRIDA":
      info =
        "Activity undertaken by a group of persons using mobile platforms.";
      break;
    case "EVENT":
      info =
        "Event Permit issued by the City Mayor granting authority to an individual, organization, or group to conduct an event within the city’s jurisdiction. This permit ensures that the planned activity complies with local laws, public safety regulations, and community standards, and is required for events such as celebrations, programs, gatherings, or similar activities.";
      break;
    case "USE OF GOVERNMENT PROPERTY":
      info =
        "Use of Government Property Permit issued by the City Mayor authorizing the temporary use of government-owned property or facilities for an approved purpose, subject to applicable regulations.";
      break;
    case "OCCUPATIONAL PERMIT":
      info =
        "Occupational Permit issued by the City Mayor authorizing an individual to engage in a specific occupation or profession within the city, in compliance with local laws and regulations.";
      break;
    default:
      info = "";
  }

  return (
    <Col sm="3">
      <Card style={styles.card}>
        <CardHeader
          style={{
            ...styles.cardHeader,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              flex: 1,
              textAlign: "left",
              lineHeight: "1.2",
            }}
          >
            {title}
          </span>
          <i
            id={popoverId}
            className="mdi mdi-head-question-outline fs-3"
            style={{
              cursor: "pointer",
              textDecoration: "none",
              marginLeft: "auto",
              borderBottom: "none",
              lineHeight: 1,
            }}
          />

          <UncontrolledPopover
            placement="bottom"
            target={popoverId}
            trigger="hover"
          >
            <PopoverHeader>
              <span className="text-primary">What is this?</span>
            </PopoverHeader>
            <PopoverBody>{info}</PopoverBody>
          </UncontrolledPopover>
        </CardHeader>

        <CardBody>{content}</CardBody>

        <Button style={styles.button} onClick={onClick} disabled={isDisabled}>
          Go to Form
        </Button>
      </Card>
    </Col>
  );
};

function Services() {
  const [formModal, setformModal] = useState(false);
  const [mayorsCertificateModal, setmayorsCertificateModal] = useState(false);
  const [goodMoralModal, setgoodMoralModal] = useState(false);
  const [eventModal, seteventModal] = useState(false);
  const [motorcadeModal, setmotorcadeModal] = useState(false);
  const [paradeModal, setparadeModal] = useState(false);
  const [recorridaModal, setrecorridaModal] = useState(false);
  const [useOfGovPropModal, setuseOfGovPropModal] = useState(false);
  const [occupationalPermitModal, setoccupationalPermitModal] = useState(false);
  const [
    companyOccupationApplicationModal,
    setCompanyOccupationalApplicationModal,
  ] = useState(false);
  const user = useSelector((state) => state.user);

  const toggleModal = (permitType) => {
    switch (permitType) {
      case "MAYORS CERTIFICATE":
        return setmayorsCertificateModal((prevState) => !prevState);
      case "GOOD MORAL":
        return setgoodMoralModal((prevState) => !prevState);
      case "EVENT":
        return seteventModal((prevState) => !prevState);
      case "MOTORCADE":
        return setmotorcadeModal((prevState) => !prevState);
      case "PARADE":
        return setparadeModal((prevState) => !prevState);
      case "RECORRIDA":
        return setrecorridaModal((prevState) => !prevState);
      case "USE OF GOVERNMENT PROPERTY":
        return setuseOfGovPropModal((prevState) => !prevState);
      case "OCCUPATIONAL PERMIT":
        if (user.accountType === "individual") {
          return setoccupationalPermitModal((prevState) => !prevState);
        } else {
          return setCompanyOccupationalApplicationModal((prev) => !prev);
        }
      default:
        return <p>Select a permit type to see the form.</p>;
    }
  };

  return (
    <React.Fragment>
      <MayorsCertificateModal
        openModal={mayorsCertificateModal}
        toggleModal={() => toggleModal("MAYORS CERTIFICATE")}
      />
      <GoodMoralModal
        openModal={goodMoralModal}
        toggleModal={() => toggleModal("GOOD MORAL")}
      />
      <EventModal
        openModal={eventModal}
        toggleModal={() => toggleModal("EVENT")}
      />

      <MotorcadeModal
        openModal={motorcadeModal}
        toggleModal={() => toggleModal("MOTORCADE")}
      />

      <ParadeModal
        openModal={paradeModal}
        toggleModal={() => toggleModal("PARADE")}
      />

      <RecorridaModal
        openModal={recorridaModal}
        toggleModal={() => toggleModal("RECORRIDA")}
      />

      <UseOfGovernmentPropertyModal
        openModal={useOfGovPropModal}
        toggleModal={() => toggleModal("USE OF GOVERNMENT PROPERTY")}
      />

      <OccupationalPermitModal
        openModal={occupationalPermitModal}
        toggleModal={() => toggleModal("OCCUPATIONAL PERMIT")}
        mode="create"
        title="Create Occupational Permit"
        submitUrl="api/client/single-occupational-permit-application"
        fetchUrl="api/client/get-user-occupation-details"
      />
      <CompanyOccupationalPermitModal
        isOpen={companyOccupationApplicationModal}
        toggleModal={() => toggleModal("OCCUPATIONAL PERMIT")}
      />
      <div className="page-content" style={styles.section}>
        <Container fluid>
          <Breadcrumbs title="Services" breadcrumbItem="Application Forms" />
          <Row>
            <Col xs="12">
              <Card style={styles.section}>
                <CardBody>
                  <Container>
                    <Row>
                      <Col lg="12"></Col>
                    </Row>

                    <Row style={{ paddingTop: "90px" }}>
                      {user.accountType === "individual" && (
                        <>
                          <PermitCard
                            title={"MAYORS CERTIFICATE"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("MAYORS CERTIFICATE");
                            }}
                          />
                          <PermitCard
                            title={"CERTIFICATE OF GOOD MORAL CHARACTER"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("GOOD MORAL");
                            }}
                          />
                          <PermitCard
                            title={"EVENT"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("EVENT");
                            }}
                          />
                          <PermitCard
                            title={"MOTORCADE"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("MOTORCADE");
                            }}
                          />
                          <PermitCard
                            title={"PARADE"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("PARADE");
                            }}
                          />
                          <PermitCard
                            title={"RECORRIDA"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("RECORRIDA");
                            }}
                          />
                          <PermitCard
                            title={"USE OF GOVERNMENT PROPERTY"}
                            isDisabled={false}
                            content={"Click go to Form to Apply..."}
                            onClick={() => {
                              toggleModal("USE OF GOVERNMENT PROPERTY");
                            }}
                          />
                        </>
                      )}

                      <PermitCard
                        title={"OCCUPATIONAL PERMIT"}
                        isDisabled={false}
                        content={"Click go to Form to Apply..."}
                        onClick={() => {
                          toggleModal("OCCUPATIONAL PERMIT");
                        }}
                      />
                    </Row>
                  </Container>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

const styles = {
  section: {
    backgroundPosition: "100%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${bg})`,
    backgroundSize: "100%",
    vh: "100%",
  },
  card: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#0d6dfc",
    color: "white",
    fontWeight: "bold",
    letterSpacing: ".2rem",
    minHeight: "60px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#144071",
  },
};

export default Services;
