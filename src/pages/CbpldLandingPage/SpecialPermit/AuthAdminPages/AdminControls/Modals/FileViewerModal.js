import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FileViewerModal({ fileUrl, isOpen, toggle }) {
  const [numPages, setNumPages] = useState(null);
  const url = `${window.location.protocol}//${process.env.REACT_APP_API}api/files/${fileUrl}`;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>PDF Viewer</ModalHeader>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // center horizontally
            justifyContent: "flex-start",
            overflowY: "auto", // make it scrollable
            maxHeight: "80vh", // keep inside screen
            paddingTop: "1rem", // add space under header
          }}
        >
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.3} // zoom in
              />
            ))}
          </Document>
        </ModalBody>
      </Modal>
    </div>
  );
}
