/* eslint-disable padded-blocks */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
import OccupationalPermitModal from "pages/CbpldLandingPage/Modals/OccupationalPermitModal";
import useGetImage from "hooks/Common/useGetImage";
import FileIconFormat from "./FileIconFormat";
import Swal from "sweetalert2";
import AttachmentModal from "../../AuthAdminPages/Modals/AttachmentModal";
import MayorsCertificateModal from "pages/CbpldLandingPage/Modals/MayorsCertificateModal";
import GoodMoralModal from "pages/CbpldLandingPage/Modals/GoodMoralModal";
import EventModal from "pages/CbpldLandingPage/Modals/EventModal";
import MotorcadeModal from "pages/CbpldLandingPage/Modals/MotorcadeModal";
import ParadeModal from "pages/CbpldLandingPage/Modals/ParadeModal";
import RecorridaModal from "pages/CbpldLandingPage/Modals/RecorridaModal";
import UseOfGovernmentPropertyModal from "pages/CbpldLandingPage/Modals/UseOfGovernmentPropertyModal";
import ReuploadCedulaModal from "../Modals/ReuploadCedulaModal";
import TableLoaders from "components/Loaders/TableLoaders";
import FileViewerModal2 from "../../AuthAdminPages/AdminControls/Modals/FileViewerModal2";
import { useSelectedPaymentDetails } from "hooks/Common/useSelectedPaymentDetails";

// Client-facing stage labels (same wording the old sidebar used).
export const STATUS_LABELS = {
  pending: "Initial Receiving",
  for_payment: "Initial Action",
  for_payment_approval: "Final Receiving",
  returned: "Returned Payment",
  for_signature: "Issuance",
  completed: "Completed",
  declined: "Returned Application",
};
const STATUS_COLORS = {
  pending: "info",
  for_payment: "warning",
  for_payment_approval: "primary",
  returned: "danger",
  for_signature: "secondary",
  completed: "success",
  declined: "danger",
};
const EVENT_PERMITS = [
  "event",
  "motorcade",
  "parade",
  "recorrida",
  "use_of_government_property",
];
const DOCUMENT_COLUMNS = [
  { key: "police_clearance", label: "Police Clearance" },
  { key: "barangay_clearance", label: "Barangay Clearance" },
  { key: "community_tax_certificate", label: "Community Tax Certificate" },
  { key: "fiscal_clearance", label: "Fiscal Clearance" },
  { key: "court_clearance", label: "Court Clearance" },
  { key: "certificate_of_ordinance", label: "Certificate of Ordinance" },
  { key: "s_e_c_certificate", label: "SEC Certificate" },
];
const rowStatusOf = (application) => application?.special_permit_status?.code;
// Remarks only matter for declined/returned; pick the history entry for the row's current status.
const remarksOf = (application, rowStatus) => {
  if (!["declined", "returned"].includes(rowStatus)) return "—";
  return (
    application?.status_histories?.find((h) => h.status_code === rowStatus)
      ?.remarks || "—"
  );
};

