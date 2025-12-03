import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Form,
  Row,
  Col,
  Input,
  Label,
} from "reactstrap";

import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import PassportCamera from "../SpecialPermit/AuthClientPages/Common/PassportCamera";

function OccupationalPermitModal({ openModal, toggleModal }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [tableData, setTableData] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);

  useEffect(() => {
    if (openModal) {
      const fetchData = async () => {
        try {
          setIsFetching(true);
          const response = await axios.get(
            "api/client/get-user-occupation-details"
          );
          if (response) {
            setTableData(response.data);
            setIsFetching(false);
          }
        } catch (error) {
          console.log(error.response);
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [openModal]);

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]); // Directly append files
      } else if (Array.isArray(object[key])) {
        object[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (typeof object[key] === "object" && object[key] !== null) {
        formData.append(key, JSON.stringify(object[key]));
      } else {
        formData.append(key, object[key]);
      }
    });
    return formData;
  };
  const setIdPicture = (capturedPicture) => {
    formikRef.current.setFieldValue(`id_picture`, capturedPicture);
  };
  const togglePictureModal = () => {
    setCameraIsOpen((prev) => !prev);
  };
  return (
    <React.Fragment>
      <PassportCamera
        onCapture={setIdPicture}
        isOpen={cameraIsOpen}
        toggle={togglePictureModal}
        image={formikRef?.current?.values?.id_picture}
      />
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        size="lg"
        backdrop="static"
        className="modal-dialog-centered"
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
            {"OCCUPATIONAL PERMIT"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              type: "occupational_permit",
              certificate_of_employment: "",
              community_tax_certificate: "",
              id_picture: "",
              training_certificate: "",
              monthly_income: "",
              company_name: tableData?.company_name || "",
              company_address: tableData?.full_address || "",
              position: tableData?.position || "",
              no_cedula: false,
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Row>
                  <Col>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td className="text-end">
                            <Label>Company Name:</Label>
                          </td>
                          <td colSpan={2}>
                            <Input value={props.values.company_name} disabled />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>Company Address:</Label>
                          </td>
                          <td colSpan={2}>
                            <Input
                              value={props.values.company_address}
                              disabled
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>Occupation:</Label>
                          </td>
                          <td colSpan={2}>
                            <Input value={props.values.position} disabled />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>Monthly Income:</Label>
                          </td>
                          <td colSpan={2}>
                            <Input
                              id="monthy_income"
                              name={"monthly_income"}
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                              onChange={props.handleChange}
                              value={props.values.monthly_income}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>Certificate of Employment:</Label>
                          </td>
                          <td colSpan={2}>
                            <Input
                              accept="image/*"
                              id="certificateOfEmployment"
                              name={`certificate_of_employment`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "certificate_of_employment",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>Community Tax Certificate:</Label>
                          </td>
                          <td>
                            <Input
                              accept="image/*"
                              id="communityTaxCertificate"
                              name={`community_tax_certificate`}
                              onChange={(event) => {
                                console.log(event);
                                props.setFieldValue(
                                  "community_tax_certificate",
                                  event.currentTarget.files[0]
                                );
                              }}
                              type="file"
                              disabled={props.values?.no_ceduala}
                            />
                          </td>
                          <td>
                            <div className="d-flex gap-2 align-items-center">
                              <Input
                                type="checkbox"
                                style={{ width: "20px", height: "20px" }}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    props.setFieldValue("no_cedula", true);
                                  } else {
                                    props.setFieldValue("no_cedula", false);
                                  }
                                }}
                              />
                              <span style={{ color: "red", cursor: "pointer" }}>
                                {"Don't have Cedula?"}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">
                            <Label>ID Picture:</Label>
                          </td>
                          <td colSpan={2}>
                            <Button
                              color="primary"
                              outline
                              className="d-flex align-items-center gap-2"
                              style={{
                                borderRadius: "6px",
                                padding: "10px 14px",
                                fontWeight: 500,
                              }}
                              onClick={togglePictureModal}
                            >
                              <i className="mdi mdi-camera fs-4"></i>
                              Take Picture
                            </Button>
                          </td>
                        </tr>
                        {tableData?.company_type === "NON-FOOD-MASSEUR" && (
                          <tr>
                            <td className="text-end">
                              <Label>Training Certificate:</Label>
                            </td>
                            <td colSpan={2}>
                              <Input
                                id="trainingCertificate"
                                accept="image/*"
                                name={`training_certificate`}
                                onChange={(event) => {
                                  console.log(event);
                                  props.setFieldValue(
                                    "training_certificate",
                                    event.currentTarget.files[0]
                                  );
                                }}
                                type="file"
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              const formik = formikRef.current.values;
              const formData = getFormData(formik);

              handleSubmit(
                {
                  url: "api/client/single-occupational-permit-application",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: formData,
                },
                [],
                [toggleModal]
              );
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default OccupationalPermitModal;
