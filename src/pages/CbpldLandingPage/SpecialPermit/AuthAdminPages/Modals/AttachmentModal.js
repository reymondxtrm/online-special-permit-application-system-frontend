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
import ImageViewer from "react-simple-image-viewer";
import { PhotoView } from "react-photo-view";
import Viewer from "react-viewer";
// import Viewer from "react-viewer";

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
                        <NavLink
                          key={tabId}
                          className={classnames({
                            active: activeTab === tabId,
                          })}
                          onClick={() => setActiveTab(tabId)}
                        >
                          <p className="font-weight-bold mb-0">{tabId}</p>
                        </NavLink>
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
                              <h4 className="card-title mb-4">{tabId}</h4>
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
        />
      )}

      {/* {isViewerOpen && (
        <ImageViewer
          src={images.map(
            (filePath) =>
              `${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`
          )}
          currentIndex={currentImage}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          legacy
        />
      )} */}
    </Modal>
  );
}

export default AttachmentModal;

// import React, { useState, useCallback } from "react";
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Nav,
//   NavLink,
//   TabContent,
//   TabPane,
// } from "reactstrap";
// import classnames from "classnames";
// import ImageViewer from "react-simple-image-viewer";

// function AttachmentModal({
//   openModal,
//   toggleModal,
//   uploadedFiles,
//   applicationType,
// }) {
//   const [activeTab, setActiveTab] = useState("1");
//   const [isViewerOpen, setIsViewerOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);

//   const fileMapping = {
//     1: uploadedFiles?.barangay_clearance,
//     2: uploadedFiles?.certificate_of_employment,
//     3: uploadedFiles?.community_tax_certificate,
//     4: uploadedFiles?.court_clearance,
//     5: uploadedFiles?.fiscal_clearance,
//     6: uploadedFiles?.health_certificate,
//     7: uploadedFiles?.id_picture,
//     8: uploadedFiles?.official_receipt,
//     9: uploadedFiles?.police_clearance,
//     10: uploadedFiles?.request_letter,
//     11: uploadedFiles?.route_plan,
//     12: uploadedFiles?.training_certificate,
//   };

//   const images = Object.values(fileMapping).filter(Boolean); // kuhaon tong naay mga values (.filter(boolean))

//   const openImageViewer = useCallback((index) => {
//     setCurrentImage(index);
//     setIsViewerOpen(true);
//   }, []);

//   const closeImageViewer = () => {
//     setIsViewerOpen(false);
//   };

//   return (
//     <Modal
//       isOpen={openModal}
//       toggle={toggleModal}
//       fade={true}
//       backdrop="static"
//       size="xl"
//       className="modal-dialog-centered"
//       style={{
//         maxWidth: "1400px",
//       }}
//       unmountOnClose
//     >
//       <ModalHeader toggle={toggleModal}>
//         <p
//           style={{
//             fontWeight: "bold",
//             letterSpacing: ".2rem",
//             fontSize: "18pt",
//             margin: "0",
//             padding: "0",
//             color: "#368be0",
//           }}
//         >
//           {"ATTACHMENTS"}
//         </p>
//       </ModalHeader>
//       <ModalBody style={{ overflowX: "auto" }}>
//         <Row>
//           <Col lg="12">
//             <div className="vertical-nav">
//               <Row>
//                 <Col lg="2" sm="4">
//                   <Nav pills className="flex-column">
//                     {Object.keys(fileMapping).map((tabId, index) => (
//                       <NavLink
//                         key={tabId}
//                         className={classnames({ active: activeTab === tabId })}
//                         onClick={() => setActiveTab(tabId)}
//                       >
//                         <p className="font-weight-bold mb-0">
//                           {
//                             [
//                               "Barangay Clearance",
//                               "Certificate of Employment",
//                               "Community Tax Certificate",
//                               "Court Clearance",
//                               "Fiscal Clearance",
//                               "Health Certificate",
//                               "ID Picture",
//                               "Official Receipt",
//                               "Police Clearance",
//                               "Request Letter",
//                               "Route Plan",
//                               "Training Certificate",
//                             ][index]
//                           }
//                         </p>
//                       </NavLink>
//                     ))}
//                   </Nav>
//                 </Col>
//                 <Col lg="10" sm="8">
//                   <Card>
//                     <CardBody>
//                       <TabContent activeTab={activeTab}>
//                         {Object.entries(fileMapping).map(
//                           ([tabId, filePath], index) => (
//                             <TabPane key={tabId} tabId={tabId}>
//                               <h4 className="card-title mb-4">
//                                 {
//                                   [
//                                     "Barangay Clearance",
//                                     "Certificate of Employment",
//                                     "Community Tax Certificate",
//                                     "Court Clearance",
//                                     "Fiscal Clearance",
//                                     "Health Certificate",
//                                     "ID Picture",
//                                     "Official Receipt",
//                                     "Police Clearance",
//                                     "Request Letter",
//                                     "Route Plan",
//                                     "Training Certificate",
//                                   ][index]
//                                 }
//                               </h4>
//                               {filePath ? (
//                                 <img
//                                   src={`${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`}
//                                   alt={`Document ${index + 1}`}
//                                   style={{
//                                     maxWidth: "100%",
//                                     maxHeight: "80vh",

//                                     cursor: "pointer",
//                                   }}
//                                   onClick={() => openImageViewer(index)}
//                                 />
//                               ) : (
//                                 <p>No file uploaded for this category.</p>
//                               )}
//                             </TabPane>
//                           )
//                         )}
//                       </TabContent>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={toggleModal}>
//           Close
//         </Button>
//       </ModalFooter>

//       {/* Image Viewer */}
//       {isViewerOpen && (
//         <ImageViewer
//           src={images.map(
//             (filePath) =>
//               `${window.location.protocol}//${process.env.REACT_APP_API}storage/${filePath}`
//           )}
//           currentIndex={currentImage}
//           disableScroll={false}
//           closeOnClickOutside={true}
//           onClose={closeImageViewer}
//         />
//       )}
//     </Modal>
//   );
// }

// export default AttachmentModal;
