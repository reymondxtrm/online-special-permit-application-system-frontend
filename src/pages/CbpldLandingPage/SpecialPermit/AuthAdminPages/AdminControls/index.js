import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import avatar1 from "../../../../../assets/images/users/AvatarTheLegendOfAng.jpg";
import { useSelector } from "react-redux";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useSubmit from "hooks/Common/useSubmit";
import AddExemptedCaseModal from "./Modals/AddExemptedCaseModal";
import TableLoaders from "components/Loaders/TableLoaders";
import AddApplicationPurposeModal from "./Modals/AddApplicationPurposeModal";
import FileViewerModal from "./Modals/FileViewerModal";

const AdminControls = () => {
  const [editOccupationState, seteditOccupationState] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [userData, setuserData] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const [discountedCasesData, setdiscountedCasesData] = useState([]);
  const [purposesData, setpurposesData] = useState([]);
  const [addExemptedCaseModal, setaddExemptedCaseModal] = useState(false);
  const [addApplicationPurposeModal, setaddApplicationPurposeModal] =
    useState(false);
  const userDetails = useSelector((state) => state.user);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const toggleRefresh = () => {
    setrefresh(!refresh);
  };

  const toggleApplicationPurposeModal = () => {
    setaddApplicationPurposeModal(!addApplicationPurposeModal);
  };
  const toggleExemptedCaseModal = () => {
    setaddExemptedCaseModal(!addExemptedCaseModal);
  };
  const toggleFileViewerModal = () => {
    setOpenFileModal((prev) => !prev);
  };

  useEffect(() => {
    setisLoading(true);
    axios
      .get("api/admin/get/exempted-cases", {
        //   params: { permit_type: "good_moral" },
      })
      .then(
        (res) => {
          setisLoading(false);

          setdiscountedCasesData(res.data);
        },
        (error) => {
          setisLoading(false);

          console.log(error);
        }
      );
  }, [refresh]);

  useEffect(() => {
    setisLoading(true);
    axios
      .get("api/admin/get/purposes", {
        //   params: { permit_type: "good_moral" },
      })
      .then(
        (res) => {
          setpurposesData(res.data);
        },
        (error) => {
          setisLoading(false);

          console.log(error);
        }
      );
  }, []);

  const initialValues = {
    companyName: userData?.user_occupation_details?.company_name || "",
    position: userData?.user_occupation_details?.position || "",
    dateHired: userData?.user_occupation_details?.date_hired || "",
    province: userData?.user_occupation_details?.province || "",
    city: userData?.user_occupation_details?.city || "",
    barangay: userData?.user_occupation_details?.barangay || "",
    addressLine: userData?.user_occupation_details?.address_line || "",
  };

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    position: Yup.string().required("Position is required"),
    dateHired: Yup.date().required("Date Hired is required"),
    province: Yup.string().required("Province is required"),
    city: Yup.string().required("City is required"),
    barangay: Yup.string().required("Barangay is required"),
    addressLine: Yup.string().required("Address Line is required"),
  });

  function formatDate(dateStr) {
    const date = new Date(dateStr);

    const month = date.toLocaleString("en-US", { month: "short" }); // 'Oct'
    const day = date.getDate(); // 19
    const year = date.getFullYear(); // 1996

    return `${month}. ${day}, ${year}`;
  }

  function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    // Adjust age if the current month/day is before the birthday
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }
  const showFileModal = () => {};

  return (
    <>
      <AddExemptedCaseModal
        openModal={addExemptedCaseModal}
        toggleModal={toggleExemptedCaseModal}
        toggleRefresh={toggleRefresh}
      />

      <AddApplicationPurposeModal
        openModal={addApplicationPurposeModal}
        toggleModal={toggleApplicationPurposeModal}
        toggleRefresh={toggleRefresh}
      />
      <FileViewerModal
        toggle={toggleFileViewerModal}
        isOpen={openFileModal}
        fileUrl={selectedFile}
      />
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        <Card
          className="shadow-lg"
          style={{
            minHeight: "83%",
            minWidth: "96%",
            display: "flex",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "10px 10px 30px ",
            marginTop: "40px",
          }}
        >
          <CardBody style={{ display: "flex", flexDirection: "column" }}>
            <Row style={{ flexGrow: 1 }}>
              <Col md="6" style={{ overflowY: "auto", maxHeight: "45vh" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    letterSpacing: ".2rem",
                    fontSize: "18pt",
                    margin: "0",
                    padding: "0 0 0 12px", // top, right, bottom, left
                    color: "#368be0",
                  }}
                >
                  {"EXEMPTED CASES"}
                </p>

                <div style={{ paddingTop: "15px", paddingLeft: "12px" }}>
                  <Button
                    color="success"
                    style={{
                      width: "85px",
                    }}
                    onClick={() => toggleExemptedCaseModal()}
                  >
                    Add New
                  </Button>
                </div>

                <div
                  style={{
                    paddingTop: "25px",
                    maxHeight: "35vh",
                    overflowY: "auto",
                  }}
                >
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Permit Type</th>
                        <th>Case Name</th>
                        <th>Ordinance</th>
                        <th>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <TableLoaders row={4} col={4} />
                      ) : (
                        discountedCasesData &&
                        (discountedCasesData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                textAlign: "center",
                              }}
                            >
                              No record found
                            </td>
                          </tr>
                        ) : (
                          discountedCasesData?.map((items, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {isLoading ? "loding ..." : items.permit_type}
                                </td>
                                <td>{isLoading ? "loding ..." : items.name}</td>
                                <td>
                                  {isLoading ? "loding ..." : items.ordinance}
                                </td>
                                <td>
                                  {isLoading ? (
                                    "loding ..."
                                  ) : (
                                    <Button
                                      onClick={() => {
                                        toggleFileViewerModal();
                                        setSelectedFile(items.attachment);
                                      }}
                                      color="primary"
                                    >
                                      FILE
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>

              <Col md="6" style={{ overflowY: "auto", maxHeight: "45vh" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    letterSpacing: ".2rem",
                    fontSize: "18pt",
                    margin: "0",
                    padding: "0 0 0 12px",
                    color: "#368be0",
                  }}
                >
                  APPLICATION PURPOSE
                </p>

                <div style={{ paddingTop: "15px", paddingLeft: "12px" }}>
                  <Button
                    color="success"
                    style={{
                      width: "85px",
                    }}
                    onClick={() => toggleApplicationPurposeModal()}
                  >
                    Add New
                  </Button>
                </div>

                <div
                  style={{
                    paddingTop: "25px",
                    overflowY: "auto",
                    maxHeight: "35vh",
                  }}
                >
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Permit Type</th>
                        <th>Purpose</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <TableLoaders row={4} col={4} />
                      ) : (
                        purposesData &&
                        (purposesData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                textAlign: "center",
                              }}
                            >
                              No record found
                            </td>
                          </tr>
                        ) : (
                          purposesData?.map((items, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {isLoading ? "loding ..." : items.permit_type}
                                </td>
                                <td>{isLoading ? "loding ..." : items.name}</td>
                                <td>{isLoading ? "loding ..." : items.type}</td>
                                <td>
                                  {isLoading
                                    ? "loding ..."
                                    : items.address_type}
                                </td>
                              </tr>
                            );
                          })
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Reymond R. Ricaborda</td>
                      <td>Reymond</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row> */}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default AdminControls;
