import TableLoaders from "components/Loaders/TableLoaders";
import {
  getIndividualOccupationalApplications,
  SpecialPermitAdminSlice,
} from "features/SpecialPermitAdmin";
import { iteratee } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttachmentModal from "../Modals/AttachmentModal";
import Pagination from "components/Pagination";
import {
  Badge,
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import AmountModal from "../Modals/AmountModal";
import Viewer from "react-viewer";
import useGetImage from "hooks/Common/useGetImage";
import FileViewerModal from "../AdminControls/Modals/FileViewerModal";
import RemarksModal from "../Modals/RemarksModal";
import useSubmit from "hooks/Common/useSubmit";
import ReturnRemarksModal from "../Modals/ReturnRemarksModal";
import GenerateOccupationalPermitModal from "../Modals/GenerateOccupationalPermitModal";
import UploadPermitModal from "../Modals/UploadPermitModal";
import OccupationalRequestForm from "../Printables/OccupationalRequestForm";
import {
  formateDateIntoString,
  updateTabNotification,
} from "common/utility/utilityFunction";
import UpdateIndividualOccupationalDetails from "../AdminControls/Modals/UpdateIndividualOccupationalDetails";
import EditDurationModal from "../Dashboard/Modal/EditDurationModal";

export default function OccupationalTableIndividualAdmin({
  status,
  motherTab,
  activeTab,
}) {
  const dispatch = useDispatch();
  const specialPermitAdmin = useSelector((state) => state.specialPermitAdmin);
  const [refreshPage, setrefreshPage] = useState();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState();
  const [applicationId, setApplicationId] = useState();
  const [amountModal, setAmountModal] = useState(false);
  const [orPath, setOrPath] = useState("");
  const [orderOfPaymentId, setOrderOfPaymentId] = useState();
  const [returnRemarksModal, setOpenReturnRemarksModal] = useState(false);
  const [remarksModal, setRemarksModal] = useState(false);
  const [uploadPermitModal, setOpenUploadPermitModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [generateModal, setOpenGenerateModal] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [uploadModal, setuploadModal] = useState(false);
  const { isFetching, getImageHandle, currentImage } = useGetImage();
  const [occupationalRequestModal, setOccupationalRequestModal] =
    useState(false);
  const [completedPermit, setCompletedPermit] = useState(null);
  const [pdfViewer, setPdfViewer] = useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = useState(false);
  const [userId, setUserId] = useState();
  const [updateDurationModal, setUpdateDurationModal] = useState(false);

  const handleSubmit = useSubmit();

  useEffect(() => {
    if (activeTab === "individual" && motherTab === "occupational") {
      dispatch(
        getIndividualOccupationalApplications({
          type: "individual",
          status: status,
        }),
      );
    }
  }, [refreshPage, activeTab, motherTab, status, dispatch]);

  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
  };
  const toggleAmountModal = () => {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Toggle the amount modal.
     *
     * @returns {void}
     */
    /*******  720a17cd-7be9-41d1-9746-f9612b2e5412  *******/
    setAmountModal((prev) => !prev);
  };
  const toggleRefresh = () => {
    setrefreshPage((prev) => !prev);
  };
  const toggleOccupationalRequestModal = () => {
    setOccupationalRequestModal((prev) => !prev);
  };
  const togglePdfViewer = () => {
    setPdfViewer((prev) => !prev);
  };

  const toggleFileViewerModal = () => {
    setFileViewerOpen((prev) => !prev);
  };
  const toggleReturnRemarksModal = () => {
    setOpenReturnRemarksModal((prev) => !prev);
  };
  const toggleUploadModal = () => {
    setuploadModal(!uploadModal);
  };
  const toggleUpdateDetailModal = () => {
    setUpdateDetailsModal((prev) => !prev);
  };
  const toggleRemarksModal = () => {
    setRemarksModal((prev) => !prev);
  };
  const toggleUploadPermitModal = () => {
    setOpenUploadPermitModal((prev) => !prev);
  };
  const toggleGenerateModal = () => {
    setOpenGenerateModal((prev) => !prev);
  };
  const toggleImageViewer = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const handleRowOnclick = (permit_id) => {
    const response = updateTabNotification(
      "occupational_permit",
      permit_id,
      status,
    );
  };
  const toggleUpdateModal = () => {
    setUpdateDurationModal(!updateDurationModal);
  };
  const handleClickPermitStatus = async (id) => {
    handleSubmit(
      {
        url: "api/admin/disable-enable-permit",
        params: { special_permit_application_id: id },
        message: {
          title: "Are you sure you want change the status?",
        },
      },
      [],
      [toggleRefresh],
    );
  };
  return (
    <React.Fragment>
      {isViewerOpen && !isFetching && currentImage && (
        <Viewer
          visible={isViewerOpen}
          onClose={toggleImageViewer}
          images={[{ src: currentImage, alt: "Attachment" }]}
          activeIndex={0}
          rotatable
          zoomable
          scalable
          attribute={false}
          zIndex={2000}
        />
      )}
      <FileViewerModal
        toggle={toggleFileViewerModal}
        isOpen={fileViewerOpen}
        fileUrl={orPath}
      />
      {pdfViewer && (
        <FileViewerModal
          fileUrl={completedPermit}
          isOpen={pdfViewer}
          toggle={togglePdfViewer}
        />
      )}
      {updateDetailsModal && (
        <UpdateIndividualOccupationalDetails
          userId={userId}
          toggleModal={toggleUpdateDetailModal}
          openModal={updateDetailsModal}
          toggleRefresh={toggleRefresh}
        />
      )}
      {showAttachmentModal && (
        <AttachmentModal
          openModal={showAttachmentModal}
          uploadedFiles={uploadedFiles}
          applicationId={applicationId}
          applicationType={"occupational_permit"}
          toggleModal={toggleAttachmentModal}
          occupational
          mainActiveTab={"occupational_permit"}
        />
      )}
      {occupationalRequestModal && (
        <OccupationalRequestForm
          isOpen={occupationalRequestModal}
          toggleModal={toggleOccupationalRequestModal}
          applicationId={applicationId}
        />
      )}
      <AmountModal
        openModal={amountModal}
        toggleModal={toggleAmountModal}
        toggleRefresh={toggleRefresh}
        applicationId={applicationId}
      />
      <ReturnRemarksModal
        toggleModal={toggleReturnRemarksModal}
        openModal={returnRemarksModal}
        orderOfPaymentId={orderOfPaymentId}
        toggleRefresh={toggleRefresh}
        type={"occupational_permit"}
      />
      <RemarksModal
        toggleModal={toggleRemarksModal}
        openModal={remarksModal}
        applicationId={applicationId}
        toggleRefresh={toggleRefresh}
      />
      {updateDurationModal && (
        <EditDurationModal
          openModal={updateDurationModal}
          toggleModal={toggleUpdateModal}
          specialPermitId={applicationId}
        />
      )}

      {status === "for_signature" || status === "completed" ? (
        <>
          <GenerateOccupationalPermitModal
            toggle={toggleGenerateModal}
            openModal={generateModal}
            applicationID={applicationId}
          />
          <UploadPermitModal
            toggleModal={toggleUploadPermitModal}
            openModal={uploadPermitModal}
            special_permit_application_id={applicationId}
            activeTab={"occupational_permit"}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}

      <Table>
        <thead>
          <tr>
            <th>#</th>
            {(status === "for_signature" || status === "completed") && (
              <th>Reference No</th>
            )}
            <th>Name of Requestor / Corporation</th>
            <th>Gender</th>
            <th>Address</th>
            {(status === "declined" || status === "returned") && (
              <th>Remarks</th>
            )}
            {(status === "for_payment_approval" ||
              status === "for_signature" ||
              status === "returned") && <th> Mode of Payment</th>}
            {status === "for_payment_approval" || status === "returned" ? (
              <>
                <th>OR No.</th>
                <th>Official Receipt</th>
              </>
            ) : (
              <th>Attachment</th>
            )}
            {status === "pending" ||
            status === "for_payment_approval" ||
            status === "for_signature" ||
            status === "completed" ? (
              <th>Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {specialPermitAdmin.getIndividualOccupationalData ? (
            <TableLoaders row={7} col={10} />
          ) : specialPermitAdmin?.individualOccupational?.data?.length > 0 ? (
            specialPermitAdmin?.individualOccupational?.data?.map(
              (application, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    application?.mark_as_read
                      ? null
                      : handleRowOnclick(application.id);
                  }}
                  style={{
                    backgroundColor: application.disable ? "#ef53502a" : null,
                    borderColor: application.disable ? "#EF5350" : null,
                  }}
                >
                  <td className="fw-bold">{index + 1}</td>
                  {(status === "for_signature" || status === "completed") && (
                    <td>{application?.reference_no}</td>
                  )}
                  <td className="fw-bold">
                    {`${application?.user?.fname} ${
                      application?.user?.mname ?? " "
                    } ${application?.user?.lname}`}
                    {`${application?.user?.suffix ?? ""}`}
                    {application?.mark_as_read ? (
                      ""
                    ) : (
                      <Badge color="primary"> Unread</Badge>
                    )}
                  </td>
                  <td>{application?.user?.sex}</td>
                  <td>
                    {application?.user?.user_addresses?.[0]?.full_address}
                  </td>

                  {(status === "for_payment_approval" ||
                    status === "for_signature" ||
                    status === "returned") && (
                    <td>
                      <Badge
                        color={
                          application?.order_of_payment?.payment_detail
                            ?.payment_type === "online"
                            ? "info"
                            : "warning"
                        }
                      >
                        {
                          application?.order_of_payment?.payment_detail
                            ?.payment_type
                        }
                      </Badge>
                    </td>
                  )}
                  {(status === "declined" || status === "returned") && (
                    <td>{application?.latest_status_history?.remarks}</td>
                  )}
                  {(status === "for_payment_approval" ||
                    status === "returned") && (
                    <td>
                      {application?.order_of_payment?.payment_detail?.or_no}
                    </td>
                  )}
                  <td>
                    {status === "for_payment_approval" ||
                    status === "returned" ? (
                      <Button
                        color="success"
                        onClick={(e) => {
                          e.preventDefault();
                          const paymentType =
                            application?.order_of_payment?.payment_detail
                              ?.payment_type;
                          const attachment =
                            application?.order_of_payment?.payment_detail
                              ?.attachment;
                          if (paymentType === "online") {
                            window.open(attachment, "_blank");
                          } else {
                            toggleImageViewer();
                            getImageHandle({
                              path: attachment,
                              url: "api/admin/attachment",
                              showLoader: true,
                            });
                          }
                        }}
                      >
                        Official Receipt
                      </Button>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          color="success"
                          onClick={() => {
                            setUploadedFiles(application?.uploaded_file);
                            toggleAttachmentModal();
                          }}
                        >
                          Attachment
                        </Button>
                      </div>
                    )}
                  </td>
                  {status === "completed" && (
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle color="primary">Actions</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              togglePdfViewer();
                              setCompletedPermit(
                                application?.complete_special_permit?.file,
                              );
                            }}
                          >
                            {" "}
                            Generated Permit
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleUploadPermitModal();
                              setApplicationId(application?.id);
                            }}
                          >
                            {" "}
                            Re-Upload
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleUpdateDetailModal();
                              setUserId(application.user.id);
                            }}
                          >
                            {" "}
                            Edit Details
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleUpdateModal();
                              setApplicationId(application?.id);
                            }}
                          >
                            Update Permit Duration
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleOccupationalRequestModal();
                              setApplicationId(application?.id);
                            }}
                          >
                            View Request Form
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  )}

                  {/* {status === "for_payment_approval" ||
                  status === "returned" ||
                  status === "for_signature" ? (
                    <td>
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();

                          getImageHandle({
                            url: "api/admin/attachment",
                            path: application?.uploaded_file
                              ?.community_tax_certificate,
                            showLoader: true,
                          });
                          toggleImageViewer();
                        }}
                      >
                        Cedula
                      </Button>
                    </td>
                  ) : null} */}
                  {status === "pending" && (
                    <td>
                      <div className="d-flex gap-1">
                        <UncontrolledDropdown>
                          <DropdownToggle color="primary">
                            Actions
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => {
                                setApplicationId(application?.id);
                                toggleAmountModal();
                              }}
                            >
                              Proceed to payment
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toggleRemarksModal();
                                setApplicationId(application?.id);
                              }}
                            >
                              Return
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toggleOccupationalRequestModal();
                                setApplicationId(application?.id);
                              }}
                            >
                              View Request Form
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toggleUpdateDetailModal();
                                setUserId(application.user.id);
                              }}
                            >
                              Edit Details
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <Button
                          color="warning"
                          onClick={() =>
                            handleClickPermitStatus(application.id)
                          }
                        >
                          <i
                            className="mdi mdi-eye fs-5"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </Button>
                      </div>
                    </td>
                  )}
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
                              handleSubmit(
                                {
                                  url: "api/admin/approve-payment",
                                  message: {
                                    title: "Are you sure you want to Proceed?",
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
                                [toggleRefresh],
                              );
                            }}
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleReturnRemarksModal();
                              setOrderOfPaymentId(
                                application?.order_of_payment?.id,
                              );
                            }}
                          >
                            Returned
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleUpdateDetailModal();
                              setUserId(application.user.id);
                            }}
                          >
                            Edit Details
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  ) : null}
                  {status === "for_signature" ? (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                        }}
                      >
                        <div>
                          <Button
                            color="warning"
                            style={{ width: "90px" }}
                            onClick={() => {
                              toggleGenerateModal();
                              setActiveIndex(index);
                              setApplicationId(application?.id);
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
                              toggleUploadPermitModal();
                              setApplicationId(application?.id);
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              toggleUpdateDetailModal();
                              setUserId(application.user.id);
                            }}
                          >
                            Edit Details
                          </Button>
                        </div>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ),
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        dataProps={specialPermitAdmin.individualOccupational}
        setDataProps={
          SpecialPermitAdminSlice.actions.setDataPropsIndividualOccupational
        }
        setShowLoading={
          SpecialPermitAdminSlice.actions.setShowLoadingIndividualOccupational
        }
        isLoading={specialPermitAdmin.getIndividualOccupationalData}
        params={{ type: "individual", status: status }}
      />
    </React.Fragment>
  );
}
