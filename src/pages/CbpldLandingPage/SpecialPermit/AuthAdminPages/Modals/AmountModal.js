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
  const [discountOption, setDiscountOptions] = useState([]);
  const [exempted, setExempted] = useState(false);
  useEffect(() => {
    if (openModal) {
      axios
        .get("api/admin/get/exempted-cases", {
          params: { permit_type: "event" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));
            // options.push({ value: "others", label: "Others" });
            setDiscountOptions(options);
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
        toggle={() => {
          // ensure parent toggles and reset local state and form
          toggleModal();
          setExempted(false);
          if (
            formikRef.current &&
            typeof formikRef.current.resetForm === "function"
          ) {
            formikRef.current.resetForm();
          }
        }}
        fade={true}
        backdrop="static"
        // use reactstrap props: centered to vertically center, remove invalid props
        centered
        keyboard
        style={{ overflowY: "auto" }}
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
            setExempted(false);
            if (
              formikRef.current &&
              typeof formikRef.current.resetForm === "function"
            ) {
              formikRef.current.resetForm();
            }
          }}
        >
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
              exemption_id: null,
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
                    <>
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
                      <Row
                        style={{
                          backgroundColor: "#0b95f4",
                          alignItems: "center", // centers vertically
                          display: "flex", // enable flex layout
                          minHeight: "30px", // optional: gives some height
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                        >
                          <FormGroup check inline>
                            <Input
                              type="checkbox"
                              className="me-2"
                              onChange={() => setExempted((prev) => !prev)}
                            />

                            <Label style={{ color: "white", fontSize: "15px" }}>
                              Exempted
                            </Label>
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <Col>
                          <Label>Exemption</Label>
                          <Select
                            options={discountOption}
                            onChange={(selected) => {
                              props.setFieldValue(
                                "exemption_id",
                                selected.value
                              );
                            }}
                            isDisabled={!exempted}
                          />
                        </Col>
                      </Row>
                    </>
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
              const formik = formikRef.current?.values || {};
              console.log(exempted);
              handleSubmit(
                {
                  url: formik.exemption_id
                    ? "api/admin/approve/exemption"
                    : "api/admin/check-attachments",
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
                    exemption_id: formik.exemption_id,
                    admin: exempted,
                  },
                },
                [],
                [
                  toggleRefresh,
                  () => {
                    toggleModal();
                    if (
                      formikRef.current &&
                      typeof formikRef.current.resetForm === "function"
                    ) {
                      formikRef.current.resetForm();
                    }
                  },
                ]
              );
              setExempted(false);
            }}
          >
            SAVE
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggleModal();
              setExempted(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default AmountModal;
