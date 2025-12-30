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
const ClientTable = ({ applicationType, status, activeTab }) => {
  const handleSubmit = useSubmit();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const { getImageHandle, currentImage, isFetching } = useGetImage();
  const [refreshPage, setrefreshPage] = useState(false);
  const [overTheCounterModal, setoverTheCounterModal] = useState(false); // State for selected application's uploaded files
  const [selectedRow, setSelectedRow] = useState([]);

  const [reuploadModal, setreuploadModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
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
    const params = { status: status, permit_type: applicationType };
    if (applicationType === activeTab) {
      dispatch(getClientTableData(params));
      dispatch(SpecialPermitClientSlice.actions.setProps(params));
    }
  }, [activeTab, refreshPage]);

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

  const columnConfig = useMemo(
    () => [
      { key: "checkbox", label: "", condition: () => true },
      { key: "index", label: "#", condition: () => true },
      {
        key: "purpose",
        label: "Purpose",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType),
      },
      {
        key: "exemption",
        label: "Exemption",
        condition: () =>
          applicationType === "good_moral" &&
          ["pending", "declined", "for_signature", "completed"].includes(
            status
          ),
      },
      {
        key: "exemptionStatus",
        label: "Exemption Status",
        condition: () =>
          applicationType === "good_moral" &&
          ["pending", "declined", "for_signature", "completed"].includes(
            status
          ),
      },
      {
        key: "policeClearance",
        label: "Police Clearance",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType) &&
          ["pending", "declined"].includes(status),
      },
      {
        key: "barangayClearance",
        label: "Barangay Clearance",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType) &&
          ["pending", "declined"].includes(status),
      },
      {
        key: "ctc",
        label: "Community Tax Certificate",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType) &&
          ["pending", "declined"].includes(status),
      },
      {
        key: "fiscalClearance",
        label: "Fiscal Clearance",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType) &&
          ["pending", "declined"].includes(status),
      },
      {
        key: "courtClearance",
        label: "Court Clearance",
        condition: () =>
          ["mayors_permit", "good_moral"].includes(applicationType) &&
          ["pending", "declined"].includes(status),
      },
      {
        key: "remarks",
        label: "Remarks",
        condition: () => ["declined", "returned"].includes(status),
      },
      { key: "or", label: "O.R", condition: () => status === "returned" },
      {
        key: "actions",
        label: "Actions",
        condition: () =>
          status === "returned" ||
          (status === "for_payment" && user?.accountType === "individual") ||
          status === "declined",
      },
      {
        key: "amount",
        label: "Amount",
        condition: () =>
          [
            "for_payment",
            "for_payment_approval",
            "for_signature",
            "completed",
          ].includes(status),
      },
      {
        key: "eventName",
        label: "Name of Event",
        condition: () =>
          [
            "event",
            "motorcade",
            "parade",
            "recorrida",
            "use_of_government_property",
          ].includes(applicationType),
      },
      {
        key: "dateFrom",
        label: "Date From",
        condition: () =>
          [
            "event",
            "motorcade",
            "parade",
            "recorrida",
            "use_of_government_property",
          ].includes(applicationType),
      },
      {
        key: "dateTo",
        label: "Date To",
        condition: () =>
          [
            "event",
            "motorcade",
            "parade",
            "recorrida",
            "use_of_government_property",
          ].includes(applicationType),
      },
      {
        key: "requestorName",
        label: "Name of Requestor",
        condition: () =>
          applicationType === "occupational_permit" &&
          user?.accountType === "company",
      },
      {
        key: "gender",
        label: "Gender",
        condition: () =>
          applicationType === "occupational_permit" &&
          user?.accountType === "company",
      },
      {
        key: "address",
        label: "Address",
        condition: () =>
          applicationType === "occupational_permit" &&
          user?.accountType === "company",
      },
      {
        key: "nameAttachment",
        label: "Attachment",
        condition: () =>
          applicationType === "occupational_permit" && status === "pending",
      },
      {
        key: "specialPermit",
        label: "Special Permit",
        condition: () => status === "completed",
      },
    ],
    [applicationType, status, user?.accountType]
  );
  const getActiveColumnCount = useMemo(
    () => columnConfig.filter((col) => col.condition()).length,
    [applicationType, status, user?.accountType]
  );
  return (
    <>
      {isViewerOpen && currentImage && isFetching === false && (
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
      )}
      {status === "returned" ? (
        <ReuploadModal
          toggleModal={toggleReUploadModal}
          openModal={reuploadModal}
          applicationId={selectedRow}
          toggleRefresh={toggleRefresh}
        />
      ) : null}
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

      <OverTheCounterModal
        toggleModal={toggleOverTheCounterModal}
        openModal={overTheCounterModal}
        applicationId={selectedRow}
        toggleRefresh={toggleRefresh}
        applicationType={applicationType}
        paymentDetails={paymentDetails}
      />
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
          {status === "for_payment" && user?.accountType === "company" ? (
            <Button
              color="primary"
              onClick={() => {
                toggleOverTheCounterModal();
                dispatch(
                  SpecialPermitClientSlice.actions.setApplicationIdsForPayment(
                    selectedRow
                  )
                );
              }}
              disabled={selectedRow.length <= 0}
            >
              <i className="fa fas fa-money-bill-wave"></i>
              <span> Pay</span>
            </Button>
          ) : null}
        </div>
        {/* <div>
          <Button color="success">
            <i className="mdi mdi-printer "></i>{" "}
            <span> Reprint Cedula Application Form</span>{" "}
          </Button>
        </div> */}
      </div>

      <div className="tableFixHead">
        <Table>
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
                        specialPermitClient?.clientTableData?.data?.length &&
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

                  {status === "returned" && (
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
                    status === "for_payment_approval") && (
                    <>
                      <th> Amount</th>
                    </>
                  )}
                  {status === "pending" && (
                    <>
                      <th>Name</th>
                      <th>Attachment</th>
                    </>
                  )}
                  {status === "returned" && (
                    <>
                      <th>Remarks</th>
                    </>
                  )}

                  {status === "returned" && (
                    <>
                      <th>O.R</th>
                    </>
                  )}
                </>
              )}
              {status === "for_payment" &&
              user?.accountType === "individual" ? (
                <th>Actions</th>
              ) : null}
              {status === "completed" ? <th>Special Permit</th> : null}
              {status === "declined" ? (
                <>
                  <th>Remarks</th> <th>Actions</th>{" "}
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {specialPermitClient?.getTableDataIsFetching ? (
              <TableLoaders col={10} row={getActiveColumnCount} />
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
                                <FileIconFormat
                                  fileType="police_clearance"
                                  path={
                                    application.uploaded_file?.police_clearance
                                  }
                                  toggleIsViewerOpen={toggleIsViewerOpen}
                                  getImageHandle={getImageHandle}
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>
                              {application.uploaded_file?.barangay_clearance &&
                              status !== "for_payment" ? (
                                <FileIconFormat
                                  fileType="barangay_clearance"
                                  path={
                                    application.uploaded_file
                                      ?.barangay_clearance
                                  }
                                  toggleIsViewerOpen={toggleIsViewerOpen}
                                  getImageHandle={getImageHandle}
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>

                            <td>
                              {application.uploaded_file
                                ?.community_tax_certificate &&
                              status !== "for_payment" ? (
                                <FileIconFormat
                                  fileType="community_tax_certificate"
                                  path={
                                    application.uploaded_file
                                      ?.community_tax_certificate
                                  }
                                  toggleIsViewerOpen={toggleIsViewerOpen}
                                  getImageHandle={getImageHandle}
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>

                            <td>
                              {application.uploaded_file?.fiscal_clearance &&
                              status !== "for_payment" ? (
                                <FileIconFormat
                                  fileType="fiscal_clearance"
                                  path={
                                    application.uploaded_file?.fiscal_clearance
                                  }
                                  toggleIsViewerOpen={toggleIsViewerOpen}
                                  getImageHandle={getImageHandle}
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>
                              {application.uploaded_file?.court_clearance &&
                              status !== "for_payment" ? (
                                <FileIconFormat
                                  fileType="court_clearance"
                                  path={
                                    application.uploaded_file?.court_clearance
                                  }
                                  toggleIsViewerOpen={toggleIsViewerOpen}
                                  getImageHandle={getImageHandle}
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
                              ? application.status_histories.map(
                                  (items, index) => {
                                    <div key={index}>{items.remarks}</div>;
                                  }
                                )
                              : "N/A"}
                          </td>
                        )}

                        {status === "returned" &&
                          application?.order_of_payment?.payment_detail
                            ?.attachment && (
                            <FileIconFormat
                              fileType="official_receipt"
                              path={
                                application?.order_of_payment?.payment_detail
                                  ?.attachment
                              }
                              toggleIsViewerOpen={toggleIsViewerOpen}
                              getImageHandle={getImageHandle}
                            />
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
                        {status === "pending" && (
                          <>
                            <td>{application?.requestor_name}</td>
                            <td>
                              <Button
                                color="success"
                                onClick={() => {
                                  toggleAttachmentModal();

                                  setSelectedUploadedFiles(
                                    application?.uploaded_file
                                  );
                                }}
                              >
                                Attachment
                              </Button>{" "}
                            </td>
                          </>
                        )}
                        {status === "for_payment_approval" ||
                          (status === "for_signature" && (
                            <td>{application?.reference_no || ""}</td>
                          ))}
                        {(status === "for_payment" ||
                          status === "for_payment_approval") && (
                          <td>{`₱ ${application?.order_of_payment?.total_amount}`}</td>
                        )}
                        {status === "returned" && (
                          <>
                            <td>
                              {application?.status_histories?.[0]?.remarks}
                            </td>
                            <td>
                              <FileIconFormat
                                fileType="official_receipt"
                                path={
                                  application?.order_of_payment?.payment_detail
                                    ?.attachment
                                }
                                toggleIsViewerOpen={toggleIsViewerOpen}
                                getImageHandle={getImageHandle}
                              />
                            </td>
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
                          </>
                        )}
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
                      <>
                        <td>
                          <Button
                            color="primary"
                            onClick={() => {
                              toggleOverTheCounterModal();
                              setSelectedRow([application?.id]);
                              dispatch(
                                SpecialPermitClientSlice.actions.setApplicationIdsForPayment(
                                  [application?.id]
                                )
                              );
                            }}
                          >
                            Pay
                          </Button>
                        </td>
                        {/* <td>
                          <>
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
                                    toggleOverTheCounterModal();
                                    setSelectedRow([application?.id]);
                                    dispatch(
                                      SpecialPermitClientSlice.actions.setApplicationIdsForPayment(
                                        [application?.id]
                                      )
                                    );
                                  }}
                                >
                                  Pay
                                </DropdownItem>

                                <DropdownItem
                                  onClick={() => {
                                    toggleReUploadCedulaModal();
                                    setSelectedRow([application?.id]);
                                  }}
                                >
                                  Reupload Cedula
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </>
                        </td> */}
                        {/* {application?.uploaded_file
                          ?.community_tax_certificate == null &&
                        (applicationType === "occupational_permit" ||
                          applicationType === "mayors_permit" ||
                          applicationType === "good_moral") ? (
                          <td>
                            <Badge color="danger">No Cedula</Badge>
                          </td>
                        ) : null} */}
                      </>
                    ) : null}

                    {status === "completed" ? (
                      <td>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <div
                            style={{ paddingRight: "10px" }}
                            className="d-flex gap-2"
                          >
                            <Button
                              color="success"
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
                              <i className="mdi mdi-download fs-4 me-2"></i>
                              Download
                            </Button>
                            <Button
                              color="primary"
                              onClick={() => {
                                const url = process.env.REACT_APP_FEEDBACK_URL;

                                window.open(url, "_blank");
                              }}
                            >
                              <i className="mdi mdi-star fs-4 me-2 text-warning"></i>
                              Submit Feedback
                            </Button>
                          </div>
                        </div>
                      </td>
                    ) : null}
                    {status === "declined" && (
                      <>
                        <td>{application?.status_histories?.[0]?.remarks}</td>
                        <td>
                          <Button
                            onClick={() => {
                              setSelectedRow([application?.id]);
                              togglerFunction();
                            }}
                            color="primary"
                          >
                            Revise & Resubmit
                          </Button>
                        </td>
                      </>
                    )}
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
    </>
  );
};

export default ClientTable;