const ClientTable = ({ applicationType, status, activeTab }) => {
  const handleSubmit = useSubmit();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const { getImageHandle, currentImage, isFetching, fileType } = useGetImage();
  const [refreshPage, setrefreshPage] = useState(false);
  const [overTheCounterModal, setoverTheCounterModal] = useState(false); // State for selected application's uploaded files
  const [selectedRow, setSelectedRow] = useState([]);

  const [reuploadModal, setreuploadModal] = useState(false);
  // const [paymentDetails, setPaymentDetails] = useState([]);
  const [cedulaApplicationModal, setCedulaApplicationModal] = useState(false);
  const [attachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedUploadedFiles, setSelectedUploadedFiles] = useState([]);
  const [updateOccupationalPermitModal, setOpenOccupationalPermitModal] =
    useState(false);
  const [mayorsPermitApplicationModal, setMayorsPermitApplicationModal] =
    useState(false);
  const [goodMoralApplicationModal, setGoodMoralApplicationModal] =
    useState(false);
  const [eventApplicationModal, setEventApplicationModal] = useState(false);
  const [motorcadeApplicationModal, setMotorcadeApplicationModal] =
    useState(false);
  const [paradeApplicationModal, setParadeApplicationModal] = useState(false);
  const [recorridaApplicationModal, setRecorridaApplicationModal] =
    useState(false);
  const [useOfGovernmentApplicationModal, setUseOfGovernmentApplicationModal] =
    useState(false);
  const [reUploadCedulaModal, setReUploadCedulaModal] = useState(false);

  useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toggleRefresh = () => {
    setrefreshPage(!refreshPage);
  };
  const specialPermitClient = useSelector((state) => state.specialPermitClient);
  const paymentDetails = useSelectedPaymentDetails(
    selectedRow,
    specialPermitClient?.clientTableData?.data,
  );
  const toggleReUploadModal = () => {
    setreuploadModal(!reuploadModal);
  };

  const toggleOverTheCounterModal = () => {
    setoverTheCounterModal(!overTheCounterModal);
  };
  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
  };
  const toggleIsViewerOpen = () => {
    setIsViewerOpen((prev) => !prev);
  };
  const toggleCedulaApplicationForm = () => {
    setCedulaApplicationModal((prev) => !prev);
  };
  const toggleMayorsPermitApplicationModal = () => {
    setMayorsPermitApplicationModal((prev) => !prev);
  };
  const toggleGoodMoralApplicationModal = () => {
    setGoodMoralApplicationModal((prev) => !prev);
  };
  const toggleEventApplicationModal = () => {
    setEventApplicationModal((prev) => !prev);
  };
  const toggleMotorcadeApplicationModal = () => {
    setMotorcadeApplicationModal((prev) => !prev);
  };
  const toggleParadeApplicationModal = () => {
    setParadeApplicationModal((prev) => !prev);
  };
  const toggleRecorridaApplicationModal = () => {
    setRecorridaApplicationModal((prev) => !prev);
  };
  const toggleUseOfGovernmentPropertyApplicationModal = () => {
    setUseOfGovernmentApplicationModal((prev) => !prev);
  };
  const toggleReUploadCedulaModal = () => {
    setReUploadCedulaModal((prev) => !prev);
  };
  const toggleOccupationalPermitApplication = () => {
    setOpenOccupationalPermitModal((prev) => !prev);
  };
  useEffect(() => {
    // status is optional: omitted = every stage in one table.
    const params = { permit_type: applicationType, ...(status && { status }) };
    if (applicationType === activeTab) {
      setSelectedRow([]);
      dispatch(getClientTableData(params));
      dispatch(SpecialPermitClientSlice.actions.setProps(params));
    }
  }, [activeTab, refreshPage, status]);

  const togglerFunction = useCallback(() => {
    if (applicationType === "mayors_permit") {
      toggleMayorsPermitApplicationModal();
    } else if (applicationType === "good_moral") {
      toggleGoodMoralApplicationModal();
    } else if (applicationType === "event") {
      toggleEventApplicationModal();
    } else if (applicationType === "motorcade") {
      toggleMotorcadeApplicationModal();
    } else if (applicationType === "parade") {
      toggleParadeApplicationModal();
    } else if (applicationType === "recorrida") {
      toggleRecorridaApplicationModal();
    } else if (applicationType === "use_of_government_property") {
      toggleUseOfGovernmentPropertyApplicationModal();
    } else if (applicationType === "occupational_permit") {
      toggleOccupationalPermitApplication();
    }
  }, [applicationType]);

  const toggleUpdateOccupationalPermitModal = () => {
    setOpenOccupationalPermitModal((prev) => !prev);
  };
  const dateOfEvent = (date, time) => {
    const newTime =
      time !== null ? moment(time, "h:mm A").format("h:mm A") : "";
    return formateDateIntoString(date) + " " + newTime;
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


  const rows = specialPermitClient?.clientTableData?.data || [];
  const isCompany = user?.accountType === "company";
  const isPersonalPermit = ["mayors_permit", "good_moral"].includes(
    applicationType,
  );
  const isEventPermit = EVENT_PERMITS.includes(applicationType);
  const isOccupational = applicationType === "occupational_permit";

  // Company bulk payment: only for_payment rows not already being paid.
  const payableIds = rows
    .filter(
      (r) =>
        rowStatusOf(r) === "for_payment" &&
        r?.order_of_payment?.payment_on_progress !== 1,
    )
    .map((r) => r.id);
  const selectedPayable = selectedRow.filter((id) => payableIds.includes(id));

  const columns = [
    "",
    "#",
    "Status",
    "Reference No.",
    ...(isPersonalPermit
      ? [
          "Purpose",
          ...(applicationType === "good_moral"
            ? ["Exemption", "Exemption Status"]
            : []),
          ...DOCUMENT_COLUMNS.map((d) => d.label),
        ]
      : []),
    ...(isEventPermit
      ? ["Requestor", "Name of Event", "Date From", "Date To"]
      : []),
    ...(isOccupational
      ? [
          ...(isCompany
            ? ["Name of Requestor", "Gender", "Address"]
            : ["Name"]),
          "Attachment",
        ]
      : []),
    "Amount",
    "Remarks",
    "Actions",
  ];

  const downloadPermit = (fileId) => {
    if (!fileId) {
      alert("Special Permit ID is required for download.");
      return;
    }

    axios
      .get("/api/client/download-permit", {
        responseType: "blob",
        params: {
          special_permit_id: fileId,
          _t: Date.now(),
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/pdf",
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${applicationType}_${fileId}.pdf`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download error:", error);
        alert("Failed to download the file.");
      });
  };

  const payIndividual = (application) => {
    if (!application?.id) {
      console.error("Application data is missing");
      return;
    }

    if (application?.order_of_payment?.payment_on_progress === 1) {
      Swal.fire({
        icon: "info",
        title: "Processing Payment",
        text: "Your application payment is currently being processed. Please wait for further updates.",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedRow([application?.id]);
    dispatch(
      SpecialPermitClientSlice?.actions?.setApplicationIdsForPayment([
        application?.id,
      ]),
    );
    toggleOverTheCounterModal();
  };

  const fileCell = (fileType, path, label) =>
    path ? (
      <FileIconFormat
        fileType={fileType}
        path={path}
        toggleIsViewerOpen={toggleIsViewerOpen}
        getImageHandle={getImageHandle}
        label={label}
      />
    ) : (
      <span className="text-muted">N/A</span>
    );

  const renderActions = (application, rowStatus) => {
    const inProgress = application?.order_of_payment?.payment_on_progress === 1;
    switch (rowStatus) {
      case "returned":
        return (
          <div className="d-flex gap-2 align-items-center">
            {application?.order_of_payment?.payment_detail?.attachment &&
              fileCell(
                "official_receipt",
                application.order_of_payment.payment_detail.attachment,
              )}
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                setSelectedRow([application?.id]);
                toggleReUploadModal();
              }}
            >
              Reupload O.R
            </Button>
          </div>
        );
      case "for_payment":
        return (
          <div className="d-flex gap-2 align-items-center">
            {!isCompany && (
              <Button
                size="sm"
                color="primary"
                disabled={inProgress}
                onClick={(e) => {
                  e.preventDefault();
                  payIndividual(application);
                }}
              >
                Pay
              </Button>
            )}
            <Badge
              pill
              color={inProgress ? "warning" : "primary"}
            >
              {inProgress ? "Paying" : "Unpaid"}
            </Badge>
          </div>
        );
      case "declined":
        return (
          <Button
            size="sm"
            onClick={() => {
              setSelectedRow([application?.id]);
              togglerFunction();
            }}
            color="primary"
          >
            Revise & Resubmit
          </Button>
        );
      case "completed":
        return (
          <div className="d-flex gap-2 text-nowrap">
            <Button
              size="sm"
              type="button"
              color="success"
              onClick={() => downloadPermit(application?.id)}
            >
              <i className="mdi mdi-download me-1"></i>
              Download
            </Button>

            <Button
              size="sm"
              color="primary"
              onClick={() => {
                const url = process.env.REACT_APP_FEEDBACK_URL;

                window.open(url, "_blank");
              }}
            >
              <i className="mdi mdi-star me-1 text-warning"></i>
              Submit Feedback
            </Button>
          </div>
        );
      default:
        return "—";
    }
  };

  return (
    <>
      {isViewerOpen &&
        currentImage &&
        isFetching === false &&
        (fileType === "image" ? (
          <ImageViewer
            src={[currentImage]}
            currentIndex={0}
            onClose={toggleIsViewerOpen}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 9999,
            }}
            closeOnClickOutside={true}
            disableZoom={false} // ✔ enables zoom
          />
        ) : (
          <FileViewerModal2
            file={currentImage}
            toggle={toggleIsViewerOpen}
            isOpen={isViewerOpen}
          />
        ))}
      <ReuploadModal
        toggleModal={toggleReUploadModal}
        openModal={reuploadModal}
        applicationId={selectedRow}
        toggleRefresh={toggleRefresh}
      />
      {reUploadCedulaModal && (
        <ReuploadCedulaModal
          specialPermitApplicationId={selectedRow[0]}
          toggleModal={toggleReUploadCedulaModal}
          openModal={ReuploadCedulaModal}
        />
      )}
      <CedulaApplicationFormModal
        openModal={cedulaApplicationModal}
        toggleModal={toggleCedulaApplicationForm}
      />

      <AttachmentModal
        openModal={attachmentModal}
        toggleModal={toggleAttachmentModal}
        uploadedFiles={selectedUploadedFiles}
        mainActiveTab={activeTab}
        occupational
        applicationType={"occupational_permit"}
        isClient
      />

      {overTheCounterModal && (
        <OverTheCounterModal
          toggleModal={toggleOverTheCounterModal}
          openModal={overTheCounterModal}
          applicationId={selectedRow}
          toggleRefresh={toggleRefresh}
          applicationType={applicationType}
          paymentDetails={paymentDetails}
        />
      )}

      <OccupationalPermitModal
        openModal={updateOccupationalPermitModal}
        toggleModal={toggleUpdateOccupationalPermitModal}
        mode="update"
        title="Update Occupational Permit"
        fetchUrl={`api/client/get-single-occupational/permit-application`}
        submitUrl={
          "api/client/special-permit/update-occupational-permit/update"
        }
        applicationId={selectedRow[0]}
        isUpdate
        toggleRefresh={toggleRefresh}
      />
      {mayorsPermitApplicationModal && (
        <MayorsCertificateModal
          openModal={mayorsPermitApplicationModal}
          toggleModal={toggleMayorsPermitApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      {goodMoralApplicationModal && (
        <GoodMoralModal
          openModal={goodMoralApplicationModal}
          toggleModal={toggleGoodMoralApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      {eventApplicationModal && (
        <EventModal
          openModal={eventApplicationModal}
          toggleModal={toggleEventApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}

      {motorcadeApplicationModal && (
        <MotorcadeModal
          openModal={motorcadeApplicationModal}
          toggleModal={toggleMotorcadeApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      {paradeApplicationModal && (
        <ParadeModal
          openModal={paradeApplicationModal}
          toggleModal={toggleParadeApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      {recorridaApplicationModal && (
        <RecorridaModal
          openModal={recorridaApplicationModal}
          toggleModal={toggleRecorridaApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      {useOfGovernmentApplicationModal && (
        <UseOfGovernmentPropertyModal
          openModal={useOfGovernmentApplicationModal}
          toggleModal={toggleUseOfGovernmentPropertyApplicationModal}
          isUpdate
          specialPermitApplicationId={selectedRow[0]}
          toggleRefresh={toggleRefresh}
        />
      )}
      <div className="d-flex gap-2">
        <div>
          {isCompany && payableIds.length > 0 ? (
            <Button
              color="primary"
              onClick={() => {
                setSelectedRow(selectedPayable);
                toggleOverTheCounterModal();
                dispatch(
                  SpecialPermitClientSlice.actions.setApplicationIdsForPayment(
                    selectedPayable,
                  ),
                );
              }}
              disabled={selectedPayable.length <= 0}
            >
              <i className="fa fas fa-money-bill-wave"></i>
              <span> Pay</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="tableFixHead">
        <Table className="client-table align-middle">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>
                {isCompany && payableIds.length > 0 ? (
                  <Input
                    type="checkbox"
                    aria-label="Select all for payment"
                    checked={selectedPayable.length === payableIds.length}
                    onChange={() => {
                      setSelectedRow(
                        selectedPayable.length === payableIds.length
                          ? []
                          : payableIds,
                      );
                    }}
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : null}
              </th>
              {columns.slice(1).map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specialPermitClient?.getTableDataIsFetching ? (
              <TableLoaders col={10} row={columns.length} />
            ) : rows.length > 0 ? (
              rows.map((application, index) => {
                const rowStatus = rowStatusOf(application);
                return (
                  <tr key={application.id}>
                    <td>
                      {isCompany && rowStatus === "for_payment" && (
                        <Input
                          type="checkbox"
                          aria-label={`Select application ${application.id}`}
                          disabled={
                            application?.order_of_payment
                              ?.payment_on_progress === 1
                          }
                          checked={selectedRow?.includes(application.id)}
                          onChange={() => {
                            handleSelect(application.id);
                          }}
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-2">{`${index + 1}.`}</div>
                    </td>
                    <td>
                      <Badge
                        color={STATUS_COLORS[rowStatus] || "secondary"}
                        data-testid="row-status"
                      >
                        {STATUS_LABELS[rowStatus] ||
                          application?.special_permit_status?.name ||
                          "—"}
                      </Badge>
                    </td>
                    <td>
                      {["for_signature", "completed"].includes(rowStatus) &&
                      application.reference_no
                        ? application.reference_no
                        : "—"}
                    </td>

                    {isPersonalPermit && (
                      <>
                        <td>{application.application_purpose?.name}</td>
                        {applicationType === "good_moral" && (
                          <>
                            <td>
                              {application.permit_application_exemption
                                ?.exempted_case_name || "N/A"}
                            </td>
                            <td>
                              {application.permit_application_exemption
                                ?.status || "N/A"}
                            </td>
                          </>
                        )}
                        {DOCUMENT_COLUMNS.map((d) => (
                          <td key={d.key}>
                            {fileCell(d.key, application.uploaded_file?.[d.key], "View")}
                          </td>
                        ))}
                      </>
                    )}

                    {isEventPermit && (
                      <>
                        <td>{application?.requestor_name}</td>
                        <td>{application?.event_name}</td>
                        <td>
                          {dateOfEvent(
                            application?.event_date_from,
                            application?.event_time_from,
                          )}
                        </td>
                        <td>
                          {dateOfEvent(
                            application?.event_date_to,
                            application?.event_time_to,
                          )}
                        </td>
                      </>
                    )}

                    {isOccupational && (
                      <>
                        {isCompany ? (
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
                        ) : (
                          <td>{application?.requestor_name}</td>
                        )}
                        <td>
                          <Button
                            size="sm"
                            color="success"
                            onClick={() => {
                              toggleAttachmentModal();
                              setSelectedUploadedFiles(
                                application?.uploaded_file,
                              );
                            }}
                          >
                            Attachment
                          </Button>
                        </td>
                      </>
                    )}

                    <td>
                      {application?.order_of_payment?.total_amount != null
                        ? `₱ ${application.order_of_payment.total_amount}`
                        : "—"}
                    </td>
                    <td>{remarksOf(application, rowStatus)}</td>
                    <td className="text-nowrap">{renderActions(application, rowStatus)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
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
    </>
  );
};

export default ClientTable;
