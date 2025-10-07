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

function AmountModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
  permitType,
}) {
  const handleSubmit = useSubmit();
  console.log(permitType);
  const formikRef = useRef(null);
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
            {"ENTER AMOUNT"}
          </p>
        </ModalHeader>
        <ModalBody>
          {" "}
          <Formik
            innerRef={formikRef}
            initialValues={{
              amount: "",
              event_type: "",
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
                        <Label for="amount">Amount</Label>
                        <Input
                          id="amount"
                          name={`amount`}
                          type="number"
                          placeholder="Enter amount"
                          value={props.values.amount}
                          onChange={props.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {permitType === "event" && (
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="amount">Event Type</Label>
                          <Input
                            id="event_type"
                            name={`event_type`}
                            type="text"
                            placeholder="Event Type"
                            value={props.values.event_type}
                            onChange={props.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
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

              handleSubmit(
                {
                  url: "api/admin/check-attachments",
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: {
                    special_permit_application_id: applicationId,
                    billed_amount: formik.amount,
                    event_type: formik.event_type,
                  },
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

export default AmountModal;
