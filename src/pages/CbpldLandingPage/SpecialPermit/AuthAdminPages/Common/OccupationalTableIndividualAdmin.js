import TableLoaders from "components/Loaders/TableLoaders";
import { getIndividualOccupationalApplications } from "features/SpecialPermitAdmin";
import { iteratee } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttachmentModal from "../Modals/AttachmentModal";
import {
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

export default function OccupationalTableIndividualAdmin({ status }) {
  const dispatch = useDispatch();
  const specialPermitAdmin = useSelector((state) => state.specialPermitAdmin);
  const [refreshPage, setrefreshPage] = useState();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState();
  const [applicationId, setApplicationId] = useState();
  const [amountModal, setAmountModal] = useState(false);
  useEffect(() => {
    dispatch(
      getIndividualOccupationalApplications({
        type: "individual",
        status: status,
      })
    );
  }, [refreshPage]);
  const toggleAttachmentModal = () => {
    setShowAttachmentModal((prev) => !prev);
  };
  const toggleAmountModal = () => {
    setAmountModal((prev) => !prev);
  };
  const toggleRefresh = () => {
    setrefreshPage((prev) => !prev);
  };
  return (
    <React.Fragment>
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
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name of Requestor / Corporation</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Attachment</th>
            {status === "pending" && <th>Actions</th>}
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
                      application?.user?.user_phone_numbers_morph[0]
                        ?.phone_number
                    }
                  </td>
                  <td>
                    <Button
                      color="success"
                      onClick={() => {
                        setApplicationId(application.id);
                        setUploadedFiles(application.attachment || []);
                        toggleAttachmentModal();
                      }}
                    >
                      Attachment
                    </Button>
                  </td>
                  {status === "pending" && (
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle color="primary">Actions</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              setApplicationId(application.id);
                              toggleAmountModal();
                            }}
                          >
                            Proceed to payment
                          </DropdownItem>
                          <DropdownItem>Return</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  )}
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
