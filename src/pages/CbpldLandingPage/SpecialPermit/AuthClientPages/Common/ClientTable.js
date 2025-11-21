/* eslint-disable padded-blocks */
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
} from "reactstrap";
import moment from "moment";
import axios from "axios";
import useSubmit from "hooks/Common/useSubmit";
import OverTheCounterModal from "../Modals/PaymentModal";
import ImageViewer from "react-simple-image-viewer";
import ReuploadModal from "../Modals/ReuploadModal";
import { formateDateIntoString } from "common/utility/utilityFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientTableData,
  SpecialPermitClientSlice,
} from "features/SpecialPermitClient";
import Pagination from "components/Pagination";
import CedulaApplicationFormModal from "../../AuthAdminPages/Modals/CedulaApplicationFormModal";
const ClientTable = ({ applicationType, status, activeTab }) => {
  const handleSubmit = useSubmit();
  const [currentImage, setCurrentImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedImage, setSelectedImage] = useState("");
  const [refreshPage, setrefreshPage] = useState(false);
  const [overTheCounterModal, setoverTheCounterModal] = useState(false); // State for selected application's uploaded files
  const [selectedRow, setSelectedRow] = useState([]);
  const [amount, setamount] = useState();
  const [orderOfPaymentData, setorderOfPaymentData] = useState();
  const [reuploadModal, setreuploadModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [cedulaApplicationModal, setCedulaApplicationModal] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toggleRefresh = () => {
    setrefreshPage(!refreshPage);
  };
  const specialPermitClient = useSelector((state) => state.specialPermitClient);

  const toggleReUploadModal = () => {
    setreuploadModal(!reuploadModal);
  };

  const openImageViewer = useCallback((imageUrl) => {
    setCurrentImage(imageUrl);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(null);
  };

  const toggleOverTheCounterModal = () => {
    setoverTheCounterModal(!overTheCounterModal);
  };
  const toggleCedulaApplicationForm = () => {
    setCedulaApplicationModal((prev) => !prev);
  };
  useEffect(() => {
    const params = { status: status, permit_type: applicationType };
    if (applicationType === activeTab) {
      dispatch(getClientTableData(params));
      dispatch(SpecialPermitClientSlice.actions.setProps(params));
    }
  }, [activeTab, refreshPage]);

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const dateOfEvent = (date, time) => {
    if (date || time) {
      return (
        formateDateIntoString(date) +
        " " +
        moment(time, "h:mm A").format("h:mm A")
      );
    }
    return "";
  };
  const handleSelect = (id) => {
    setSelectedRow((prev) => {
      const rows = Array.isArray(prev) ? [...prev] : [];
      if (rows.includes(id)) {
        return rows.filter((item) => item !== id);
      } else {
        return [...rows, id];
      }
    });
  };

  const handleSelectAll = (rows) => {
    if (selectedRow.length === rows.length) {
      setSelectedRow([]);
    } else {
      setSelectedRow(rows.map((r) => r.id));
    }
  };

  useEffect(() => {
    if (selectedRow && specialPermitClient?.clientTableData?.data?.length > 0) {
      const selectedTotal = specialPermitClient?.clientTableData?.data
        ?.filter((app) => selectedRow.includes(app.id))
        ?.reduce(
          (acc, app) => {
            const billed = app.order_of_payment?.billed_amount || 0;
            const total = app.order_of_payment?.total_amount || 0;
            acc.billed_amount += billed;
            acc.total_amount += total;
            acc.fullname = app.order_of_payment?.fullname || "";
            acc.created_at = app.order_of_payment?.created_at || "";
            acc.quantity += 1;
            return acc;
          },
          { billed_amount: 0, total_amount: 0, quantity: 0 }
        );
      setPaymentDetails(selectedTotal);
    }
  }, [selectedRow, specialPermitClient?.clientTableData?.data?.length]);

  return (
    <>
      {isViewerOpen && currentImage && (
        <ImageViewer
          src={[currentImage]} // Pass the current image as an array
          currentIndex={0}
          onClose={closeImageViewer}
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          closeOnClickOutside={true}
        />
      )}
      {status === "returned" ? (
        <ReuploadModal
          toggleModal={toggleReUploadModal}
          openModal={reuploadModal}
          applicationId={selectedRow}
          toggleRefresh={toggleRefresh}
        />
      ) : null}
      <CedulaApplicationFormModal
        openModal={cedulaApplicationModal}
        toggleModal={toggleCedulaApplicationForm}
      />
      <OverTheCounterModal
        toggleModal={toggleOverTheCounterModal}
        openModal={overTheCounterModal}
        applicationId={selectedRow}
        toggleRefresh={toggleRefresh}
        applicationType={applicationType}
        paymentDetails={paymentDetails}
      />
      <div className="d-flex gap-2">
        <div>
          {status === "for_payment" && user?.accountType === "company" ? (
            <Button
              color="primary"
              onClick={() => {
                toggleOverTheCounterModal();
              }}
              disabled={selectedRow.length <= 0}
            >
              <i className="fa fas fa-money-bill-wave"></i>
              <span> Pay</span>
            </Button>
          ) : null}
        </div>
        <div>
          <Button color="success">
            <i className="mdi mdi-printer "></i>{" "}
            <span> Print Cedula Application Form</span>{" "}
          </Button>
        </div>
      </div>

      <div className="tableFixHead">
        <Table hover>
          <thead
            style={{
              backgroundColor: "white",
            }}
          >
            {user?.accountType === "company" && status === "for_payment" && (
              <tr></tr>
            )}
            <tr>
              <th style={{ width: "5%" }}>
                {status === "for_payment" && user?.accountType === "company" ? (
                  <Input
                    type="checkbox"
                    checked={
                      selectedRow?.length ===
                        specialPermitClient?.clientTableData.data?.length &&
                      specialPermitClient?.clientTableData?.data?.length !== 0
                    }
                    onClick={() => {
                      handleSelectAll(
                        specialPermitClient?.clientTableData?.data
                      );
                    }}
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : null}
              </th>
              <th>#</th>
              {status === "for_signature" && <th>Reference No</th>}

              {(applicationType === "mayors_permit" ||
                applicationType === "good_moral") && (
                <>
                  <th>Purpose</th>

                  {(status === "pending" || status === "declined") && (
                    <>
                      {applicationType === "good_moral" && (
                        <>
                          <th>Exemption</th>
                          <th>Exemption Status</th>
                        </>
                      )}
                      <th>Police Clearance</th>
                      <th>Barangay Clearance</th>
                      <th>Community Tax Certificate</th>
                      <th>Fiscal Clearance</th>
                      <th>Court Clearance</th>
                    </>
                  )}

                  {(status === "declined" || status === "returned") && (
                    <>
                      <th>Remarks</th>
                    </>
                  )}

                  {status === "returned" && (
                    <>
                      <th>O.R</th>
                    </>
                  )}

                  {status === "returned" && (
                    <>
                      <th>Actions</th>
                    </>
                  )}

                  {(status === "for_payment" ||
                    status === "for_payment_approval") && (
                    <>
                      <th>Amount</th>
                    </>
                  )}

                  {(status === "for_signature" || status === "completed") && (
                    <>
                      {applicationType === "good_moral" && (
                        <>
                          <th>Exemption</th>
                          <th>Exemption Status</th>
                        </>
                      )}
                      <th>Amount</th>
                    </>
                  )}
                </>
              )}

              {(applicationType === "event" ||
                applicationType === "motorcade" ||
                applicationType === "parade" ||
                applicationType === "recorrida" ||
                applicationType === "use_of_government_property") && (
                <>
                  <th>Name of Event</th>
                  <th>Date From</th>
                  <th>Date To</th>
                </>
              )}

              {applicationType === "occupational_permit" && (
                <>
                  {user?.accountType === "company" && (
                    <>
                      <th>Name of Requestor</th>
                      <th>Gender</th>
                      <th>Address</th>
                    </>
                  )}
                  {(status === "for_payment" ||
                    status === "for_payment_approval" ||
                    status === "declined") && <th> Amount</th>}
                </>
              )}
              {status === "for_payment" &&
              user?.accountType === "individual" ? (
                <th>Actions</th>
              ) : null}
              {status === "completed" ? <th>Special Permit</th> : null}
            </tr>
          </thead>
          <tbody>
            {specialPermitClient?.getTableDataIsFetching ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : specialPermitClient?.clientTableData?.data?.length > 0 ? (
              specialPermitClient?.clientTableData?.data.map(
                (application, index) => (
                  <tr key={application.id}>
                    <td>
                      {user?.accountType === "company" &&
                        status === "for_payment" && (
                          <Input
                            type="checkbox"
                            checked={selectedRow?.includes(application.id)}
                            onClick={(e) => {
                              handleSelect(application.id);
                            }}
                            style={{ width: "20px", height: "20px" }}
                          />
                        )}
                    </td>

                    <td>{`${index + 1}.`}</td>
                    {status === "for_signature" && (
                      <td>{application.reference_no}</td>
                    )}

                    {(applicationType === "mayors_permit" ||
                      applicationType === "good_moral") && (
                      <>
                        <td>{application.application_purpose?.name}</td>

                        {(status === "pending" || status === "declined") && (
                          <>
                            {applicationType === "good_moral" && (
                              <>
                                <td>
                                  {application.permit_application_exemption
                                    ?.exempted_case_name
                                    ? application.permit_application_exemption
                                        .exempted_case_name
                                    : "N/A"}
                                </td>
                                <td>
                                  {application.permit_application_exemption
                                    ?.status
                                    ? application.permit_application_exemption
                                        .status
                                    : "N/A"}
                                </td>
                              </>
                            )}
                            <td>
                              {application.uploaded_file?.police_clearance ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.police_clearance}`}
                                  alt={`Thumbnail`}
                                  style={{
                                    width: "100px",
                                    height: "50px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleViewImage(
                                      `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.police_clearance}`
                                    )
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>
                              {application.uploaded_file?.barangay_clearance &&
                              status !== "for_payment" ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.barangay_clearance}`}
                                  alt={`Thumbnail`}
                                  style={{
                                    width: "100px",
                                    height: "50px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleViewImage(
                                      `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.barangay_clearance}`
                                    )
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>

                            <td>
                              {application.uploaded_file
                                ?.community_tax_certificate &&
                              status !== "for_payment" ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.community_tax_certificate}`}
                                  alt={`Thumbnail`}
                                  style={{
                                    width: "100px",
                                    height: "50px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleViewImage(
                                      `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.community_tax_certificate}`
                                    )
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>

                            <td>
                              {application.uploaded_file?.fiscal_clearance &&
                              status !== "for_payment" ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.fiscal_clearance}`}
                                  alt={`Thumbnail`}
                                  style={{
                                    width: "100px",
                                    height: "50px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleViewImage(
                                      `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.fiscal_clearance}`
                                    )
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>
                              {application.uploaded_file?.court_clearance &&
                              status !== "for_payment" ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.court_clearance}`}
                                  alt={`Thumbnail`}
                                  style={{
                                    width: "100px",
                                    height: "50px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleViewImage(
                                      `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.court_clearance}`
                                    )
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </>
                        )}

                        {(status === "declined" || status === "returned") && (
                          <td>
                            {application.status_histories
                              ? application.status_histories.map((items) => {
                                  return items.remarks;
                                })
                              : "N/A"}
                          </td>
                        )}

                        {status === "returned" &&
                          application?.order_of_payment?.payment_detail
                            ?.attachment && (
                            <td>
                              <img
                                src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application?.order_of_payment?.payment_detail?.attachment}`}
                                alt={`Thumbnail`}
                                style={{
                                  width: "100px",
                                  height: "50px",
                                  margin: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  openImageViewer(
                                    `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application?.order_of_payment?.payment_detail?.attachment}`
                                  )
                                }
                              />
                            </td>
                          )}

                        {status === "returned" && (
                          <td>
                            <Button
                              color="primary"
                              onClick={() => {
                                setSelectedRow([application?.id]);

                                toggleReUploadModal();
                              }}
                            >
                              Reupload O.R
                            </Button>
                          </td>
                        )}

                        {(status === "for_payment" ||
                          status === "for_payment_approval") && (
                          <>
                            <td>
                              {application.order_of_payment?.total_amount}
                            </td>
                          </>
                        )}

                        {(status === "for_signature" ||
                          status === "completed") && (
                          <>
                            {applicationType === "good_moral" && (
                              <>
                                <td>
                                  {application.permit_application_exemption
                                    ?.exempted_case_name
                                    ? application.permit_application_exemption
                                        .exempted_case_name
                                    : "N/A"}
                                </td>
                                <td>
                                  {application.permit_application_exemption
                                    ?.status
                                    ? application.permit_application_exemption
                                        .status
                                    : "N/A"}
                                </td>
                              </>
                            )}
                            <td>
                              {application.order_of_payment?.total_amount}
                            </td>
                          </>
                        )}
                      </>
                    )}
                    {applicationType === "occupational_permit" ? (
                      <>
                        {user?.accountType === "company" && (
                          <>
                            <td>{application?.requestor_name}</td>
                            <td>{application?.corporation_member?.sex}</td>
                            <td>
                              {
                                application?.corporation_member
                                  ?.user_addresses_morph?.[0]
                                  ?.corporation_full_address
                              }
                            </td>
                          </>
                        )}

                        <td>{application?.order_of_payment?.total_amount}</td>
                      </>
                    ) : null}

                    {applicationType === "event" ||
                    applicationType === "motorcade" ||
                    applicationType === "parade" ||
                    applicationType === "recorrida" ||
                    applicationType === "use_of_government_property" ? (
                      // (applicationType === "use_of_government_property" &&
                      //   status !== "for_payment")

                      <>
                        <td>{application?.requestor_name}</td>
                        <td>{application?.event_name}</td>
                        <td>
                          {dateOfEvent(
                            application?.event_date_from,
                            application?.event_date_to
                          )}
                        </td>

                        <td>
                          {dateOfEvent(
                            application?.event_date_from,
                            application?.event_date_to
                          )}
                        </td>
                      </>
                    ) : null}
                    {status === "for_payment" &&
                    user?.accountType === "individual" ? (
                      <td>
                        <Button
                          color="primary"
                          onClick={() => {
                            toggleOverTheCounterModal();
                            setSelectedRow([application?.id]);
                          }}
                        >
                          Pay
                        </Button>
                      </td>
                    ) : null}
                    {status === "completed" ? (
                      <td>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <div style={{ paddingRight: "10px" }}>
                            <Button
                              color="success"
                              style={{ width: "95px" }}
                              onClick={() => {
                                const fileId = application?.id;

                                if (!fileId) {
                                  alert(
                                    "Special Permit ID is required for download."
                                  );
                                  return;
                                }

                                axios({
                                  url: `/api/client/download-permit`, // Backend endpoint
                                  method: "GET",
                                  responseType: "blob", // Important for binary data like PDFs
                                  params: {
                                    special_permit_id: fileId, // Send the permit ID as a query parameter
                                  },
                                })
                                  .then((response) => {
                                    // Create a URL for the file and trigger the download
                                    const url = window.URL.createObjectURL(
                                      new Blob([response.data])
                                    );
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute(
                                      "download",
                                      `${applicationType}_${fileId}.pdf` // Set a file name
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                    link.parentNode.removeChild(link); // Cleanup the link element
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Error downloading file:",
                                      error
                                    );
                                    alert(
                                      "Failed to download the file. Please try again."
                                    );
                                  });
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination
          dataProps={specialPermitClient.clientTableData}
          setDataProps={SpecialPermitClientSlice.actions.setDataProps}
          setShowLoading={SpecialPermitClientSlice.actions.setShowLoading}
          isLoading={specialPermitClient.getTableDataIsFetching}
          params={specialPermitClient.params}
        />
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Image Viewer</ModalHeader>
        <ModalBody className="text-center">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Document"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          ) : (
            <p>No image selected</p>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ClientTable;
