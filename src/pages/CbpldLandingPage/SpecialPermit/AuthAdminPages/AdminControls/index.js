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
  Container,
} from "reactstrap";
import avatar1 from "../../../../../assets/images/users/AvatarTheLegendOfAng.jpg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useSubmit from "hooks/Common/useSubmit";
import AddExemptedCaseModal from "./Modals/AddExemptedCaseModal";
import TableLoaders from "components/Loaders/TableLoaders";
import AddApplicationPurposeModal from "./Modals/AddApplicationPurposeModal";
import FileViewerModal from "./Modals/FileViewerModal";
import AddGovernmentPropertyModal from "./Modals/AddGovernmentPropertyModal";
import Swal from "sweetalert2";
import {
  getExemptedCases,
  getGovernmentProperty,
  getPurpose,
} from "features/AdminSlice/AdminSlice";
import useDelete from "hooks/Common/useDelete";

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
  const [governmentProperty, setGovernmetProperty] = useState([]);
  const [openPropertyModal, setOpenPropertyModal] = useState(false);
  const [mode, setMode] = useState();
  const [property, setProperty] = useState();
  const [selectedApplication, setSelectedApplication] = useState();
  // const [selectedExemption, setSelectedExemption] = useState();
  const dispatch = useDispatch();

  const handleSubmit = useSubmit();
  const deleteHandle = useDelete();
  const formikRef = useRef(null);
  const admin = useSelector((state) => state.batsAdmin);

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
    dispatch(getGovernmentProperty());
    dispatch(getPurpose());
    dispatch(getExemptedCases());
  }, [refresh]);

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
  const togglePropertyModal = (mode) => {
    setOpenPropertyModal((prev) => !prev);
    setMode(mode);
  };
  const handleDeleteExemptedCase = (id) => {
    deleteHandle(
      { url: "api/admin/delete/exempted-cases", params: { purpose_id: id } },
      [getExemptedCases()],
      []
    );
  };

  const handleDelete = (id) => {
    deleteHandle(
      { url: "api/delete-government-property", params: { id: id } },
      [getGovernmentProperty()],
      []
    );
  };
  const handleDeleteApplicationPurpose = (id) => {
    deleteHandle(
      {
        url: "api/admin/delete/application-purpose",
        params: { purpose_id: id },
      },
      [getPurpose()],
      []
    );
  };

  return (
    <>
      {/* <AddExemptedCaseModal
        openModal={addExemptedCaseModal}
        toggleModal={toggleExemptedCaseModal}
        toggleRefresh={toggleRefresh}
      /> */}

      <AddApplicationPurposeModal
        openModal={addApplicationPurposeModal}
        toggleModal={toggleApplicationPurposeModal}
        toggleRefresh={toggleRefresh}
        mode={mode}
        applicationPurpose={selectedApplication}
      />
      <FileViewerModal
        toggle={toggleFileViewerModal}
        isOpen={openFileModal}
        fileUrl={selectedFile}
      />
      <AddGovernmentPropertyModal
        toggle={togglePropertyModal}
        isOpen={openPropertyModal}
        mode={mode}
        property={property}
      />
      <div className="page-content">
        <Container fluid>
          <Row style={{ flexGrow: 1 }}>
            <Col>
              <Row>
                <Card>
                  <CardBody>
                    <Col
                      md="12"
                      style={{ overflowY: "auto", maxHeight: "45vh" }}
                    >
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
                          onClick={() => {
                            toggleExemptedCaseModal();
                            setMode("add");
                          }}
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
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admin.getExemptedCasesIsFetching ? (
                              <TableLoaders row={4} col={4} />
                            ) : (
                              admin.exemptedCases &&
                              (admin.exemptedCases.length === 0 ? (
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
                                admin.exemptedCases?.map((items, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {isLoading
                                          ? "loding ..."
                                          : items.permit_type}
                                      </td>
                                      <td>
                                        {isLoading ? "loding ..." : items.name}
                                      </td>
                                      <td>
                                        {isLoading
                                          ? "loding ..."
                                          : items.ordinance}
                                      </td>
                                      <td>
                                        {isLoading ? (
                                          "loding ..."
                                        ) : (
                                          <Button
                                            size="sm"
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
                                      <td>
                                        <div className="d-flex gap-2">
                                          <Button
                                            size="sm"
                                            color="warning"
                                            onClick={() => {
                                              setMode("update");
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() =>
                                              handleDeleteExemptedCase(items.id)
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </div>
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
                  </CardBody>
                </Card>
              </Row>
              <Row>
                <Card>
                  <CardBody>
                    <Col md="12">
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
                        {"Government Property"}
                      </p>

                      <div style={{ paddingTop: "15px", paddingLeft: "12px" }}>
                        <Button
                          color="success"
                          style={{
                            width: "85px",
                          }}
                          onClick={() => {
                            togglePropertyModal("add");
                          }}
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
                              <th>#</th>
                              <th>Property Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admin.getGovernmentPropertyIsFetching ? (
                              <TableLoaders row={4} col={4} />
                            ) : (
                              admin.governmentProperty &&
                              (admin.governmentProperty.length === 0 ? (
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
                                admin.governmentProperty?.map(
                                  (items, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {isLoading
                                            ? "loding ..."
                                            : items.name}
                                        </td>
                                        <td>
                                          {isLoading ? (
                                            "loding ..."
                                          ) : (
                                            <div className="d-flex gap-2">
                                              <Button
                                                color="warning"
                                                size="sm"
                                                onClick={() => {
                                                  togglePropertyModal("edit");
                                                  setProperty(items);
                                                }}
                                              >
                                                Edit
                                              </Button>
                                              <Button
                                                color="danger "
                                                size="sm"
                                                onClick={() =>
                                                  handleDelete(items.id)
                                                }
                                              >
                                                Delete
                                              </Button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
              </Row>
            </Col>

            <Col>
              <Card>
                <CardBody>
                  <Row>
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
                        onClick={() => {
                          toggleApplicationPurposeModal();
                          setMode("add");
                        }}
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
                          {admin.getPurposeIsFetching ? (
                            <TableLoaders row={4} col={4} />
                          ) : (
                            admin.purposes &&
                            (admin.purposes.length === 0 ? (
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
                              admin.purposes?.map((items, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {isLoading
                                        ? "loding ..."
                                        : items.permit_type}
                                    </td>
                                    <td>
                                      {isLoading ? "loding ..." : items.name}
                                    </td>
                                    <td>
                                      {isLoading ? "loding ..." : items.type}
                                    </td>
                                    {items.type === "temporary" ? (
                                      <div className="d-flex gap-2">
                                        <Button
                                          size="sm"
                                          color="warning "
                                          onClick={() => {
                                            setSelectedApplication(items);
                                            setMode("update");
                                            toggleApplicationPurposeModal();
                                          }}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          color="danger"
                                          onClick={() =>
                                            handleDeleteApplicationPurpose(
                                              items.id
                                            )
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </tr>
                                );
                              })
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AdminControls;
