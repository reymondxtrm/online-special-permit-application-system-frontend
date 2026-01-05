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
  Spinner,
} from "reactstrap";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik, useFormik } from "formik";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import useSubmit from "hooks/Common/useSubmit";
import OrderOfPaymentModal from "./OrderOfPaymentModal";
import "./PaymentModal.css";
import cgbLogo from "../../../../../assets/images/cgbLogo.png";
import landBankLogo from "../../../../../assets/images/logo-landbank.png";
import spayLogo from "../../../../../assets/images/logo-spay.jpg";
import gcashLogo from "../../../../../assets/images/logo-gcash.png";
import grabpayLogo from "../../../../../assets/images/logo-grabpay.png";
import TermsAndConditions from "./TermsAndConditions";
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import bgImage from "../../../../../assets/images/payment-header-background.jpg";
import CedulaApplicationForm from "../../Printables/CedulaApplicationForm";
import ReactToPrint from "react-to-print";

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
  const [paymentMethod, setPaymenyMethod] = useState("counter");
  const [generateModal, setgenerateModal] = useState(false);
  const [clearance, setClearance] = useState([]);
  const [isLoading, setisLoading] = useState();
  const [userData, setuserData] = useState();
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState(false);
  const [approveTerm, setApproveTerm] = useState(false);
  const [forPrinting, setForPrinting] = useState(0);
  const componentRef = useRef();
  const toggleGenerateModal = () => {
    setgenerateModal(!generateModal);
  };
  function getTransactionDate() {
    const d = new Date();
    return (
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") +
      String(d.getMilliseconds()).padStart(2, "0")
    );
  }
  const [isPaying, setIsPaying] = useState(false);
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
    { label: "Use Government Property", type: "use_of_government_property" },
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
    // If modal is not open, return empty immediately
    if (!openModal) return [];

    const quantity = paymentDetails?.quantity ?? 0;
    const totalAmount = paymentDetails?.total_amount ?? 0;
    const typeLabel = type?.label ?? "";

    let collection = [
      {
        name: `${typeLabel} X${quantity}`,
        amount: totalAmount,
        quantity: quantity,
        account_code: "",
      },
    ];

    if (
      applicationType === "good_moral" ||
      (applicationType === "mayors_permit" && Array.isArray(clearance))
    ) {
      const clearanceItems = clearance.map((item) => ({
        name: item?.name ?? "",
        amount: (item?.amount ?? 0) * quantity,
        quantity: quantity,
        account_code: "",
      }));
      collection = [...collection, ...clearanceItems];
    }

    return collection;
  }, [
    openModal,
    applicationType,
    type?.label,
    paymentDetails?.quantity,
    paymentDetails?.total_amount,
    clearance,
  ]);

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
        // isOpen={true}
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
              paid_amount: paymentDetails?.total_amount || 0,
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
                <Row className="m-0 p-0" style={{ height: "100%" }}>
                  <Col
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Row className="m-0 p-0" style={{ height: "100%" }}>
                      <Col
                        style={{
                          paddingRight: "0px",
                          paddingLeft: "0px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Card>
                          <CardBody>
                            <Row style={{ marginTop: "10px" }}>
                              <Col>
                                <h4
                                  style={{
                                    fontWeight: "bold",
                                    color: "#0b2c72ff",
                                  }}
                                >
                                  Transaction Details
                                </h4>
                                <Card
                                  style={{
                                    backgroundColor: "#1B244B",
                                    // backgroundImage: `url(${bgImage})`,
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <CardBody>
                                    <div className="d-flex">
                                      <div>
                                        <img
                                          src={cgbLogo}
                                          className="cgb-logo"
                                        />
                                      </div>
                                      <div>
                                        <div className="d-flex align-items-center flex-column  header">
                                          <p className=" text-center fw-bold">
                                            Republic of the philippines
                                          </p>
                                          <p className="p-0 m-0 text-center fw-bold">
                                            CITY BUSINESS AND LICENSING
                                            DEPARTMENT
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="header fw-normal "
                                      style={{ marginTop: "30px" }}
                                    >
                                      <p className="p-0 m-0">
                                        <span className="fw-bold me-2">
                                          Requestor Name:{" "}
                                        </span>

                                        {isLoading
                                          ? "loading"
                                          : userData?.full_name}
                                      </p>
                                    </div>
                                    <Table
                                      className="transaction-table"
                                      bordered
                                    >
                                      <thead>
                                        <tr>
                                          <th>Description</th>
                                          <th>quantity</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>{type?.label}</td>
                                          <td>{paymentDetails?.quantity}</td>
                                          <td>{`₱${paymentDetails?.billed_amount}.00`}</td>
                                          {/* <td>{`₱ ${orderOfPaymentData?.billed_amount}`}</td> */}
                                        </tr>
                                        {applicationType === "good_moral" ||
                                        applicationType === "mayors_permit"
                                          ? clearance &&
                                            clearance.map((item) => (
                                              <tr key={item.id}>
                                                <td> {item.name}</td>
                                                <td>
                                                  {" "}
                                                  {paymentDetails.quantity}
                                                </td>
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
                          </CardBody>
                        </Card>
                      </Col>
                      <Col
                        style={{
                          paddingRight: "0px",
                          paddingLeft: "2px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Card>
                          <CardBody
                            style={{
                              backgroundColor: "white",
                              padding: "10px",
                            }}
                          >
                            <Row>
                              <Col>
                                <Card>
                                  <CardBody style={{ color: "" }}>
                                    <Row>
                                      <h4
                                        style={{
                                          color: "#0b2c72ff",
                                          fontWeight: "bold",
                                          marginBottom: "30px",
                                        }}
                                      >
                                        Payment Method
                                      </h4>
                                      <Col className="d-flex ">
                                        <Card
                                          style={{
                                            border: "3px solid ",
                                            borderColor:
                                              paymentMethod === "online"
                                                ? "#5587F9"
                                                : "#243375ff",

                                            maxWidth: "200px",
                                            position: "relative",
                                          }}
                                          // onClick={() =>
                                          //   setPaymenyMethod("online")
                                          // }
                                        >
                                          <CardBody style={{ padding: "10px" }}>
                                            <div
                                              style={{
                                                position: "absolute",
                                                left: "-2px",
                                                top: "-1px",
                                                backgroundColor: "#9f9fa088",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  fontWeight: "bold",
                                                  fontSize: "20px",
                                                  color: "white",
                                                  textAlign: "center",
                                                }}
                                              >
                                                COMMING SOON
                                              </p>
                                            </div>
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
                                                  paymentMethod === "online" ||
                                                  false
                                                }
                                              ></input>
                                            </div>
                                            <p className="m-0 p-0 text-center fw-bold">
                                              Online Payment
                                            </p>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                      <Col className="d-flex">
                                        <Card
                                          style={{
                                            border: "3px solid ",
                                            borderColor:
                                              paymentMethod === "counter"
                                                ? "#5587F9"
                                                : "#243375ff",
                                            maxWidth: "140px",
                                          }}
                                          onClick={() =>
                                            setPaymenyMethod("counter")
                                          }
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
                                                  paymentMethod === "counter" ||
                                                  false
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
                                          {/* <Input type="radio" /> */}
                                        </div>
                                        <div>
                                          <div>
                                            <p
                                              className="m-0 p-0 fw-bold"
                                              style={{
                                                fontSize: "20px",
                                                color: "#0b2c72ff",
                                              }}
                                            >
                                              Landbank (ePayment Portal)
                                            </p>
                                            <p style={{ fontSize: "14px" }}>
                                              {" "}
                                              Rate: LBP ATM/Visa Debit Card -{" "}
                                              <strong>
                                                P 7 per transaction{" "}
                                              </strong>
                                              | BancNet-Member Bank ATM/Debit
                                              Cards -
                                              <strong>
                                                {" "}
                                                P17 per transaction
                                              </strong>{" "}
                                              | Cash Payment and e-Wallet
                                              (GCash, ShopeePay and GrabPay -
                                              <strong>
                                                P 30 per transaction
                                              </strong>{" "}
                                              )
                                            </p>
                                          </div>
                                          <div className="d-flex gap-2">
                                            <img
                                              style={{
                                                width: "60px",
                                                height: "40px",
                                              }}
                                              src={landBankLogo}
                                              alt="Landbank Logo"
                                            />
                                            <img
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                              }}
                                              src={spayLogo}
                                              alt="spay Logo"
                                            />
                                            <img
                                              style={{
                                                width: "50px",
                                                height: "40px",
                                              }}
                                              src={gcashLogo}
                                              alt="gcash Logo"
                                            />
                                            <img
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                              }}
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
                                        if (e.target.checked) {
                                          toggleTermsAndConditionsModal();
                                        }
                                      }}
                                    />
                                    <p>
                                      I have read and agreed to the{" "}
                                      <span
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                        }}
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
                                                value={
                                                  props.values.date_of_payment
                                                }
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
                              <div className="text-end ">
                                {isPaying ? (
                                  <Button
                                    color="primary"
                                    className="me-2"
                                    disabled
                                  >
                                    <Spinner size="sm">Paying....</Spinner>
                                    <span>Paying....</span>
                                  </Button>
                                ) : (
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
                                        const secretKey =
                                          "dbb0cf7063d880f7d416cc137a24f3625be78529196e8d91d360fef1994e76ef";
                                        // process.env.REACT_APP_SECRET_KEY;

                                        const obj = {
                                          amount:
                                            paymentDetails?.total_amount?.toString(),
                                          // amount: 100,
                                          transaction_type: "Business Permit",
                                          merchant_reference_number: `OSPAS-${[
                                            applicationId?.[0],
                                          ]}-${getTransactionDate()}`,
                                          full_name: user.name,
                                          user_id: user.id,
                                          ref_no: "1",
                                          ref_no2: "0",
                                          or_no: "12-312-312",
                                          eor: true,
                                          cedula: false,
                                          cedula_type: "individual",
                                          ref_no3: "0",
                                          originator: "ospas",
                                          special_permit_application_id:
                                            applicationId,
                                          invoice_no: "12345",
                                          department: "CBPLD",
                                          downloadable: false,
                                          application_type_id: 5,
                                          type_application: "Special Permit",
                                          email: user.email,
                                          // email: "reymondxtrm@gmail.com",
                                          remarks: "Remarks",
                                          callback_url:
                                            "https://saas.butuan.gov.ph/paymentreturn.php",
                                          backUrl:
                                            window.location.protocol +
                                            "//" +
                                            process.env.REACT_APP_URL +
                                            "client/for-payment/dashboard",
                                          new_collection: eor_collection,
                                          updateUrl: {
                                            // link: "http://ospas01.b.staging.butuan.gov.ph/api/online/create-db-state",
                                            // link: "https://backendospas.butuan.gov.ph/api/online/create-db-state",
                                            link:
                                              window.location.protocol +
                                              "//" +
                                              process.env.REACT_APP_API +
                                              "api/online/create-db-state",
                                            params: {
                                              application_type:
                                                "occupational_permit",
                                              special_permit_application_id: [
                                                ...applicationId,
                                              ],
                                            },
                                          },
                                          onSuccessCallbackUrl: {
                                            params: [
                                              "special_permit_application_id",
                                              "or_no",
                                              "user_id",
                                              "newCollection",
                                            ],
                                            defaults: {
                                              Checksum: "",
                                              ErrorCode: "",
                                              LBPConfDate: "date_of_payment",
                                              LBPConfNum: "LBPConfNum",
                                              LBPRefNum: "",
                                              MerchantRefNum: "",
                                              TrxnAmount: "paid_amount",
                                            },
                                            link:
                                              window.location.protocol +
                                              "//" +
                                              process.env.REACT_APP_API +
                                              "api/update-payment-status",
                                            // `http://ospas01.b.staging.butuan.gov.ph/api/update-payment-status`,
                                            // `https://backendospas.butuan.gov.ph/api/update-payment-status`,
                                          },
                                        };
                                        const jsonString = JSON.stringify(obj);
                                        const encrypted = CryptoJS.AES.encrypt(
                                          jsonString,
                                          secretKey
                                        ).toString();
                                        const encoded =
                                          encodeURIComponent(encrypted);
                                        // const url = `http://ctd01.a.testing.butuan.gov.ph/payment?data=${encoded}`;
                                        // const url = `http://epay01.a.staging.butuan.gov.ph/payment?data=${encoded}`;
                                        setIsPaying((prev) => !prev);
                                        const url = `http://epay01.a.staging.butuan.gov.ph/payment?data=${encoded}`;
                                        // const url =
                                        //   window.location.protocol +
                                        //   "//" +
                                        //   process.env.REACT_APP_EPAY +
                                        //   `payment?data=${encoded}`;
                                        // const url =
                                        //   window.location.protocol +
                                        //   "//" +
                                        //   process.env.REACT_APP_EPAY +
                                        //   `payment?data=${encoded}`;

                                        // const create = async () => {
                                        //   setIsPaying((prev) => !prev);
                                        //   try {
                                        //     const response = await axios({
                                        //       method: "POST",
                                        //       url: "api/client/create-db-state",
                                        //       params: {
                                        //         application_type:
                                        //           "occupational_permit",
                                        //         special_permit_application_id: [
                                        //           ...applicationId,
                                        //         ],
                                        //       },
                                        //     });
                                        //     if (response) {
                                        //       setTimeout(() => {
                                        //         window.location.href = url;
                                        //       }, 1000);
                                        //     }
                                        //   } catch (error) {
                                        //     console.log(error.response);
                                        //   }
                                        // };
                                        // create();

                                        window.location.href = url;
                                      } else {
                                        const formData = getFormData(formik);
                                        applicationId.forEach((id) => {
                                          formData.append(
                                            "special_permit_application_id[]",
                                            id
                                          );
                                        });
                                        handleSubmit(
                                          {
                                            url: "api/client/pay-permit",
                                            message: {
                                              title:
                                                "Are you sure you want to Proceed?",
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
                                    disabled={
                                      !approveTerm && paymentMethod === "online"
                                    }
                                  >
                                    {paymentMethod === "online"
                                      ? "Pay"
                                      : "Save"}
                                  </Button>
                                )}

                                <Button color="secondary" onClick={toggleModal}>
                                  Close
                                </Button>
                              </div>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
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
