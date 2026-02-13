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
import Swal from "sweetalert2";

function AmountModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
  permitType,
}) {
  const handleSubmit = useSubmit();

  const formikRef = useRef(null);
  const [discountOption, setDiscountOptions] = useState([]);
  const [exempted, setExempted] = useState(false);
  useEffect(() => {
    if (exempted) {
      formikRef.current.setFieldValue("amount", 0);
    }
  }, [exempted]);
  useEffect(() => {
    if (openModal) {
      axios
        .get("api/admin/get/exempted-cases/admin", {
          params: { permit_type: permitType },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.ordinance,
            }));
            // options.push({ value: "others", label: "Others" });
            setDiscountOptions(options);
          },
          (error) => {
            console.log(error);
          },
        );
    }
  }, [openModal]);
  const toggleResetExemption = () => {
    setExempted(!exempted);
  };
  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
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
        fade={true}
        backdrop="static"
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
                  <Row style={{ backgroundColor: "#cddfebff" }}>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input
                          id="amount"
                          name={`amount`}
                          type="number"
                          placeholder="Enter amount"
                          disabled={exempted}
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
                          <Label for="event_type">Event Type</Label>
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
                  {!!discountOption && (
                    <>
                      <Row
                        style={{
                          backgroundColor: "#cddfebff",
                          alignItems: "center",
                          display: "flex",
                          minHeight: "30px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                        >
                          <FormGroup
                            check
                            inline
                            className="d-flex justify-content-center"
                          >
                            <Input
                              type="checkbox"
                              className="me-2"
                              style={{ width: "17px", height: "17px" }}
                              value={exempted}
                              onChange={(e) => {
                                setExempted(e.target.checked);
                              }}
                            />
                            <Label
                              style={{
                                color: "#2162a3ff",
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Exempted
                            </Label>
                          </FormGroup>
                        </div>
                      </Row>{" "}
                      <Row
                        style={{
                          backgroundColor: "#cddfebff",
                          paddingBottom: "15px",
                        }}
                      >
                        <Col>
                          <Label>Exemption</Label>
                          <Select
                            options={discountOption}
                            onChange={(selected) => {
                              props.setFieldValue(
                                "exemption_id",
                                selected.value,
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
              if (exempted && !formik.exemption_id) {
                Swal.fire({
                  icon: "warning",
                  title: "Oops...",
                  text: "Exemption type is required when 'Exempted' is checked.",
                });
                return;
              }
              handleSubmit(
                {
                  url:
                    formik.exemption_id && exempted
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
                    exemption_id: exempted ? formik.exemption_id : null,
                    admin: exempted,
                  },
                },
                [],
                [
                  toggleRefresh,
                  () => {
                    toggleModal();
                    setExempted(false);
                    // if (
                    //   formikRef.current &&
                    //   typeof formikRef.current.resetForm === "function"
                    // ) {
                    //   formikRef.current.resetForm();
                    // }
                  },
                ],
              );
              // setExempted(false);
            }}
          >
            SAVE
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              toggleModal();
              // setExempted(false);
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
