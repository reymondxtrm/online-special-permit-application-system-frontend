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
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik, useFormik } from "formik";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import useSubmit from "hooks/Common/useSubmit";
import OrderOfPaymentModal from "./OrderOfPaymentModal";
import BasicInputField from "components/Forms/BasicInputField";

function PaymentModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
  amount,
  orderOfPaymentData,
  applicationType,
}) {
  console.log(orderOfPaymentData);
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [paymentMethod, setPaymenyMethod] = useState("online");
  const [generateModal, setgenerateModal] = useState(false);

  const toggleGenerateModal = () => {
    setgenerateModal(!generateModal);
  };
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
      <OrderOfPaymentModal
        toggleModal={toggleGenerateModal}
        openModal={generateModal}
        orderOfPaymentData={orderOfPaymentData}
        applicationType={applicationType}
      />
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="lg"
        // fullscreen
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
        unmountOnClose
      >
        {/* <ModalHeader toggle={toggleModal}>
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
        </ModalHeader> */}
        <ModalBody style={{ backgroundColor: "#DFDFDF" }}>
          {" "}
          <Formik
            innerRef={formikRef}
            initialValues={{
              paid_amount: amount,
              or_no: "",
              date_of_payment: "",
              attachment: "",
              name: "",
              cvv: "",
              expiry_date: "",
              card_number: "",
              card_type: "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(props) => (
              <Form style={{ borderRadius: "10px" }}>
                <Row className="m-0 p-0" style={{ borderRadius: "10px" }}>
                  <Col style={{ backgroundColor: "#060527" }}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col>
                        <h5 style={{ color: "white" }}>Transaction Details</h5>
                        <Card
                          style={{
                            backgroundColor: "#1B244B",
                            borderRadius: "10px",
                          }}
                        >
                          <CardBody>
                            <table>
                              <tbody>
                                <tr>
                                  <td>Description:</td>
                                  <td>: Good Moral</td>
                                </tr>
                                <tr>
                                  <td>Amount</td>
                                  <td>: P1032</td>
                                </tr>
                                <tr>
                                  <td>Requestor Name</td>
                                  <td>: Vis VIs</td>
                                </tr>
                                <tr>
                                  <td>Evaluated </td>
                                  <td>: Sample</td>
                                </tr>
                              </tbody>
                            </table>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col style={{ backgroundColor: "white", padding: "10px" }}>
                    <Row>
                      <Col>
                        <Card>
                          <CardBody style={{ color: "" }}>
                            <Row>
                              <div></div>
                              <h4
                                style={{
                                  color: "#0b2c72ff",
                                  fontWeight: "bold",
                                  marginBottom: "30px",
                                }}
                              >
                                Payment Method
                              </h4>
                              <Col className="d-flex align-items-center justify-content-center">
                                <Card
                                  style={{
                                    // border: "3px solid #5587F9",
                                    border: "3px solid ",
                                    borderColor:
                                      paymentMethod === "online"
                                        ? "#5587F9"
                                        : "#243375ff",

                                    maxWidth: "140px",
                                  }}
                                  onClick={() => setPaymenyMethod("online")}
                                >
                                  <CardBody style={{ padding: "10px" }}>
                                    <div className="d-flex gap-2 justify-content-between ">
                                      <i
                                        className=" mdi mdi-bank fs-2"
                                        style={{
                                          color:
                                            paymentMethod === "online"
                                              ? "#5587F9"
                                              : "#243375ff",
                                        }}
                                      ></i>
                                      <input
                                        type="radio"
                                        checked={paymentMethod === "online"}
                                      ></input>
                                    </div>
                                    <p className="m-0 p-0 text-center fw-bold">
                                      Online Payment
                                    </p>
                                  </CardBody>
                                </Card>
                              </Col>
                              <Col className="d-flex align-items-center justify-content-center ">
                                <Card
                                  style={{
                                    border: "3px solid ",
                                    borderColor:
                                      paymentMethod === "counter"
                                        ? "#5587F9"
                                        : "#243375ff",
                                    maxWidth: "140px",
                                  }}
                                  onClick={() => setPaymenyMethod("counter")}
                                >
                                  <CardBody style={{ padding: "10px" }}>
                                    <div className="d-flex gap-2 justify-content-between">
                                      <i
                                        className=" mdi mdi-credit-card-outline fs-2"
                                        style={{
                                          color:
                                            paymentMethod === "counter"
                                              ? "#5587F9"
                                              : "#243375ff",
                                        }}
                                      ></i>
                                      <input
                                        type="radio"
                                        checked={paymentMethod === "counter"}
                                      ></input>
                                    </div>
                                    <p className="m-0 p-0 text-center fw-bold">
                                      Over the Counter
                                    </p>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    {paymentMethod === "online" ? (
                      <Card>
                        <CardBody>
                          <Row>
                            <Col>
                              <Card
                                style={{ border: "2px solid #043270" }}
                                onClick={() =>
                                  props.setFieldValue(
                                    "card_type",
                                    "credit_card"
                                  )
                                }
                              >
                                <CardBody style={{ padding: "5px" }}>
                                  <div
                                    className="d-flex  justify-content-between"
                                    style={{
                                      borderColor:
                                        props?.values?.card_type ===
                                        "credit_card"
                                          ? "#5587F9"
                                          : "#243375ff",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <div className="d-flex align-items-center gap-3">
                                      <i className="mdi mdi-credit-card fs-2 "></i>
                                      <p className="p-0 m-0">Credit Card</p>
                                    </div>
                                    <input
                                      type="radio"
                                      checked={
                                        props?.values?.card_type ===
                                        "credit_card"
                                      }
                                    />
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Card
                                style={{ border: "2px solid #043270" }}
                                onClick={() =>
                                  props.setFieldValue("card_type", "debit_card")
                                }
                              >
                                <CardBody
                                  style={{
                                    padding: "5px",
                                    borderColor:
                                      props?.values?.card_type === "credit_card"
                                        ? "#5587F9"
                                        : "#243375ff",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="d-flex  justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                      <i className="mdi mdi-credit-card-outline fs-2 "></i>
                                      <p className="p-0 m-0">Debit Card</p>
                                    </div>
                                    <input
                                      type="radio"
                                      checked={
                                        props?.values?.card_type ===
                                        "debit_card"
                                      }
                                    />
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <BasicInputField
                              type={"text"}
                              validation={props}
                              name="name"
                              label="Name"
                              touched={props.touched.name}
                              placeholder="Ex. Juan Dela Cruz"
                              errors={props.errors.name}
                              value={props.values.name}
                              required
                            />
                          </Row>
                          <Row>
                            <BasicInputField
                              type={"text"}
                              validation={props}
                              name="card_number"
                              label="Card Number"
                              placeholder="XXXX XXXX XXXX XXXX"
                              touched={props.touched.card_number}
                              errors={props.errors.card_number}
                              value={props.values.card_number}
                              required
                            />
                          </Row>
                          <Row>
                            <Col>
                              <BasicInputField
                                type={"date"}
                                validation={props}
                                name="expiry_date"
                                label="Expiry Date"
                                touched={props.touched.expiry_date}
                                errors={props.errors.expiry_date}
                                value={props.values.expiry_date}
                                required
                              />
                            </Col>
                            <Col>
                              <BasicInputField
                                type={"text"}
                                validation={props}
                                name="cvv"
                                label="CVV"
                                touched={props.touched.cvv}
                                errors={props.errors.cvv}
                                value={props.values.cvv}
                                required
                                placeholder="Ex. 123"
                              />
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ) : (
                      <>
                        <Card>
                          <CardBody>
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
                                      Click to Generate Order of Payment
                                    </p>
                                    <Button
                                      style={{
                                        backgroundColor: "#1a56db",
                                        width: "100%",
                                        fontWeight: "600",
                                        fontFamily:
                                          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                                        color: "white",
                                      }}
                                      onClick={toggleGenerateModal}
                                    >
                                      GENERATE
                                    </Button>
                                  </div>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <FormGroup>
                                  <Label for="or_no">O.R No.</Label>
                                  <Input
                                    id="or_no"
                                    name={`or_no`}
                                    onChange={props.handleChange}
                                    placeholder="Enter O.R No."
                                  />
                                </FormGroup>

                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <Label for="date_of_payment">
                                        O.R Date
                                      </Label>
                                      <Input
                                        id="date_of_payment"
                                        name={`date_of_payment`}
                                        onChange={props.handleChange}
                                        value={props.values.date_of_payment}
                                        type="date"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <Label for="paid_amount">
                                        Paid Amount
                                      </Label>
                                      <Input
                                        id="paid_amount"
                                        name={`paid_amount`}
                                        onChange={props.handleChange}
                                        value={props.values.paid_amount}
                                        type="number"
                                        readOnly
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <FormGroup>
                                  <div style={{ display: "block" }}>
                                    <p
                                      style={{
                                        marginBottom: "0.5rem",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Upload Receipt
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
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
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
              const formik = formikRef.current.values;
              const formData = getFormData(formik);
              formData.append("special_permit_application_id", applicationId);
              handleSubmit(
                {
                  url: "api/client/pay-permit",
                  // headers: {
                  //   "Content-Type": "multipart/form-data",
                  // },
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
        </ModalFooter> */}
      </Modal>
    </React.Fragment>
  );
}

export default PaymentModal;
