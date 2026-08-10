import TableLoaders from "components/Loaders/TableLoaders";
import {
  getCompanyOccupatinalData,
  SpecialPermitAdminSlice,
} from "features/SpecialPermitAdmin";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import AmountModal from "../Modals/AmountModal";
import AttachmentModal from "../Modals/AttachmentModal";
import useSubmit from "hooks/Common/useSubmit";
import ReturnRemarksModal from "../Modals/ReturnRemarksModal";
import GeneratePermitModal from "../Modals/GeneratePermitModal";
import UploadPermitModal from "../Modals/UploadPermitModal";
import GenerateOccupationalPermitModal from "../Modals/GenerateOccupationalPermitModal";
import Viewer from "react-viewer";
import useGetImage from "hooks/Common/useGetImage";
import RemarksModal from "../Modals/RemarksModal";
import OccupationalRequestForm from "../Printables/OccupationalRequestForm";
import Pagination from "components/Pagination";
import {
  formateDateIntoString,
  updateTabNotification,
} from "common/utility/utilityFunction";
import FileViewerModal from "../AdminControls/Modals/FileViewerModal";
import UpdateCorporationMemberDetailsModal from "../AdminControls/Modals/UpdateCorporationMemberDetailsModal";
import EditDurationModal from "../Dashboard/Modal/EditDurationModal";
import PaymentModal from "../../AuthClientPages/Modals/PaymentModal";
import { SpecialPermitClientSlice } from "features/SpecialPermitClient";
import { useSelectedPaymentDetails } from "hooks/Common/useSelectedPaymentDetails";
import UpdateOrNumberModal from "../Modals/UpdateOrNumberModal";
import ApplicationActivityModal from "../Modals/ApplicationActivityModal";

