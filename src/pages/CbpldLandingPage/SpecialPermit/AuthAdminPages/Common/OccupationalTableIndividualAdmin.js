import TableLoaders from "components/Loaders/TableLoaders";
import { getIndividualOccupationalApplications } from "features/SpecialPermitAdmin";
import { iteratee } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttachmentModal from "../Modals/AttachmentModal";
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

  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const handleSubmit = useSubmit();
  useEffect(() => {
    if (activeTab === "individual" && motherTab === "occupational") {
      dispatch(
        getIndividualOccupationalApplications({
          type: "individual",
          status: status,
        })
      );
    }
  }, [refreshPage, activeTab, motherTab]);
  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
  };
  const toggleAmountModal = () => {
    setAmountModal((prev) => !prev);
  };
  const toggleRefresh = () => {
    setrefreshPage((prev) => !prev);
  };

  const toggleFileViewerModal = () => {
    setFileViewerOpen((prev) => !prev);
  };
  const toggleReturnRemarksModal = () => {
    setOpenReturnRemarksModal((prev) => !prev);
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
  return (
    <React.Fragment>
      <FileViewerModal
        toggle={toggleFileViewerModal}
        isOpen={fileViewerOpen}
        fileUrl={orPath}
      />
      <AttachmentModal
        openModal={showAttachmentModal}
        uploadedFiles={uploadedFiles}
        applicationId={applicationId}
        applicationType={"occupational_permit"}
        toggleModal={toggleAttachmentModal}
        occupational
        mainActiveTab={"occupational_permit"}
      />

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

      {status === "for_signature" ? (
        <>
          <GenerateOccupationalPermitModal
            toggle={toggleGenerateModal}
            openModal={generateModal}
            applicationDetails={
              specialPermitAdmin?.individualOccupational?.[activeIndex]
            }
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
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name of Requestor / Corporation</th>

            <th>Gender</th>
            <th>Address</th>
            <th>Contact</th>
            {status === "for_payment_approval" ||
              (status === "for_signature" && <th> Mode of Payment</th>)}
            <th>Attachment</th>
            {status === "pending" ||
            status === "for_payment_approval" ||
            status === "for_signature" ? (
              <th>Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {specialPermitAdmin.getIndividualOccupationalData ? (
            <TableLoaders row={7} col={10} />
          ) : specialPermitAdmin?.individualOccupational?.length > 0 ? (
            specialPermitAdmin?.individualOccupational?.map(
              (application, index) => (
                <tr key={index}>
                  <td className="fw-bold">{index + 1}</td>
                  <td className="fw-bold">{`${application?.user?.fname} ${
                    application?.user?.mname || ""
                  } ${application?.user?.lname}`}</td>
                  <td>{application?.user?.sex}</td>
                  <td>
                    {application?.user?.user_address_morph[0]?.full_address}
                  </td>
                  <td>
                    {
                      application?.order_of_payment?.payment_detail
                        ?.payment_type
                    }
                  </td>
                  {status === "for_payment_approval" ||
                    (status === "for_signature" && (
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
                    ))}

                  <td>
                    {status === "for_payment_approval" ||
                    status === "returned" ? (
                      <Button
                        color="success"
                        onClick={() => {
                          toggleFileViewerModal();
                          setOrPath(
                            application?.order_of_payment?.payment_detail
                              ?.attachment
                          );
                        }}
                      >
                        Official Receipt
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        onClick={() => {
                          setUploadedFiles(item?.uploaded_file);
                          toggleAttachmentModal();
                        }}
                      >
                        Attachment
                      </Button>
                    )}
                  </td>
                  {status === "pending" && (
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle color="primary">Actions</DropdownToggle>
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
                        </DropdownMenu>
                      </UncontrolledDropdown>
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
                                [toggleRefresh]
                              );
                            }}
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              toggleReturnRemarksModal();
                              setOrderOfPaymentId(
                                application?.order_of_payment?.id
                              );
                            }}
                          >
                            Returned
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
                          // justifyContent: "space-between",
                        }}
                      >
                        <div style={{ paddingRight: "10px" }}>
                          <Button
                            color="warning"
                            style={{ width: "90px" }}
                            onClick={() => {
                              toggleGenerateModal();
                              setActiveIndex(index);
                              setApplicationId(item?.id);
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
                              setApplicationId(item?.id);
                            }}
                          >
                            Upload
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
              <td colSpan={7} className="text-center">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </React.Fragment>
  );
}
