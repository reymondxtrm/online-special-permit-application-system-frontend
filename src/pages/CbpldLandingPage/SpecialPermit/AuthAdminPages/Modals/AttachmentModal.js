import React, { useState, useCallback, useEffect, useRef } from "react";
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
import ReactSimpleImageViewer from "react-simple-image-viewer";
import { Document, Page, pdfjs } from "react-pdf";

import axios from "axios";
import Viewer from "react-viewer";

function AttachmentModal({
  openModal,
  toggleModal,
  uploadedFiles,
  applicationType,
  mainActiveTab = "individual_permit",
  isClient = false,
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
  const [currentImage, setCurrentImage] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const blobUrlRef = useRef(null);

  const fileMapping = {
    mayors_permit: {
      "Police Clearance": uploadedFiles?.police_clearance,
      "Community Tax Certificate": uploadedFiles?.community_tax_certificate,
      "Barangay Clearance": uploadedFiles?.barangay_clearance,
      "Fiscal Clearance": uploadedFiles?.fiscal_clearance,
      "Court Clearance": uploadedFiles?.court_clearance,
      "Certificate of Ordinance": uploadedFiles?.certificate_of_ordination,
      "SEC Certificate": uploadedFiles?.s_e_c_certificate,
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
      "Route Plan": uploadedFiles?.route_plan,
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
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  useEffect(() => {
    const filePath = fileMapping?.[applicationType]?.[activeTab];

    if (!activeTab || !filePath) return;

    const fetchImage = async () => {
      setIsFetching(true);
      try {
        const response = await axios({
          url: isClient ? "/api/client/attachment" : "/api/admin/attachment",
          method: "GET",
          params: { filepath: filePath },
          responseType: "blob",
        });

        if (response?.data) {
          if (response.data.type.startsWith("image")) {
            if (blobUrlRef.current) {
              URL.revokeObjectURL(blobUrlRef.current);
            }
            const newBlobUrl = URL.createObjectURL(response.data);
            blobUrlRef.current = newBlobUrl;
            setCurrentImage(newBlobUrl);
            setFileType("image");
          } else {
            setCurrentImage(response.data);
            setFileType("file");
          }
        }
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.log(error?.response?.data?.message || error);
      }
    };

    fetchImage();

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [activeTab, applicationType, openModal, isClient]);
  useEffect(() => {
    if (isViewerOpen) {
      setIsViewerOpen(false);
    }
  }, [activeTab]);
  const toggleIsViewerOpen = () => {
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
        if (response.data.type.startsWith("application")) {
          link.setAttribute("download", "attachment.pdf"); // filename
        } else {
          link.setAttribute("download", "attachment.png"); // filename
        }
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
                          <React.Fragment key={index}>
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
                          </React.Fragment>
                        );
                      },
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
                                  <>
                                    {fileType === "image" ? (
                                      <img
                                        src={currentImage}
                                        alt={activeTab}
                                        style={{
                                          cursor: "pointer",
                                          maxWidth: "100%",
                                        }}
                                        onClick={
                                          !isFetching && currentImage
                                            ? toggleIsViewerOpen
                                            : undefined
                                        }
                                      />
                                    ) : (
                                      <Document
                                        file={currentImage}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                      >
                                        {Array.from(
                                          new Array(numPages),
                                          (_, index) => (
                                            <Page
                                              key={index}
                                              pageNumber={index + 1}
                                              renderTextLayer={false}
                                              renderAnnotationLayer={false}
                                              scale={1.3}
                                            />
                                          ),
                                        )}
                                      </Document>
                                    )}
                                  </>
                                )
                              ) : (
                                <p>No file uploaded for this category.</p>
                              )}
                            </TabPane>
                          ),
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

      <Viewer
        visible={isViewerOpen}
        onClose={toggleIsViewerOpen}
        images={[{ src: currentImage, alt: "Attachment" }]}
        activeIndex={0}
        rotatable={true}
        zoomable={true}
        scalable={true}
        noNavbar={false}
        noToolbar={false}
        attribute={false}
        zIndex={2000}
        key={currentImage}
      />
    </Modal>
  );
}

export default AttachmentModal;
