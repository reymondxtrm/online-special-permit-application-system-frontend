// /* eslint-disable padded-blocks */

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import Swal from "sweetalert2";
import moment from "moment";
import axios from "axios";
import AttachmentModal from "../Modals/AttachmentModal";
import useSubmit from "hooks/Common/useSubmit";
import UploadPermitModal from "../Modals/UploadPermitModal";
import GeneratePermitModal from "../Modals/GeneratePermitModal";
import ReviewPurposeModal from "../Modals/ReviewPurposeModal";
import ReviewDiscountModal from "../Modals/ReviewDiscountModal";
import AmountModal from "../Modals/AmountModal";
import ReviewExemptionModal from "../Modals/ReviewExemptionModal";
import ImageViewer from "react-simple-image-viewer";
import RemarksModal from "../Modals/RemarksModal";
import ReturnRemarksModal from "../Modals/ReturnRemarksModal";
import { PhotoView } from "react-photo-view";
import Viewer from "react-viewer";
import { formateDateIntoString } from "common/utility/utilityFunction";
import { motion } from "motion/react";
import RequestForm from "../Printables/RequestForm";

const AdminTable = ({ applicationType, status, activeTab }) => {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [applications, setApplications] = useState([]); // State for storing API data
  const [loading, setLoading] = useState(false); // State for loader
  const [isModalOpen, setIsModalOpen] = useState(false); // State for image viewer modal
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [reviewPurposeModal, setreviewPurposeModal] = useState(false);
  const [reviewExemptionModal, setreviewExemptionModal] = useState(false);
  const [amountModal, setamountModal] = useState(false);
  const [remarksModal, setremarksModal] = useState(false);
  const [returnRemarksModal, setreturnRemarksModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(""); // State for the selected image
  const [selectedFiles, setSelectedFiles] = useState(null); // State for selected application's uploaded files
  const [refreshPage, setrefreshPage] = useState(false);
  const [generateModal, setgenerateModal] = useState(false);
  const [uploadModal, setuploadModal] = useState(false);
  const [specialPermitID, setspecialPermitID] = useState(null);
  const [purposeData, setpurposeData] = useState({});
  const [exemptionData, setexemptionData] = useState({});
  const [purposeOptions, setpurposeOptions] = useState();
  const [applicationId, setapplicationId] = useState(null);
  const [orderOfPaymentId, setorderOfPaymentId] = useState(null);
  const [name, setname] = useState(null);
  const [purpose, setpurpose] = useState(null);
  const [referenceNo, setreferenceNo] = useState(null);
  const [imageViewerScale, setimageViewScale] = useState(1);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [openRequestFormModal, setOpenRequestFormModal] = useState(false);

  const formatName = (name) => {
    const nameParts = name.split(" ");
    const firstName = nameParts[0]?.toUpperCase();
    const middleName = nameParts[1]?.[0]?.toUpperCase() + ".";
    const lastName = nameParts[2]?.toUpperCase();

    return `${firstName} ${middleName} ${lastName}`;
  };
  const toggleGenerateModal = () => {
    setgenerateModal(!generateModal);
  };

  const toggleRemarksModal = useCallback(() => {
    setremarksModal(!remarksModal);
  }, []);
  const openImageViewer = useCallback((imageUrl) => {
    setCurrentImage(imageUrl);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(null);
  };
  const toggleRefresh = useCallback(() => {
    setrefreshPage(!refreshPage);
  }, []);

  const toggleAmountModal = () => {
    setamountModal(!amountModal);
  };

  const toggleReturnRemarksModal = () => {
    setreturnRemarksModal(!returnRemarksModal);
  };
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  useEffect(() => {
    if (activeTab === "mayors_permit" || activeTab === "good_moral") {
      axios
        .get("api/get-purpose", {
          params: { permit_type: "good_moral" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));
            // const updatedOptions = [{ value: 0, label: "Others" }, ...options];
            // options.push({ value: "others", label: "Others" });
            setpurposeOptions(options);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [activeTab]);

  const togglePurposeModal = () => {
    setreviewPurposeModal(!reviewPurposeModal);
  };

  const toggleExemptionModal = () => {
    setreviewExemptionModal(!reviewExemptionModal);
  };
  useEffect(() => {
    if (applicationType === activeTab) {
      setLoading(true);

      axios
        .get("api/admin/special-permit/applications", {
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

  // Function to handle opening the image viewer modal
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to toggle image viewer modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to open the attachment modal
  const handleViewAttachments = (uploadedFiles) => {
    setSelectedFiles(uploadedFiles);
    setAttachmentModal(true);
  };
  // Function to toggle attachment modal
  const toggleAttachmentModal = () => {
    setAttachmentModal(!attachmentModal);
  };
  const toggleUploadModal = () => {
    setuploadModal(!uploadModal);
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
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3)); // max 3x
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1)); // min 1x
  const handleSelectRow = (index) => {
    if (selectedItem.includes(index)) {
      const filteritem = selectedItem.filter((id) => id !== index);
      setSelectedRow(filteritem);
    } else {
      setSelectedRow((prevItems) => [...prevItems, index]);
    }
  };
  const toggleRequestFormModal = () => {
    setOpenRequestFormModal((prev) => !prev);
  };

  // useEffect(() => {
  //   const channel = echo.channel("permits");

  //   channel.listen(`permit.${permitType}`, (event) => {
  //     console.log("Permit approved:", event);
  //     alert(`Permit #${event.permit.id} has been approved!`);
  //   });

  //   return () => {
  //     channel.stopListening("PermitApproved");
  //     echo.leaveChannel("permits");
  //   };
  // }, []);
  return (
    <>
      {/* Attachment Modal */}

      <AttachmentModal
        toggleModal={toggleAttachmentModal}
        openModal={attachmentModal}
        uploadedFiles={selectedFiles} // Pass the uploaded files to the modal
        applicationType={applicationType}
        mainActiveTab={activeTab}
      />
      <RequestForm
        isOpen={openRequestFormModal}
        toggle={toggleRequestFormModal}
      />

      {status === "pending" ? (
        <>
          <ReviewPurposeModal
            toggleModal={togglePurposeModal}
            openModal={reviewPurposeModal}
            purposeData={purposeData}
            purposeOptions={purposeOptions}
            toggleRefresh={toggleRefresh}
          />

          <ReviewExemptionModal
            toggleModal={toggleExemptionModal}
            openModal={reviewExemptionModal}
            exemptionData={exemptionData}
            toggleRefresh={toggleRefresh}
          />
          <AmountModal
            toggleModal={toggleAmountModal}
            openModal={amountModal}
            applicationId={applicationId}
            toggleRefresh={toggleRefresh}
            permitType={applicationType}
          />
          <RemarksModal
            toggleModal={toggleRemarksModal}
            openModal={remarksModal}
            applicationId={applicationId}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}

      {status === "for_payment_approval" ? (
        <>
          <ReturnRemarksModal
            toggleModal={toggleReturnRemarksModal}
            openModal={returnRemarksModal}
            orderOfPaymentId={orderOfPaymentId}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}

      {status === "for_signature" ? (
        <>
          <GeneratePermitModal
            toggleModal={toggleGenerateModal}
            openModal={generateModal}
            permitType={applicationType}
            name={name}
            purpose={purpose}
            referenceNo={referenceNo}
            specialPermitID={specialPermitID}
          />
          <UploadPermitModal
            toggleModal={toggleUploadModal}
            openModal={uploadModal}
            special_permit_application_id={specialPermitID}
            activeTab={activeTab}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}

      <div className="tableFixHead">
        <div>
          {isViewerOpen && currentImage && (
            <>
              {/* <ImageViewer
                src={[currentImage]} // Pass the current image as an array
                currentIndex={0}
                onClose={closeImageViewer}
                closeOnClickOutside={true}
                backgroundStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  transform: `scale(${imageViewerScale})`,
                  transition: "transform 0.2s",
                }}
              /> */}

              <Viewer
                visible={isViewerOpen}
                onClose={closeImageViewer}
                images={[{ src: currentImage, alt: "Attachment" }]}
                activeIndex={0}
                rotatable
                zoomable
                scalable
                attribute={false}
                zIndex={2000}
              />
            </>
          )}
        </div>

        <Table hover>
          <thead
            className="table-light"
            style={{
              boxShadow: "0 2px 4px rgb(0,0,0,0.1)",
              zIndex: "1",
              position: "relative",
            }}
          >
            <tr>
              <th>#</th>
              {status === "for_signature" && <th>Reference No</th>}
              <th>Name</th>
              {applicationType === "mayors_permit" ||
              applicationType === "good_moral" ||
              applicationType === "occupational_permit" ? (
                <>
                  {applicationType === "mayors_permit" ||
                  applicationType === "good_moral" ? (
                    <>
                      <th>Purpose</th>
                      {applicationType === "good_moral" && (
                        <>
                          <th>Exemption</th>
                          <th>Exemption Status</th>
                        </>
                      )}
                    </>
                  ) : null}

                  {/* {applicationType === "good_moral" && (
                    <th>Name of Employer</th>
                  )} */}
                  <th>Sex</th>
                  <th>Email</th>
                  <th>Contact</th>

                  {/* <th>Address</th> */}
                </>
              ) : null}
              {status === "for_payment" ||
              status === "for_payment_approval" ||
              status === "returned" ? (
                <>
                  <th>Amount</th>
                </>
              ) : null}

              {applicationType === "event" ||
              applicationType === "motorcade" ||
              applicationType === "parade" ||
              applicationType === "recorrida" ||
              applicationType === "use_of_government_property" ? (
                <>
                  <th>Contact</th>
                  <th>Name of Requestor/Organization</th>
                  <th>Name of Event</th>
                  <th>Date From</th>
                  <th>Date To</th>
                </>
              ) : null}
              <th>Attachments</th>
              {status === "returned" ? <th>Remarks</th> : null}

              {status === "pending" ? <th>Actions</th> : null}
              {status === "for_signature" ? <th>Actions</th> : null}
              {status === "for_payment_approval" ? <th>Actions</th> : null}
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
                <React.Fragment key={application.id}>
                  <tr>
                    <td>{`${index + 1}.`}</td>
                    {status === "for_signature" && (
                      <td>{application.reference_no}</td>
                    )}
                    <td>{application.user?.fullname}</td>
                    {applicationType === "mayors_permit" ||
                    applicationType === "good_moral" ||
                    applicationType === "occupational_permit" ? (
                      <>
                        {applicationType === "mayors_permit" ||
                        applicationType === "good_moral" ? (
                          <td>{application.application_purpose?.name}</td>
                        ) : null}

                        {/* {applicationType === "good_moral" && (
                        <th>Name of Employer</th>
                      )} */}

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
                              {application.permit_application_exemption?.status
                                ? application.permit_application_exemption
                                    .status
                                : "N/A"}
                            </td>
                          </>
                        )}
                        <td>{application.user?.gender}</td>
                        <td>{application.user?.email}</td>
                        <td>
                          {
                            application.user?.user_phone_numbers[0]
                              ?.phone_number
                          }
                        </td>
                      </>
                    ) : null}
                    {status === "for_payment" ||
                    status === "for_payment_approval" ||
                    status === "returned" ? (
                      <>
                        <td>{application.order_of_payment?.total_amount}</td>
                      </>
                    ) : null}
                    {applicationType === "event" ||
                    applicationType === "motorcade" ||
                    applicationType === "parade" ||
                    applicationType === "recorrida" ||
                    applicationType === "use_of_government_property" ? (
                      <>
                        <td>
                          {
                            application.user?.user_phone_numbers[0]
                              ?.phone_number
                          }
                        </td>
                        <td>{application?.requestor_name}</td>
                        <td>{application?.event_name}</td>
                        <td>
                          {dateOfEvent(
                            application?.event_date_from,
                            application?.event_time_from
                          )}
                        </td>

                        <td>
                          {dateOfEvent(
                            application?.event_date_to,
                            application?.event_time_to
                          )}
                        </td>
                      </>
                    ) : null}
                    {applicationType === "occupational_permit" ? (
                      <>
                        <td>{application.application_purpose?.name}</td>

                        {/* {applicationType === "good_moral" && (
                        <th>Name of Employer</th>
                      )} */}
                        <td>{application.user?.gender}</td>
                        <td>{application.user?.email}</td>
                        <td>
                          {
                            application.user?.user_phone_numbers[0]
                              ?.phone_number
                          }
                        </td>
                        <td>{application.user?.email}</td>
                      </>
                    ) : null}
                    <td>
                      {status === "for_payment_approval" ||
                      status === "returned" ? (
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
                      ) : (
                        <Button
                          color="success"
                          onClick={() =>
                            handleViewAttachments(application.uploaded_file)
                          }
                        >
                          Attachments
                        </Button>
                      )}
                    </td>
                    {status === "returned" ? (
                      <td>
                        {application.status_histories
                          ? application.status_histories.map((items) => {
                              return items.remarks;
                            })
                          : "N/A"}
                      </td>
                    ) : null}
                    {status === "pending" ? (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            // justifyContent: "space-between",
                          }}
                        >
                          <UncontrolledDropdown
                            className="me-2"
                            direction="end"
                          >
                            <DropdownToggle caret color="primary">
                              Actions
                            </DropdownToggle>
                            <DropdownMenu
                              style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 1050, // High z-index to appear above
                                position: "absolute", // Ensure it's detached from parent
                              }}
                            >
                              <DropdownItem
                                onClick={() => {
                                  if (
                                    application.permit_application_exemption &&
                                    application.permit_application_exemption
                                      ?.status === "pending"
                                  ) {
                                    Swal.fire({
                                      title: "Review Discount",
                                      text: "Please review exemption before proceeding.",
                                      icon: "warning",
                                      confirmButtonText: "Okay",
                                    });
                                    return;
                                  }
                                  if (
                                    application.application_purpose?.type ===
                                    "temporary"
                                  ) {
                                    Swal.fire({
                                      title: "Review Purpose",
                                      text: "Please review purpose before proceeding.",
                                      icon: "warning",
                                      confirmButtonText: "Okay",
                                    });
                                    return;
                                  }

                                  setapplicationId(application?.id);
                                  toggleAmountModal();
                                }}
                              >
                                Proceed To Order of Payment
                              </DropdownItem>

                              {application.application_purpose?.type ===
                              "temporary" ? (
                                <DropdownItem
                                  onClick={() => {
                                    togglePurposeModal();
                                    setpurposeData(
                                      application.application_purpose
                                    );

                                    setpurposeData((prevState) => {
                                      return {
                                        ...prevState,
                                        ...application.application_purpose,
                                        application_id: application.id,
                                      };
                                    });
                                  }}
                                >
                                  Review Purpose
                                </DropdownItem>
                              ) : null}

                              {application.permit_application_exemption &&
                                (application.permit_application_exemption
                                  ?.status === "pending" ? (
                                  <DropdownItem
                                    onClick={() => {
                                      toggleExemptionModal();
                                      setexemptionData(
                                        application.permit_application_exemption
                                      );
                                    }}
                                  >
                                    Review Exemption
                                  </DropdownItem>
                                ) : null)}

                              <DropdownItem
                                onClick={() => {
                                  toggleRemarksModal();
                                  setapplicationId(application?.id);
                                }}
                              >
                                Decline
                              </DropdownItem>
                              <DropdownItem onClick={toggleRequestFormModal}>
                                View Request Form
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </td>
                    ) : null}
                    {status === "for_signature" ? (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            // justifyContent: "space-between",
                          }}
                        >
                          <div style={{ paddingRight: "10px" }}>
                            <Button
                              color="warning"
                              style={{ width: "90px" }}
                              onClick={() => {
                                toggleGenerateModal();
                                setname(formatName(application.user?.fullname));
                                setpurpose(
                                  application.application_purpose?.name?.toUpperCase()
                                );
                                setreferenceNo(application.reference_no);
                                setspecialPermitID(application?.id);
                              }}
                            >
                              Generate
                            </Button>
                          </div>
                          <div>
                            <Button
                              color="primary"
                              style={{ width: "90px" }}
                              onClick={() => {
                                toggleUploadModal();
                                setspecialPermitID(application?.id);
                              }}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                      </td>
                    ) : null}
                    {status === "for_payment_approval" ? (
                      <td>
                        <UncontrolledDropdown className="me-2" direction="end">
                          <DropdownToggle caret color="primary">
                            Actions
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1050, // High z-index to appear above
                              position: "absolute", // Ensure it's detached from parent
                            }}
                          >
                            <DropdownItem
                              onClick={() => {
                                // const formik = formikRef.current.values;
                                // const formData = getFormData(formik);
                                // formData.append(
                                //   "special_permit_application_id",
                                //   applicationId
                                // );
                                handleSubmit(
                                  {
                                    url: "api/admin/approve-payment",
                                    // headers: {
                                    //   "Content-Type": "multipart/form-data",
                                    // },
                                    message: {
                                      title:
                                        "Are you sure you want to Proceed?",
                                      failedTitle: "FAILED",
                                      success: "Success!",
                                      error: "unknown error occured",
                                    },
                                    params: {
                                      order_of_payment_id:
                                        application?.order_of_payment?.id,
                                    },
                                  },
                                  [],
                                  [toggleRefresh]
                                );
                              }}
                            >
                              Approve
                            </DropdownItem>

                            <DropdownItem
                              onClick={() => {
                                toggleReturnRemarksModal();
                                setorderOfPaymentId(
                                  application?.order_of_payment?.id
                                );
                              }}
                            >
                              Return
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    ) : null}
                  </tr>
                </React.Fragment>
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

      {/* Image Viewer Modal */}
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

export default AdminTable;
