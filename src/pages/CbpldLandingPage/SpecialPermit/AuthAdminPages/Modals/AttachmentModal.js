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
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import Viewer from "react-viewer";
import axios from "axios";

function AttachmentModal({
  openModal,
  toggleModal,
  uploadedFiles,
  applicationType,
  mainActiveTab,
  occupational = false,
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
  const [isFetching, setIsFetching] = useState(false);
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
      "Training Certificate": uploadedFiles?.training_certificate,
    },
  };
  useEffect(() => {
    const filePath = fileMapping?.[applicationType]?.[activeTab];

    if (!activeTab || !filePath) return;

    let blobUrl = null;

    const fetchImage = async () => {
      setIsFetching(true);
      try {
        const response = await axios({
          url: "/api/admin/attachment",
          method: "GET",
          params: { filepath: filePath },
          responseType: "blob",
        });

        if (response?.data) {
          blobUrl = URL.createObjectURL(response.data);
          setCurrentImage(blobUrl);
        }
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.log(error?.response?.data?.message || error);
      }
    };

    fetchImage();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl); // cleanup blob URL
    };
  }, [activeTab, applicationType]);

  const images = Object.values(fileMapping[applicationType]).filter(Boolean);

  const openImageViewer = () => {
    setIsViewerOpen((prev) => !prev);
  };

  const handleDownload = async (filePath) => {
    try {
      const response = await axios.get("api/admin/download-image", {
        params: { filePath },
        responseType: "blob",
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "PoliceClearance-71.jpg"); // filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("Download error:", error);
    }
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
                      (tabId, index) => {
                        return (
                          <>
                            <NavLink
                              key={tabId}
                              className={classnames({
                                active: activeTab === tabId,
                                "text-white": activeTab === tabId,
                              })}
                              onClick={() => setActiveTab(tabId)}
                            >
                              <p
                                className="font-weight-bold mb-0"
                                style={{
                                  color:
                                    activeTab === tabId ? "white" : "inherit",
                                }}
                              >
                                {tabId}
                              </p>
                            </NavLink>
                          </>
                        );
                      }
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
                                occupational ? (
                                  isFetching ? (
                                    <div className="text-center">
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                      <Spinner color="primary" type="grow">
                                        Loading...
                                      </Spinner>
                                    </div>
                                  ) : (
                                    <img src={currentImage} alt={activeTab} />
                                  )
                                ) : (
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
                                )
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
        />
      )}
    </Modal>
  );
}

export default AttachmentModal;
