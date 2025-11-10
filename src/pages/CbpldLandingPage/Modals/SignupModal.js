import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import IndividualRegistrationForm from "../SpecialPermit/Forms/IndividualRegistrationForm";
import CompanyRegistrationForm from "../SpecialPermit/Forms/CompanyRegistrationForm";
import axios from "axios";

function SignupModal({ openModal, toggleModal, props }) {
  const [brangaysOptions, setBarangaysOptions] = useState();
  const [selectedType, setSelectedType] = useState("individual");
  useEffect(() => {
    if (openModal) {
      axios.get("api/geolocation/caraga").then(
        (res) => {
          const barangays = res.data.region.provinces
            .find((item) => item.name === "Agusan del Norte")
            .cities.find((item) => item.name === "City of Butuan ").barangays;

          const uniqueBarangays = [];
          const seen = new Set();
          for (const item of barangays) {
            if (!seen.has(item.psgc_id)) {
              seen.add(item.psgc_id);
              uniqueBarangays.push(item);
            }
          }
          const options = uniqueBarangays.map((item) => {
            return { value: item.barangay_id, label: item.name };
          });
          setBarangaysOptions(options);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [openModal]);

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="xl"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
        }}
        unmountOnClose
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
            {"SIGNUP"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Row
            style={{
              backgroundColor: "#F2F2F2",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <Col md="6">
              <div
                onClick={() => setSelectedType("individual")}
                style={{
                  width: "100%",
                  height: "100px",
                  backgroundColor: "#1bb7cb",
                  borderRadius: "15px",
                  border:
                    selectedType === "individual"
                      ? "3px solid #fff"
                      : "2px solid #fff",
                  boxShadow:
                    selectedType === "individual"
                      ? "0px 8px 20px rgba(27,183,203,0.65)"
                      : "0px 3px 10px rgba(27,183,203,0.35)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                  transform:
                    selectedType === "individual" ? "scale(1.04)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== "individual") {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0px 8px 20px rgba(27,183,203,0.55)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== "individual") {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0px 3px 10px rgba(27,183,203,0.35)";
                  }
                }}
              >
                <i
                  className="fa fas fa-user fs-1"
                  style={{ color: "#FFFFFF" }}
                ></i>
                <h2 style={{ color: "#FFFFFF", fontWeight: "600", margin: 0 }}>
                  INDIVIDUAL
                </h2>
              </div>
            </Col>

            <Col md="6">
              <div
                onClick={() => setSelectedType("company")}
                style={{
                  width: "100%",
                  height: "100px",
                  backgroundColor: "#3B38F8",
                  borderRadius: "15px",
                  border:
                    selectedType === "company"
                      ? "3px solid #FFFFFF"
                      : "2px solid #FFFFFF",
                  boxShadow:
                    selectedType === "company"
                      ? "0px 8px 20px rgba(59,56,248,0.6)"
                      : "0px 3px 10px rgba(59,56,248,0.35)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                  transform:
                    selectedType === "company" ? "scale(1.04)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== "company") {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0px 8px 20px rgba(59,56,248,0.55)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== "company") {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0px 3px 10px rgba(59,56,248,0.35)";
                  }
                }}
              >
                <i
                  className="fa fas fa-users fs-1"
                  style={{ color: "#FFFFFF" }}
                ></i>
                <h2 style={{ color: "#FFFFFF", fontWeight: "600", margin: 0 }}>
                  COMPANY
                </h2>
              </div>
            </Col>
          </Row>
          <div style={{ marginTop: "20px" }}>
            {selectedType === "individual" && (
              <IndividualRegistrationForm
                toggleModal={toggleModal}
                brangaysOptions={brangaysOptions}
              />
            )}
            {selectedType === "company" && (
              <CompanyRegistrationForm
                brangaysOptions={brangaysOptions}
                toggleModal={toggleModal}
              />
            )}
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              console.log(formikRef.current.errors);
              formikRef.current.handleSubmit();
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter> */}
      </Modal>
    </React.Fragment>
  );
}
export default SignupModal;
