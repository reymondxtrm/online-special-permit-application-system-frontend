import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import useSubmit from "hooks/Common/useSubmit";

function ReviewExemptionModal({
  openModal,
  toggleModal,
  toggleRefresh,
  exemptionData,
}) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const handleSubmit = useSubmit();

  const openImageViewer = useCallback((imageUrl) => {
    setCurrentImage(imageUrl);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(null);
  };
  useEffect(() => {
    if (openModal) {
      axios
        .get("api/admin/get/permit-types")
        .then((res) => {
          const options = res.data.map((options) => ({
            value: options.id,
            label: options.name,
          }));
          // Assuming setoptions is used somewhere else in the component
        })
        .catch((error) => console.log(error));
    }
  }, [openModal]);

  // console.log(exemptionData);
  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="lg"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
        unmountOnClose
      >
        <ModalHeader toggle={toggleModal}>
          <p
            style={{
              fontWeight: "bold",
              letterSpacing: ".2rem",
              fontSize: "18pt",
              margin: "0",
              padding: "0",
              color: "#368be0",
            }}
          >
            {"REVIEW EXEMPTION"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Table striped>
            <thead>
              <tr>
                <th>Exemption Case</th>
                <th>Attachment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{exemptionData?.exempted_case_name}</td>
                <td>
                  <img
                    src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${exemptionData.attachment}`}
                    alt={`Thumbnail`}
                    style={{
                      width: "100px",
                      height: "50px",
                      margin: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      openImageViewer(
                        `${window.location.protocol}//${process.env.REACT_APP_API}storage/${exemptionData.attachment}`
                      )
                    }
                  />
                </td>
                <td className="text-center">
                  <Button
                    style={{
                      backgroundColor: "#1a56db",
                      fontWeight: "600",
                      color: "white",
                      marginRight: "8px",
                    }}
                    onClick={() => {
                      handleSubmit(
                        {
                          url: "api/admin/approve/exemption",
                          message: {
                            title: "Are you sure you want to Proceed?",
                            failedTitle: "FAILED",
                            success: "Success!",
                            error: "unknown error occured",
                          },
                          params: {
                            permit_application_exemption_id: exemptionData.id,
                          },
                        },
                        [],
                        [toggleModal, toggleRefresh]
                      );
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => {
                      handleSubmit(
                        {
                          url: "api/admin/decline/exemption",
                          message: {
                            title: "Are you sure you want to Proceed?",
                            failedTitle: "FAILED",
                            success: "Success!",
                            error: "unknown error occured",
                          },
                          params: {
                            permit_application_exemption_id: exemptionData.id,
                          },
                        },
                        [], //for dispatch Array
                        [toggleModal, toggleRefresh] //for Toggle array
                      );
                    }}
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          {/* <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              // Approve Discount Logic
            }}
          >
            Approve Discount
          </Button> */}
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>

        {isViewerOpen && currentImage && (
          <ImageViewer
            src={[currentImage]} // Pass the current image as an array
            currentIndex={0}
            onClose={closeImageViewer}
            closeOnClickOutside={true}
            backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          />
        )}
      </Modal>
    </React.Fragment>
  );
}

export default ReviewExemptionModal;
