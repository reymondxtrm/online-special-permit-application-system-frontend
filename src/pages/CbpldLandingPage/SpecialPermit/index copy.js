import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import bg from "../../../assets/images/cgb-bg.jpg";
import GenericModal from "../Modals/GenericModal";
import MayorsCertificate from "./Forms/MayorsCertificate";
import GoodMoralCertificate from "./Forms/GoodMoralCertificate";
import EventCertificate from "./Forms/EventCertificate";
import MotorcadeCertificate from "./Forms/MotorcadeCertificate";
import ParadeCertificate from "./Forms/ParadeCertificate";
import RecorridaCertificate from "./Forms/RecorridaCertificate";
import UseOfGovernmentProperty from "./Forms/UseOfGovernmentPropertyCertificate";
import OccupationalPermit from "./Forms/OccupationalPermit";
import MayorsCertificateModal from "../Modals/MayorsCertificateModal";
import GoodMoralModal from "../Modals/GoodMoralModal";
import EventModal from "../Modals/EventModal";
import MotorcadeModal from "../Modals/MotorcadeModal";
import ParadeModal from "../Modals/ParadeModal";
import RecorridaModal from "../Modals/RecorridaModal";
import UseOfGovernmentPropertyModal from "../Modals/UseOfGovernmentPropertyModal";
import OccupationalPermitModal from "../Modals/OccupationalPermitModal";

// Reusable PermitCard component
const PermitCard = ({ title, content, onClick }) => (
  <Col sm="3">
    <Card style={styles.card}>
      <CardHeader style={styles.cardHeader}>{title}</CardHeader>
      <CardBody>{content}</CardBody>
      <Button style={styles.button} onClick={onClick}>
        Go to Form
      </Button>
    </Card>
  </Col>
);

function SpecialPermit() {
  const [formModal, setformModal] = useState(false);
  const [mayorsCertificateModal, setmayorsCertificateModal] = useState(false);
  const [goodMoralModal, setgoodMoralModal] = useState(false);
  const [eventModal, seteventModal] = useState(false);
  const [motorcadeModal, setmotorcadeModal] = useState(false);
  const [paradeModal, setparadeModal] = useState(false);
  const [recorridaModal, setrecorridaModal] = useState(false);
  const [useOfGovPropModal, setuseOfGovPropModal] = useState(false);
  const [occupationalPermitModal, setoccupationalPermitModal] = useState(false);

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
        return setoccupationalPermitModal((prevState) => !prevState);
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
      />
      <section
        className="section pt-4 bg-white"
        id="specialPermit"
        style={styles.section}
      >
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Special Permit</div>
                <h4>Special Permit Forms</h4>
              </div>
            </Col>
          </Row>
          <Row>
            <PermitCard
              title={"MAYORS CERTIFICATE"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("MAYORS CERTIFICATE");
              }}
            />
            <PermitCard
              title={"GOOD MORAL"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("GOOD MORAL");
              }}
            />
            <PermitCard
              title={"EVENT"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("EVENT");
              }}
            />
            <PermitCard
              title={"MOTORCADE"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("MOTORCADE");
              }}
            />
            <PermitCard
              title={"PARADE"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("PARADE");
              }}
            />
            <PermitCard
              title={"RECORRIDA"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("RECORRIDA");
              }}
            />
            <PermitCard
              title={"USE OF GOVERNMENT PROPERTY"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("USE OF GOVERNMENT PROPERTY");
              }}
            />
            <PermitCard
              title={"OCCUPATIONAL PERMIT"}
              content={"With supporting text below..."}
              onClick={() => {
                toggleModal("OCCUPATIONAL PERMIT");
              }}
            />
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
}

// Styles object
const styles = {
  section: {
    backgroundPosition: "100%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${bg})`,
    backgroundSize: "100%",
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

export default SpecialPermit;
