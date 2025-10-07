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

function RemarksModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
}) {
  const handleSubmit = useSubmit();
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
            {"ENTER REMARKS"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Formik
            innerRef={formikRef}
            initialValues={{
              remarks: "",
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
                        <Label for="remarks">Remarks</Label>
                        <Input
                          id="remarks"
                          name={`remarks`}
                          type="textarea"
                          placeholder="Enter remarks"
                          value={props.values.remarks}
                          onChange={props.handleChange}
                        />
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

              handleSubmit(
                {
                  url: "api/admin/decline-application",
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: {
                    special_permit_application_id: applicationId,
                    remarks: formik.remarks,
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

export default RemarksModal;