export default function OccupationalTableCompanyAdmin({ status }) {
  const dispatch = useDispatch();
  const specialPermitAdmin = useSelector((state) => state.specialPermitAdmin);
  const { getImageHandle, currentImage, isFetching } = useGetImage();
  const [selectedRow, setSelectedRow] = useState([]);
  const [amountModal, setOpenAmountModal] = useState(false);
  const [refreshPage, setrefreshPage] = useState(false);
  const [applicationId, setApplicationId] = useState();
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generateModal, setOpenGenerateModal] = useState(false);
  const [uploadPermitModal, setOpenUploadPermitModal] = useState(false);
  const [returnRemarksModal, setOpenReturnRemarksModal] = useState(false);
  const [remarksModal, setOpenRemarksModal] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const handleSubmit = useSubmit();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [orderOfPaymentId, setOrderOfPaymentId] = useState();
  const [corporationMemberDetails, setCorporationMemberDetails] = useState();
  const [occupationalRequestModal, setOccupationalRequestModal] =
    useState(false);
  const [pdfViewer, setPdfViewer] = useState(false);
  const [completedPermit, setCompletedPermit] = useState(null);
  const [updateDetailsModal, setUpdateDetailsModal] = useState(false);
  const [updateDurationModal, setUpdateDurationModal] = useState(false);
  const [overTheCounterModal, setOverTheCounterModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState([]);
  const [updateOrNumberModal, setUpdateOrNumberModal] = useState(false);
  const [orNumber, setOrNumber] = useState(null);
  const [activityModal, setActivityModal] = useState(false);

  useEffect(() => {
    dispatch(getCompanyOccupatinalData({ type: "company", status: status }));
  }, [refreshPage]);
  const handleSetRow = (index) => {
    setSelectedRow((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };
  const handleRowOnclick = (permit_id) => {
    const response = updateTabNotification(
      "occupational_permit",
      permit_id,
      status,
    );
  };
  const togglePdfViewer = () => {
    setPdfViewer((prev) => !prev);
  };
  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
  };
  const toggleOccupationalRequestModal = () => {
    setOccupationalRequestModal((prev) => !prev);
  };
  const toggleAmountModal = () => {
    setOpenAmountModal((prev) => !prev);
  };
  const toggleRefresh = () => {
    setrefreshPage((prev) => !prev);
  };
  const toggleGenerateModal = () => {
    setOpenGenerateModal((prev) => !prev);
  };
  const toggleRemarksModal = () => {
    setOpenRemarksModal((prev) => !prev);
  };
  const toggleUploadPermitModal = () => {
    setOpenUploadPermitModal((prev) => !prev);
  };
  const toggleImageViewer = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const toggleReturnRemarksModal = () => {
    setOpenReturnRemarksModal((prev) => !prev);
  };
  const toggleUpdateDetailsModal = () => {
    setUpdateDetailsModal((prev) => !prev);
  };
  const toggleUpdateModal = () => {
    setUpdateDurationModal(!updateDurationModal);
  };
  const toggleOverTheCounterModal = () => {
    setOverTheCounterModal((prev) => !prev);
  };
  const toggleUpdateOrNumberModal = () => {
    setUpdateOrNumberModal((prev) => !prev);
  };
  const toggleActivityModal = () => {
    setActivityModal((prev) => !prev);
  };
  const allPermit = useMemo(() => {
    return specialPermitAdmin?.companyOccupational?.data?.flatMap(
      (item) => item.special_permit_applications || [],
    );
  }, [specialPermitAdmin]);
  const paymentDetails = useSelectedPaymentDetails(selectedPermit, allPermit);
  const handleSelect = (id) => {
    setSelectedPermit((prev) => {
      const rows = Array.isArray(prev) ? [...prev] : [];
      if (rows.includes(id)) {
        return rows.filter((item) => item !== id);
      } else {
        return [...rows, id];
      }
    });
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
      {updateDurationModal && (
        <EditDurationModal
          openModal={updateDurationModal}
          toggleModal={toggleUpdateModal}
          specialPermitId={applicationId}
        />
      )}
      {isViewerOpen && currentImage && !isFetching && (
        <>
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
        </>
      )}
      {pdfViewer && (
        <FileViewerModal
          fileUrl={completedPermit}
          isOpen={pdfViewer}
          toggle={togglePdfViewer}
        />
      )}
      {updateDetailsModal && (
        <UpdateCorporationMemberDetailsModal
          openModal={updateDetailsModal}
          toggleModal={toggleUpdateDetailsModal}
          corporationMemberId={applicationId}
          userDetails={corporationMemberDetails}
          toggleRefresh={toggleRefresh}
        />
      )}
      <AmountModal
        openModal={amountModal}
        toggleModal={toggleAmountModal}
        toggleRefresh={toggleRefresh}
        applicationId={applicationId}
      />
      <RemarksModal
        openModal={remarksModal}
        toggleModal={toggleRemarksModal}
        applicationId={applicationId}
        toggleRefresh={toggleRefresh}
      />

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

      {occupationalRequestModal && (
        <OccupationalRequestForm
          isOpen={occupationalRequestModal}
          toggleModal={toggleOccupationalRequestModal}
          applicationId={applicationId}
        />
      )}
      {overTheCounterModal && (
        <PaymentModal
          toggleModal={toggleOverTheCounterModal}
          openModal={overTheCounterModal}
          applicationId={selectedPermit}
          toggleRefresh={toggleRefresh}
          applicationType={"occupational_permit"}
          paymentDetails={paymentDetails}
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
      {updateOrNumberModal && (
        <UpdateOrNumberModal
          openModal={updateOrNumberModal}
          toggleModal={toggleUpdateOrNumberModal}
          applicationId={applicationId}
          // applicationType={applicationType}
          toggleRefresh={toggleRefresh}
          orNumber={orNumber}
        />
      )}
      {activityModal && (
        <ApplicationActivityModal
          openModal={activityModal}
          toggleModal={toggleActivityModal}
          applicationId={applicationId}
        />
      )}

      <div className="d-flex gap-2">
        <div>
          {status === "for_payment" ? (
            <Button
              color="primary"
              onClick={() => {
                toggleOverTheCounterModal();
                dispatch(
                  specialPermitAdmin.actions.setApplicationIdsForPayment(
                    selectedPermit,
                  ),
                );
              }}
              disabled={selectedPermit.length <= 0}
            >
              <i className="fa fas fa-money-bill-wave"></i>
              <span>Upload</span>
            </Button>
          ) : null}
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            {status === "for_payment" && <th></th>}
            <th>#</th>
            {(status === "for_signature" || status === "completed") && (
              <th>Reference No</th>
            )}
            <th>Name of Requestor / Corporation</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Contact</th>
            {(status === "declined" || status === "returned") && (
              <th>Remarks</th>
            )}
            {status === "for_payment_approval" && (
              <>
                <th> Mode of Payment</th> <th>OR No.</th>
              </>
            )}
            <th>Attachment</th>
            {status === "for_payment_approval" ||
            status === "pending" ||
            status === "for_signature" ||
            status === "completed" ? (
              <th className="text-center">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {specialPermitAdmin?.getCompanyOccupationalData ? (
            <TableLoaders row={7} col={10} />
          ) : specialPermitAdmin?.companyOccupational?.data?.length > 0 ? (
            specialPermitAdmin?.companyOccupational?.data?.map(
              (company, companyIndex) => (
                <React.Fragment key={companyIndex}>
                  <tr
                    onClick={() => {
                      handleSetRow(companyIndex);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedRow.includes(companyIndex)
                        ? "#0062ff"
                        : "",
                      color: selectedRow.includes(companyIndex) ? "white" : "",
                    }}
                  >
                    <td className="fw-bold">
                      <Input
                        type="checkbox"
                        checked={selectedRow?.includes(companyIndex)}
                        onChange={() => {}}
                        style={{
                          appearance: "none",
                          WebkitAppearance: "none",
                          width: "20px",
                          height: "20px",
                          // border: "3px solid black",
                          borderRadius: "4px",
                          display: "grid",
                          placeContent: "center",
                          cursor: "pointer",
                          backgroundColor: selectedRow?.includes(companyIndex)
                            ? "#1ce300"
                            : "white",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                        value="✔"
                      />
                    </td>

                    <td colSpan={2} className="fw-bold">
                      <Badge
                        color="info"
                        style={{
                          padding: "5px",
                          marginRight: "5px",
                          minWidth: "20px",
                        }}
                      >
                        {company?.special_permit_applications?.length || 0}
                      </Badge>
                      {company.fname}{" "}
                    </td>
                    <td>{company?.user_addresses[0]?.company_fulladdress}</td>
                    <td colSpan={3}></td>
                    <td></td>
                    <td></td>
                  </tr>

                  {selectedRow?.includes(companyIndex)
                    ? company?.special_permit_applications?.length > 0
                      ? company?.special_permit_applications?.map(
                          (item, index) => (
                            <tr
                              key={index}
                              onClick={() => {
                                item?.mark_as_read
                                  ? null
                                  : handleRowOnclick(item.id);
                              }}
                              style={{
                                backgroundColor: item.disable
                                  ? "#ef53502a"
                                  : null,
                                borderColor: item.disable ? "#EF5350" : null,
                              }}
                            >
                              {console.log(item?.id)}
                              <td>
                                {status === "for_payment" && (
                                  <Input
                                    type="checkbox"
                                    disabled={
                                      item?.order_of_payment
                                        ?.payment_on_progress === 1
                                    }
                                    checked={selectedPermit?.includes(item.id)}
                                    onClick={(e) => {
                                      handleSelect(item.id);
                                    }}
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                )}
                              </td>
                              <td>{index + 1}</td>
                              {(status === "for_signature" ||
                                status === "completed") && (
                                <td>{item?.reference_no}</td>
                              )}
                              <td>
                                {`${item?.corporation_member?.fname}  ${
                                  item?.corporation_member?.mname ?? ""
                                } ${item?.corporation_member?.lname} ${
                                  item?.corporation_member?.suffix ?? ""
                                }`}{" "}
                                {item?.mark_as_read ? (
                                  ""
                                ) : (
                                  <Badge color="primary"> Unread</Badge>
                                )}
                              </td>
                              <td>{item?.corporation_member?.sex}</td>
                              <td>
                                {
                                  item?.corporation_member
                                    ?.user_addresses_morph[0]?.full_address
                                }
                              </td>
                              <td>
                                {
                                  item?.corporation_member
                                    ?.user_phone_numbers_morph?.phone_number
                                }
                              </td>
                              {status === "for_payment_approval" && (
                                <>
                                  <td>
                                    <Badge
                                      color={
                                        item?.order_of_payment?.payment_detail
                                          ?.payment_type === "online"
                                          ? "info"
                                          : "warning"
                                      }
                                    >
                                      {
                                        item?.order_of_payment?.payment_detail
                                          ?.payment_type
                                      }
                                    </Badge>
                                  </td>
                                  <td>
                                    {
                                      item.order_of_payment?.payment_detail
                                        ?.or_no
                                    }
                                  </td>
                                </>
                              )}
                              {(status === "declined" ||
                                status === "returned") && (
                                <td>{item.latest_status_history?.remarks}</td>
                              )}
                              <td>
                                {status === "for_payment_approval" ||
                                status === "returned" ? (
                                  <Button
                                    color="success"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const paymentType =
                                        item?.order_of_payment?.payment_detail
                                          ?.payment_type;
                                      const attachment =
                                        item?.order_of_payment?.payment_detail
                                          ?.attachment;
                                      if (paymentType === "online") {
                                        // Open new tab
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
                                        setUploadedFiles(item?.uploaded_file);
                                        toggleAttachmentModal();
                                      }}
                                    >
                                      Attachment
                                    </Button>
                                  </div>
                                )}
                              </td>
                              {status === "completed" && (
                                <UncontrolledDropdown>
                                  <DropdownToggle color="primary">
                                    Actions
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() => {
                                        togglePdfViewer();
                                        setCompletedPermit(
                                          item?.complete_special_permit?.file,
                                        );
                                      }}
                                    >
                                      Generated Permit
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        toggleUploadPermitModal();
                                        setApplicationId(item?.id);
                                      }}
                                    >
                                      Re-Upload
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        toggleUpdateDetailsModal();
                                        setApplicationId(
                                          item.corporation_member.id,
                                        );
                                        setCorporationMemberDetails(item);
                                      }}
                                    >
                                      Edit Details
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        toggleUpdateModal();
                                        setApplicationId(item?.id);
                                      }}
                                    >
                                      Update Permit Duration
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        toggleOccupationalRequestModal();
                                        setApplicationId(item?.id);
                                      }}
                                    >
                                      View Request Form
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              )}
                              {status === "completed" && (
                                <Button
                                  color="info"
                                  className="ms-2"
                                  title="View Activity"
                                  onClick={() => {
                                    setApplicationId(item?.id);
                                    toggleActivityModal();
                                  }}
                                >
                                  <i className="mdi mdi-history fs-5"></i>
                                </Button>
                              )}
                              {status === "pending" && (
                                <td>
                                  <div className="d-flex gap-1">
                                    <UncontrolledDropdown>
                                      <DropdownToggle
                                        color="primary"
                                        disabled={item.disable}
                                      >
                                        Actions
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem
                                          onClick={() => {
                                            setApplicationId(item.id);
                                            toggleAmountModal();
                                          }}
                                        >
                                          Procced to payment
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() => {
                                            toggleRemarksModal();
                                            setApplicationId(item?.id);
                                          }}
                                        >
                                          Return
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() => {
                                            toggleOccupationalRequestModal();
                                            setApplicationId(item?.id);
                                          }}
                                        >
                                          View Request Form
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() => {
                                            toggleUpdateDetailsModal();
                                            setApplicationId(
                                              item.corporation_member.id,
                                            );
                                            setCorporationMemberDetails(item);
                                          }}
                                        >
                                          Edit Details
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <Button
                                      color="warning"
                                      onClick={() =>
                                        handleClickPermitStatus(item.id)
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
                                          handleSubmit(
                                            {
                                              url: "api/admin/approve-payment",

                                              message: {
                                                title:
                                                  "Are you sure you want to Proceed?",
                                                failedTitle: "FAILED",
                                                success: "Success!",
                                                error: "unknown error occured",
                                              },
                                              params: {
                                                order_of_payment_id:
                                                  item?.order_of_payment?.id,
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
                                            item?.order_of_payment?.id,
                                          );
                                        }}
                                      >
                                        Return
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          toggleUpdateDetailsModal();
                                          setApplicationId(
                                            item.corporation_member.id,
                                          );
                                          setCorporationMemberDetails(item);
                                        }}
                                      >
                                        Edit Details
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          toggleUpdateOrNumberModal();
                                          setOrNumber(
                                            item?.order_of_payment
                                              ?.payment_detail?.or_no,
                                          );
                                          setApplicationId(item?.id);
                                        }}
                                      >
                                        Update OR Number
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
                                          setSelectedCompanyIndex(companyIndex);
                                          setApplicationId(item?.id);
                                        }}
                                      >
                                        Generate
                                      </Button>
                                    </div>
                                    <div style={{ paddingRight: "10px" }}>
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
                                    <div>
                                      <Button
                                        onClick={() => {
                                          toggleUpdateDetailsModal();
                                          setApplicationId(
                                            item.corporation_member.id,
                                          );
                                          setCorporationMemberDetails(item);
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
                      : null
                    : null}
                </React.Fragment>
              ),
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No Data Available{" "}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        dataProps={specialPermitAdmin.companyOccupational}
        setDataProps={
          SpecialPermitAdminSlice.actions.setDataPropsCompanyOccupational
        }
        setShowLoading={
          SpecialPermitAdminSlice.actions.setShowLoadingCompanyOccupational
        }
        isLoading={specialPermitAdmin.getCompanyOccupationalData}
        params={{ type: "company", status: status }}
      />
    </React.Fragment>
  );
}
