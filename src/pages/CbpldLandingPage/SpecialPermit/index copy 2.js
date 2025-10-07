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

// Reusable PermitCard component
const PermitCard = ({ title, content, buttonText, onClick }) => (
  <Col sm="3">
    <Card style={styles.card}>
      <CardHeader style={styles.cardHeader}>{title}</CardHeader>
      <CardBody>{content}</CardBody>
      <Button style={styles.button} onClick={onClick}>
        {buttonText}
      </Button>
    </Card>
  </Col>
);

// Function to determine which form to show based on permitType

function SpecialPermit() {
  const [permitType, setpermitType] = useState("");
  const [formModal, setformModal] = useState(false);
  console.log(formModal);
  const toggleModal = () => {
    setformModal((prevState) => !prevState);
  };

  const renderForm = () => {
    switch (permitType) {
      case "MAYORS CERTIFICATE":
        return <MayorsCertificate title={"MAYOR'S CERTIFICATE"} />;
      case "GOOD MORAL":
        return <GoodMoralCertificate title={"GOOD MORAL"} />;
      case "EVENT":
        return <EventCertificate title={"EVENT"} />;
      case "MOTORCADE":
        return <MotorcadeCertificate title={"MOTORCADE"} />;
      case "PARADE":
        return <ParadeCertificate title={"PARADE"} />;
      case "RECORRIDA":
        return <RecorridaCertificate title={"RECORRIDA"} />;
      case "USE OF GOVERNMENT PROPERTY":
        return <UseOfGovernmentProperty title={"USE OF GOVERNMENT PROPERTY"} />;
      case "OCCUPATIONAL PERMIT":
        return <OccupationalPermit title={"OCCUPATIONAL PERMIT"} />;
      default:
        return <p>Select a permit type to see the form.</p>;
    }
  };

  const permitCards = [
    {
      title: "MAYORS CERTIFICATE",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "GOOD MORAL",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "EVENT",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "MOTORCADE",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "PARADE",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "RECORRIDA",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "USE OF GOVERNMENT PROPERTY",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
    {
      title: "OCCUPATIONAL PERMIT",
      content: "With supporting text below...",
      buttonText: "Go to Form",
    },
  ];

  return (
    <React.Fragment>
      <GenericModal
        openModal={formModal}
        toggleModal={toggleModal}
        title={permitType}
      >
        {renderForm()}
      </GenericModal>
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
            {permitCards.map((card, index) => (
              <PermitCard
                key={index}
                title={card.title}
                content={card.content}
                buttonText={card.buttonText}
                onClick={() => {
                  toggleModal();
                  setpermitType(card.title);
                }}
              />
            ))}
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
