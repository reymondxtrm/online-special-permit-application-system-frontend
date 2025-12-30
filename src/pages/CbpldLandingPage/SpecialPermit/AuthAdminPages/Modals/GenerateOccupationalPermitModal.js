import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logo from "../../../../../assets/images/cgbLogo.png";
import OccupationalCertificate from "../../Printables/OccupationalCertificate";
import ReactToPrint from "react-to-print";

export default function GenerateOccupationalPermitModal({
  applicationID,
  openModal,
  toggle,
}) {
  const componentRef = useRef();
  const handleDefaultFileName = "sample";
  const [applicationDetails, setApplicationDetails] = useState(null);

  useEffect(() => {
    if (applicationID) {
      const fetchData = async () => {
        try {
          const response = await axios({
            method: "GET",
            url: "api/admin/get-request-form-data",
            params: { id: applicationID },
          });
          setApplicationDetails(response.data);
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchData();
    }
  }, [applicationID]);
  
  const isCompany = applicationDetails?.user?.account_type === "company";
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
