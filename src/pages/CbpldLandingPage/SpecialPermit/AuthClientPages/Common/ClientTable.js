/* eslint-disable padded-blocks */
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import moment from "moment";
import axios from "axios";
import useSubmit from "hooks/Common/useSubmit";
import OverTheCounterModal from "../Modals/OverTheCounterModal";
import ImageViewer from "react-simple-image-viewer";
import ReuploadModal from "../Modals/ReuploadModal";
import { formateDateIntoString } from "common/utility/utilityFunction";
const ClientTable = ({ applicationType, status, activeTab }) => {
  const handleSubmit = useSubmit();

  const [currentImage, setCurrentImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [applications, setApplications] = useState([]); // State for storing API data
  const [loading, setLoading] = useState(false); // State for loader
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedImage, setSelectedImage] = useState("");
  const [refreshPage, setrefreshPage] = useState(false);
  const [overTheCounterModal, setoverTheCounterModal] = useState(false); // State for selected application's uploaded files
  const [applicationId, setapplicationId] = useState();
  const [amount, setamount] = useState();
  const [orderOfPaymentData, setorderOfPaymentData] = useState();
  const [reuploadModal, setreuploadModal] = useState(false);
  const toggleRefresh = () => {
    setrefreshPage(!refreshPage);
  };

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

  useEffect(() => {
    if (applicationType === activeTab) {
      setLoading(true);

      axios
        .get("api/client/special-permit/applications", {
          params: { status: status, permit_type: applicationType },
        })
        .then(
          (res) => {
            setApplications(res.data);
            setLoading(false);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [activeTab, refreshPage]);

  // Function to handle opening the modal
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const dateOfEvent = (date, time) => {
    if (date || time) {
      // if (date === date && time) {
      //   return (
      //     formateDateIntoString(date) +
      //     " " +
      //     moment(time, "h:mm A").format("h:mm A") +
      //     " to " +
      //     moment(time, "h:mm A").format("h:mm A")
      //   );
      // }
      return (
        formateDateIntoString(date) +
        " " +
        moment(time, "h:mm A").format("h:mm A")
      );
    }

    return "";
  };
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
          applicationId={applicationId}
          toggleRefresh={toggleRefresh}
        />
      ) : null}
      <OverTheCounterModal
        toggleModal={toggleOverTheCounterModal}
        openModal={overTheCounterModal}
        applicationId={applicationId}
        amount={amount}
        toggleRefresh={toggleRefresh}
        orderOfPaymentData={orderOfPaymentData}
        applicationType={applicationType}
      />
      <div className="tableFixHead">
        <Table hover>
          <thead
            style={{
              backgroundColor: "white",
            }}
          >
            <tr>
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
                  <th>Name of Requestor/Organization</th>
                  <th>Name of Event</th>
                  <th>Date From</th>
                  <th>Date To</th>
                </>
              )}

              {applicationType === "occupational_permit" &&
              status !== "for_payment" ? (
                <>
                  <th>Certificate Of Employment</th>
                </>
              ) : null}

              {applicationType === "occupational_permit" &&
              status !== "for_payment" ? (
                <>
                  <th>Community Tax Certificate</th>
                </>
              ) : null}

              {applicationType === "occupational_permit" &&
              status !== "for_payment" ? (
                <>
                  <th>ID Picture</th>
                  <th>Health Certificate</th>
                  <th>Training Certificate</th>
                </>
              ) : null}

              {status === "for_payment" ? <th>Actions</th> : null}
              {status === "completed" ? <th>Special Permit</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : applications.length > 0 ? (
              applications.map((application, index) => (
                <tr key={application.id}>
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

                      {status === "returned" && (
                        <td>
                          <img
                            src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.order_of_payment.payment_detail.attachment}`}
                            alt={`Thumbnail`}
                            style={{
                              width: "100px",
                              height: "50px",
                              margin: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              openImageViewer(
                                `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.order_of_payment.payment_detail.attachment}`
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
                              setapplicationId(application?.id);

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
                          <td>{application.order_of_payment?.total_amount}</td>
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
                          <td>{application.order_of_payment?.total_amount}</td>
                        </>
                      )}
                    </>
                  )}

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
                      {/* <td>
                        {application.uploaded_file?.route_plan ? (
                          <Button
                            color="primary"
                            onClick={() =>
                              handleViewImage(
                                `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.route_plan}`
                              )
                            }
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {application.uploaded_file?.request_letter &&
                        status !== "for_payment" ? (
                          <Button
                            color="primary"
                            onClick={() =>
                              handleViewImage(
                                `${window.location.protocol}//${process.env.REACT_APP_API}storage/${application.uploaded_file.request_letter}`
                              )
                            }
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td> */}
                    </>
                  ) : null}

                  {status === "for_payment" ? (
                    <td>
                      <UncontrolledDropdown className="me-2" direction="end">
                        <DropdownToggle caret color="primary">
                          Payment Options
                        </DropdownToggle>
                        <DropdownMenu
                          style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            zIndex: 1050, // High z-index to appear above
                            position: "absolute", // Ensure it's detached from parent
                          }}
                        >
                          <DropdownItem onClick={() => {}}>Online</DropdownItem>

                          <DropdownItem
                            onClick={() => {
                              toggleOverTheCounterModal();
                              setapplicationId(application?.id);
                              setorderOfPaymentData(
                                application?.order_of_payment
                              );
                              setamount(
                                application.order_of_payment?.total_amount
                              );
                            }}
                          >
                            Over the Counter
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  ) : null}

                  {status === "completed" ? (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          // justifyContent: "space-between",
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
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
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
