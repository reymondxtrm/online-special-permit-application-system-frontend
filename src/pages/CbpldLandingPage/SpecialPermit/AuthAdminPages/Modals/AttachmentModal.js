import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Viewer from "react-viewer";
// import Viewer from "react-viewer";
import axios from "axios";

function AttachmentModal({
  openModal,
  toggleModal,
  uploadedFiles,
  applicationType,
  mainActiveTab,
}) {
  const getActiveTabInitialState = (applicationType) => {
    if (applicationType == "mayors_permit" || applicationType == "good_moral") {
      return "Police Clearance";
    }
    if (applicationType == "occupational_permit") {
      return "Certificate of Employment";
    }
    return "Request Letter";
  };
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(getActiveTabInitialState(mainActiveTab));
  }, [mainActiveTab]);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const fileMapping = {
    mayors_permit: {
      "Police Clearance": uploadedFiles?.police_clearance,
      "Community Tax Certificate": uploadedFiles?.community_tax_certificate,
      "Barangay Clearance": uploadedFiles?.barangay_clearance,
      "Fiscal Clearance": uploadedFiles?.fiscal_clearance,
      "Court Clearance": uploadedFiles?.court_clearance,
    },
    good_moral: {
      "Police Clearance": uploadedFiles?.police_clearance,
      "Community Tax Certificate": uploadedFiles?.community_tax_certificate,
      "Barangay Clearance": uploadedFiles?.barangay_clearance,
      "Fiscal Clearance": uploadedFiles?.fiscal_clearance,
      "Court Clearance": uploadedFiles?.court_clearance,
    },
    event: {
      "Request Letter": uploadedFiles?.request_letter,
      "Sworn Statement": uploadedFiles?.sworn_statement,
    },
    motorcade: {
      "Request Letter": uploadedFiles?.request_letter,
      "Route Plan": uploadedFiles?.route_plan,
    },
    parade: {
      "Request Letter": uploadedFiles?.request_letter,
      "Route Plan": uploadedFiles?.route_plan,
    },
    recorrida: {
      "Request Letter": uploadedFiles?.request_letter,
      "Route Plan": uploadedFiles?.route_plan,
    },
    use_of_government_property: {
      "Request Letter": uploadedFiles?.request_letter,
      "Route Plan": uploadedFiles?.route_plan,
    },
    occupational_permit: {
      "Certificate of Employment": uploadedFiles?.certificate_of_employment,
      "Community Tax Certificate": uploadedFiles?.community_tax_certificate,
      "ID Picture": uploadedFiles?.id_picture,
      "Health Certificate": uploadedFiles?.health_certificate,
      "Training Certificate": uploadedFiles?.training_certificate,
    },
  };

  const images = Object.values(fileMapping[applicationType]).filter(Boolean); // kuhaon tong naay mga values (.filter(boolean))

  const openImageViewer = () => {
    setIsViewerOpen((prev) => !prev);
  };

  const handleDownload = async (filePath) => {
    const link = document.createElement("a");
    link.href = `${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      fade={true}
      backdrop="static"
      size="xl"
      className="modal-dialog-centered"
      style={{
        maxWidth: "1400px",
      }}
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
          {"ATTACHMENTS "}
        </p>
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto" }}>
        <Row>
          <Col lg="12">
            <div className="vertical-nav">
              <Row>
                <Col lg="2" sm="4">
                  <Nav pills className="flex-column">
                    {Object.keys(fileMapping[applicationType]).map(
                      (tabId, index) => (
                        <>
                          <NavLink
                            key={tabId}
                            className={classnames({
                              active: activeTab === tabId,
                            })}
                            onClick={() => setActiveTab(tabId)}
                          >
                            <p className="font-weight-bold mb-0">{tabId}</p>
                          </NavLink>
                        </>
                      )
                    )}
                  </Nav>
                </Col>
                <Col lg="10" sm="8">
                  <Card>
                    <CardBody>
                      <TabContent activeTab={activeTab}>
                        {Object.entries(fileMapping[applicationType]).map(
                          ([tabId, filePath], index) => (
                            <TabPane key={tabId} tabId={tabId}>
                              <div className="d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-4">{tabId}</h4>
                                <Button
                                  color="primary"
                                  onClick={() => handleDownload(filePath)}
                                >
                                  <i className="mdi mdi-download "></i>
                                </Button>
                              </div>
                              {filePath ? (
                                <img
                                  src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "80vh",

                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    openImageViewer();
                                    setCurrentImage(index);
                                  }}
                                />
                              ) : (
                                <p>No file uploaded for this category.</p>
                              )}
                            </TabPane>
                          )
                        )}
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
      {/* Image Viewer */}
      {isViewerOpen && openModal && (
        <Viewer
          visible={isViewerOpen}
          onClose={openImageViewer}
          images={images.map((filePath) => ({
            src: `${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`,
            alt: "Attachment",
          }))}
          activeIndex={currentImage}
          rotatable
          zoomable
          scalable
          attribute={false}
          zIndex={2000}
          customToolbar={(toolbars) => [
            ...toolbars,
            {
              key: "download",
              render: (
                <svg
                  viewBox="0 0 1024 1024"
                  width="30"
                  height="30"
                  fill="yellow"
                  style={{ cursor: "pointer" }}
                >
                  <path d="M505.6 704L313.6 512h121.6V192h160v320h121.6L505.6 704z m-320 64h640v64H185.6v-64z" />
                </svg>
              ),
              onClick: (activeImage) => {
                const link = document.createElement("a");
                link.href = activeImage.src;
                link.download = activeImage.alt || "downloaded_image";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              },
            },
          ]}
        />
      )}
    </Modal>
  );
}

export default AttachmentModal;
