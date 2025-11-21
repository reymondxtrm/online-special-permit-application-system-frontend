import TableLoaders from "components/Loaders/TableLoaders";
import { getCompanyOccupatinalData } from "features/SpecialPermitAdmin";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
  const [remarksModal, setOpenRemarksModal] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const handleSubmit = useSubmit();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  useEffect(() => {
    dispatch(getCompanyOccupatinalData({ type: "company", status: status }));
  }, [refreshPage]);
  const handleSetRow = (index) => {
    setSelectedRow((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
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
  const toggleImageViewer = (path) => {
    getImageHandle({ path, url: "/api/admin/attachment" });
    setIsViewerOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      {isViewerOpen && currentImage && (
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
      <AmountModal
        openModal={amountModal}
        toggleModal={toggleAmountModal}
        toggleRefresh={toggleRefresh}
        applicationId={applicationId}
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
      {status === "for_payment_approval" ? (
        <>
          <ReturnRemarksModal
            toggleModal={toggleRemarksModal}
            openModal={remarksModal}
            // orderOfPaymentId={orderOfPaymentId}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}

      {status === "for_signature" ? (
        <>
          <GenerateOccupationalPermitModal
            toggle={toggleGenerateModal}
            openModal={generateModal}
            applicationDetails={specialPermitAdmin?.companyOccupational?.[
              selectedCompanyIndex
            ]?.special_permit_applications?.find(
              (item) => item.id === applicationId
            )}
          />
          <UploadPermitModal
            toggleModal={toggleUploadPermitModal}
            openModal={uploadPermitModal}
            special_permit_application_id={applicationId}
            activeTab={"occupationa_permit"}
            toggleRefresh={toggleRefresh}
          />
        </>
      ) : null}
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name of Requestor / Corporation</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Attachment</th>
            {status === "for_payment_approval" ||
            status === "pending" ||
            status === "for_signature" ? (
              <th className="text-center">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {specialPermitAdmin?.getCompanyOccupationalData ? (
            <TableLoaders row={7} col={10} />
          ) : specialPermitAdmin?.companyOccupational?.length > 0 ? (
            specialPermitAdmin?.companyOccupational.map(
              (company, companyIndex) => (
                <React.Fragment key={companyIndex}>
                  <tr
                    onClick={() => handleSetRow(companyIndex)}
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
                      {company.fname}
                    </td>
                    <td>{company?.user_addresses[0]?.company_fulladdress}</td>
                    <td colSpan={3}></td>
                  </tr>

                  {selectedRow?.includes(companyIndex)
                    ? company?.special_permit_applications?.length > 0
                      ? company?.special_permit_applications?.map(
                          (item, index) => (
                            <tr key={index}>
                              <td></td>
                              <td>{`${item?.corporation_member?.fname}  ${item?.corporation_member?.mname} ${item?.corporation_member?.lname}`}</td>
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
                              <td>
                                {status === "for_payment_approval" ||
                                status === "returned" ? (
                                  <Button
                                    color="success"
                                    onClick={() => {
                                      toggleImageViewer(
                                        item?.uploaded_file?.official_receipt
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
                                    <DropdownToggle color="primary">
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
                                      <DropdownItem>Return</DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
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
                                            [toggleRefresh]
                                          );
                                        }}
                                      >
                                        Approve
                                      </DropdownItem>

                                      <DropdownItem
                                        onClick={() => {
                                          // toggleReturnRemarksModal();
                                          setorderOfPaymentId(
                                            item?.order_of_payment?.id
                                          );
                                        }}
                                      >
                                        Return
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
                                    <div>
                                      <Button
                                        color="primary"
                                        style={{ width: "90px" }}
                                        onClick={() => {
                                          toggleUploadModal();
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
                      : null
                    : null}
                </React.Fragment>
              )
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
    </React.Fragment>
  );
}
