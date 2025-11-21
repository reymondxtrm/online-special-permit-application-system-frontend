import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logo from "../../../../../assets/images/cgbLogo.png";
import OccupationalCertificate from "../../Printables/OccupationalCertificate";
import ReactToPrint from "react-to-print";

export default function GenerateOccupationalPermitModal({
  applicationDetails,
  openModal,
  toggle,
}) {
  const componentRef = useRef();
  const handleDefaultFileName = "sample";

  return (
    <Modal toggle={toggle} isOpen={openModal}>
      <ModalHeader toggle={toggle}>
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
          Generate Occupational Permit
        </p>
      </ModalHeader>
      <ModalBody>
        <OccupationalCertificate
          applicationDetails={applicationDetails}
          ref={componentRef}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-2">
          <ReactToPrint
            trigger={() => <Button color="primary">Print</Button>}
            content={() => componentRef.current}
            onBeforePrint={() => (document.title = "Occupational Permit")}
          />
          <Button color={"danger"} onClick={() => toggle()}>
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
