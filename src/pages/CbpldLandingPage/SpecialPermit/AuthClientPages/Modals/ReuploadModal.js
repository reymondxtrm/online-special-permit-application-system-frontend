import React, { useState, useRef, useEffect, useCallback } from "react";
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
  FormGroup,
} from "reactstrap";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import useSubmit from "hooks/Common/useSubmit";
import OrderOfPaymentModal from "../Modals/OrderOfPaymentModal";

function ReuploadModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

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

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
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
            {"OVER THE COUNTER"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Formik
            innerRef={formikRef}
            initialValues={{
              attachment: "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(props) => (
              <Form>
                <Col>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <div style={{ display: "block" }}>
                          <p
                            style={{
                              marginBottom: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            Reupload Receipt
                          </p>
                          <Input
                            id="attachment"
                            name={`attachment`}
                            onChange={(event) => {
                              props.setFieldValue(
                                "attachment",
                                event.currentTarget.files[0]
                              );
                            }}
                            type="file"
                            accept="image/*"
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
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
              formData.append("special_permit_application_id", applicationId);
              handleSubmit(
                {
                  url: "api/client/reupload-payment",
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: formData,
                },
                [],
                [toggleRefresh, toggleModal]
              );
            }}
          >
            SAVE
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default ReuploadModal;
