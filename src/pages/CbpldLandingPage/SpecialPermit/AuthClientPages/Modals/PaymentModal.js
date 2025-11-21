import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
import "./PaymentModal.css";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import landBankLogo from "../../../../../assets/images/logo-landbank.png";
import spayLogo from "../../../../../assets/images/logo-spay.jpg";
import gcashLogo from "../../../../../assets/images/logo-gcash.png";
import grabpayLogo from "../../../../../assets/images/logo-grabpay.png";
import TermsAndConditions from "./TermsAndConditions";
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
import UserDetails from "components/Modals/UserDetails";
import { v4 as uuidv4 } from "uuid";

function PaymentModal({
  openModal,
  toggleModal,
  toggleRefresh,
  applicationId,
  paymentDetails,
  applicationType,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [paymentMethod, setPaymenyMethod] = useState("online");
  const [generateModal, setgenerateModal] = useState(false);
  const [clearance, setClearance] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [userData, setuserData] = useState();
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState(false);
  const [approveTerm, setApproveTerm] = useState(false);
  const toggleGenerateModal = () => {
    setgenerateModal(!generateModal);
  };
  const toggleTermsAndConditionsModal = () => {
    setTermsAndConditionsModal((prev) => !prev);
  };

  const user = useSelector((state) => state.user);
  const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided"; // Handle missing date
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    if (openModal) {
      setisLoading(true);
      axios.get("api/client/user-details").then(
        (res) => {
          setisLoading(false);
          setuserData(res.data);
        },
        (error) => {
          setisLoading(false);
          console.log(error);
        }
      );
    }
  }, [openModal]);
  useEffect(() => {
    if (openModal) {
      axios({
        url: "api/get-clearances",
        method: "GET",
      })
        .then((response) => {
          setClearance(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [openModal]);

  const descriptions = [
    { label: "Mayor's Permit", type: "mayors_permit" },
    { label: "Event", type: "event" },
    { label: "Motorcade", type: "motorcade" },
    { label: "Parade", type: "parade" },
    { label: "Recorrida", type: "recorrida" },
    { label: "Use Government Property", type: "government_property" },
    { label: "Certificate of Good Moral Character", type: "good_moral" },
    { label: "Occupational Permit", type: "occupational_permit" },
    { label: "Fiscal Clearance Fee", type: "fiscal_clearance" },
    { label: "Court Clearance Fee", type: "court_clearance" },
  ];
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
  const type = useMemo(() => {
    return descriptions.find((item) => item.type === applicationType);
  }, [applicationType]);

  const eor_collection = useMemo(() => {
    let collection = [
      {
        name: type?.label,
        amount: paymentDetails.total_amount,
        quantity: paymentDetails.quantity,
        account_code: "",
      },
    ];
    if (applicationType === "good_moral") {
      clearance.map((item) => {
        collection.push({
          name: item.name,
          amount: item.amount * paymentDetails?.quantity,
          quantity: paymentDetails?.quantity,
          account_code: "",
        });
      });
    }
    return collection;
  }, [applicationType, applicationId, type]);
  console.log(eor_collection);
  return (
    <React.Fragment>
      <OrderOfPaymentModal
        toggleModal={toggleGenerateModal}
        openModal={generateModal}
        applicationType={applicationType}
        isLoading={isLoading}
        descriptions={descriptions}
        formatDate={formatDate}
        userData={userData}
        clearance={clearance}
        paymentDetails={paymentDetails}
      />
      <TermsAndConditions
        isOpen={termsAndConditionsModal}
        toggle={toggleTermsAndConditionsModal}
        setApproveTerm={setApproveTerm}
      />
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="lg"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
        unmountOnClose
      >
        <ModalBody style={{ backgroundColor: "#DFDFDF" }}>
          {" "}
          <Formik
            innerRef={formikRef}
            initialValues={{
              // paid_amount: amount,
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
              <Form>
                <Row className="m-0 p-0">
                  <Col
                    style={{
                      backgroundColor: "#060527",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    <Row style={{ marginTop: "10px" }}>
                      <Col>
                        <h5
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            marginBottom: "30px",
                            marginTop: "20px",
                          }}
                        >
                          Transaction Details
                        </h5>
                        <Card
                          style={{
                            backgroundColor: "#1B244B",
                            borderRadius: "20px",
                          }}
                        >
                          <CardBody>
                            <div className="d-flex">
                              <Row>
                                <Col md={3}>
                                  {" "}
                                  <img src={cgbLogo} className="logo" />
                                </Col>
                                <Col>
                                  <div className="d-flex align-items-center flex-column  header">
                                    <p className=" text-center fw-bold">
                                      Republic of the philippines
                                    </p>
                                    <p className="p-0 m-0 text-center fw-bold">
                                      CITY BUSINESS AND LICENSING DEPARTMENT
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <div
                              className="header fw-normal "
                              style={{ marginTop: "30px" }}
                            >
                              <p className="p-0 m-0">
                                <span className="fw-bold me-2">
                                  Requestor Name:{" "}
                                </span>
                                {isLoading ? "loading" : userData?.full_name}
                              </p>
                            </div>
                            <Table className="transaction-table" bordered>
                              <thead>
                                <tr>
                                  <th>Description</th>
                                  <th>quantity</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{type.label}</td>
                                  <td>{paymentDetails?.quantity}</td>
                                  <td>{`₱${paymentDetails?.billed_amount}.00`}</td>
                                  {/* <td>{`₱ ${orderOfPaymentData?.billed_amount}`}</td> */}
                                </tr>
                                {applicationType === "good_moral"
                                  ? clearance &&
                                    clearance.map((item) => (
                                      <tr key={item.id}>
                                        <td> {item.name}</td>
                                        <td> {paymentDetails.quantity}</td>
                                        <td>{`₱ ${item.amount}`}</td>
                                      </tr>
                                    ))
                                  : null}
                                <tr style={{ height: "100px" }}>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td>Total</td>
                                  <td>{`${
                                    applicationType === "good_moral"
                                      ? paymentDetails.quantity * 3
                                      : paymentDetails.quantity
                                  }`}</td>
                                  <td>{`₱ ${paymentDetails.total_amount}`}</td>
                                </tr>
                              </tbody>
                            </Table>
                            <div className="transaction-footer">
                              <p className="p-0 m-0">
                                <span className="fw-bold me-2">
                                  Evaluated by:
                                </span>{" "}
                                {paymentDetails?.fullname}
                              </p>
                              <p className="p-0 m-0">
                                <span className="fw-bold me-2">
                                  Date and TIme:{" "}
                                </span>{" "}
                                {formatDate(paymentDetails?.created_at)}
                              </p>
                            </div>
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
                                        checked={
                                          paymentMethod === "online" || false
                                        }
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
                                        checked={
                                          paymentMethod === "counter" || false
                                        }
                                      />
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
                      <>
                        <Card style={{ margin: "0px" }}>
                          <CardBody
                            style={{
                              border: "1px solid #a2a2a1",
                              borderRadius: "10px",
                            }}
                          >
                            <Row>
                              <Col className="d-flex gap-2">
                                <div>
                                  <Input type="radio" />
                                </div>
                                <div>
                                  <div>
                                    <p
                                      className="m-0 p-0 fw-bold"
                                      style={{ fontSize: "10px" }}
                                    >
                                      Landbank (ePayment Portal)
                                    </p>
                                    <p style={{ fontSize: "10px" }}>
                                      {" "}
                                      Rate: LBP ATM/Visa Debit Card - P 7 per
                                      transaction | BancNet-Member Bank
                                      ATM/Debit Cards - P17 per transaction |
                                      Cash Payment and e-Wallet (GCash,
                                      ShopeePay and GrabPay - P 30 per
                                      transaction)
                                    </p>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <img
                                      style={{ width: "60px", height: "40px" }}
                                      src={landBankLogo}
                                      alt="Landbank Logo"
                                    />
                                    <img
                                      style={{ width: "40px", height: "40px" }}
                                      src={spayLogo}
                                      alt="spay Logo"
                                    />
                                    <img
                                      style={{ width: "50px", height: "40px" }}
                                      src={gcashLogo}
                                      alt="gcash Logo"
                                    />
                                    <img
                                      style={{ width: "40px", height: "40px" }}
                                      src={grabpayLogo}
                                      alt="grabpay Logo"
                                    />
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Row>
                          <div className="d-flex gap-2">
                            <Input
                              type="checkbox"
                              defaultChecked={approveTerm}
                              onChange={(e) => {
                                setApproveTerm(e.target.checked);
                              }}
                            />
                            <p>
                              I have read and agreed to the{" "}
                              <span
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={toggleTermsAndConditionsModal}
                              >
                                Terms and conditions
                              </span>
                            </p>
                          </div>
                        </Row>
                      </>
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

                    <Row>
                      <div className="text-end">
                        <Button
                          className="me-2"
                          style={{
                            backgroundColor: "#1a56db",
                            fontWeight: "600",
                            fontFamily:
                              "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            color: "white",
                          }}
                          onClick={() => {
                            const formik = formikRef.current.values;

                            if (paymentMethod === "online") {
                              // const secretKey = process.env.REACT_SECRET_KEY;
                              const secretKey =
                                "dbb0cf7063d880f7d416cc137a24f3625be78529196e8d91d360fef1994e76ef";
                              const obj = {
                                amount: paymentDetails.total_amount,
                                transaction_type: "Tax/Fees",
                                // merchant_reference_number: `B-434`,
                                merchant_reference_number: `B-${uuidv4()}`,
                                full_name: user.name,
                                user_id: user.id,
                                ref_no: "1",
                                ref_no2: "0",
                                or_no: "12-312-312",
                                eor: true,
                                cedula: false,
                                cedula_type: "individual",
                                ref_no3: "0",
                                special_permit_application_id: applicationId,
                                invoice_no: "12345",
                                department: "BPLD",
                                type_application: "miscellaneous",
                                email: user.email,
                                remarks: "Remarks",
                                callback_url:
                                  "https://saas.butuan.gov.ph/paymentreturn.php",
                                backUrl:
                                  "http://localhost:3000/client/for-payment/dashboard",
                                new_collection: eor_collection,
                                onSuccessCallbackUrl: {
                                  params: [
                                    "special_permit_application_id",
                                    "or_no",
                                    "user_id",
                                    "newCollection",
                                  ],
                                  defaults: {
                                    Checksum: "", // sum reference
                                    ErrorCode: "", // error code
                                    LBPConfDate: "date_of_payment", // date
                                    LBPConfNum: "LBPConfNum", // confirmation number
                                    LBPRefNum: "", // some series numbers
                                    MerchantRefNum: "", // merchant number
                                    TrxnAmount: "paid_amount", // return ammount
                                  },
                                  link: `http://localhost:8000/api/update-payment-status`,
                                },
                              };

                              const jsonString = JSON.stringify(obj);
                              const encrypted = CryptoJS.AES.encrypt(
                                jsonString,
                                secretKey
                              ).toString();
                              const encoded = encodeURIComponent(encrypted);
                              const url = `http://ctd01.a.testing.butuan.gov.ph/payment?data=${encoded}`;
                              const create = async () => {
                                try {
                                  const response = await axios({
                                    method: "POST",
                                    url: "api/client/create-db-state",
                                    params: {
                                      application_type: "occupational_permit",
                                      special_permit_application_id: [
                                        ...applicationId,
                                      ],
                                    },
                                  });
                                  if (response) {
                                    console.log("success");
                                    setTimeout(() => {
                                      // window.open(url, "_blank");
                                      window.location.href;
                                    }, 1000);
                                  }
                                } catch (error) {
                                  console.log(error.response);
                                }
                              };
                              create();
                            } else {
                              const formData = getFormData(formik);
                              formData.append(
                                "special_permit_application_id",
                                applicationId
                              );
                              handleSubmit(
                                {
                                  url: "api/client/pay-permit",
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
                            }
                          }}
                          disabled={!approveTerm && paymentMethod === "online"}
                        >
                          {paymentMethod === "online" ? "Pay" : "Save"}
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>
                          Close
                        </Button>
                      </div>
                    </Row>
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
