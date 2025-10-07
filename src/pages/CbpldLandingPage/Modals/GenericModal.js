import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Input,
  Label,
} from "reactstrap";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
const GenericModal = ({
  openModal,
  toggleModal,
  children,
  handleSumbit,
  title,
}) => {
  const handleSubmit = () => console.log("sample");
  const formikRef = useRef(null);
  const initialValues = {
    ppaDetails: [
      {
        ppaID: null,
        ppaName: "",
        ppaDescription: "",
        sector: [],
        officeDetails: [],
        successIndicators: [
          {
            si: "",
            origin: "OPCR",
            dateFrom: "",
            dateTo: "",
            // remarks: "",
          },
        ],
        ppaTimelineStart: "",
        ppaTimelineEnd: "",
        ppaCategory: "",
        aipDetails: {
          beneficiaries: {
            targetPopulationSectors: "",
            direct: "",
            indirect: "",
            outcome: "",
          },

          description: {
            projectTitle: "",
            description: "",
            objectives: "",
            proponent: "",
            implementingOffice: "",
            partnerAgencies: [],
            location: "",
            duration: {
              dateFrom: "",
              dateTo: "",
            },
          },

          components: {
            preImplementationActivities: {
              dateFrom: "",
              dateTo: "",
              outputs: "",
            },

            implementationActivities: {
              dateFrom: "",
              dateTo: "",
              outputs: "",
            },

            postImplementationActivities: {
              dateFrom: "",
              dateTo: "",
              outputs: "",
            },
          },

          fundingRequirements: {
            proposedFundingSource: [],
            specify: "",
          },
          alignmentToDevelopmentPlans: {
            sustainableDevelopmentGoals: {
              ischecked: false,
              details: [],
            },
            comprehensiveLandUsePlan: {
              ischecked: false,
              details: "",
            },
            comprehensiveDevelopmentPlan: {
              ischecked: false,
              details: [],
            },
            sixDevelopmentImperatives: {
              ischecked: false,
              details: [],
            },
            localThematicPlan: {
              ischecked: false,
              details: "",
            },
            barangayDevelopmentPlan: {
              ischecked: false,
              details: "",
            },
            climateChangeTypologyCode: {
              ischecked: false,
              details: [],
            },
            otherPlans: {
              ischecked: false,
              details: "",
            },
            developmentChallenges: "",
            contributionToGender: "",
            contributionToChildren: "",
          },
          riskManagement: {
            preImplementationActivities: {
              riskMitigationStrategies: "",
            },
            implementationActivities: {
              riskMitigationStrategies: "",
            },
            postImplementationActivities: {
              riskMitigationStrategies: "",
            },
          },
          sustainabilityStrategies: "",
        },
      },
    ],
  };
  return (
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
        maxWidth: "1400px",
      }}
      unmountOnClose
    >
      <ModalHeader toggle={toggleModal}>
        {/* <Badge color="success" style={{ fontSize: "16pt" }}>
          {title ? title : "MAYOR'S CERTIFICATE"}
        </Badge> */}
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: "0",
            padding: "0",
            color: "#368be0",

            // #1a56db
          }}
        >
          {title ? title : "MAYOR'S CERTIFICATE"}
        </p>
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto" }}>{children}</ModalBody>
      <ModalFooter>
        <Button
          style={{
            backgroundColor: "#1a56db",
            fontWeight: "600",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            color: "white",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GenericModal;
