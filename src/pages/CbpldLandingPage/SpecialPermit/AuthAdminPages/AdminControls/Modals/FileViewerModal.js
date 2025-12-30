import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FileViewerModal({ fileUrl, isOpen, toggle }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    setLoading(true);
    setPdfBlob(null);

    axios
      .get("api/admin/files", {
        params: { file_path: fileUrl },
        responseType: "blob",
        withCredentials: true,
      })
      .then((res) => {
        setPdfBlob(res.data);
      })
      .catch((err) => {
        console.error("Failed to load PDF", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, fileUrl]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>PDF Viewer</ModalHeader>

      <ModalBody
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        {loading && <p>Loading PDF…</p>}
        {error && <p>{error.message}</p>}
        {pdfBlob && (
          <Document file={pdfBlob} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.3}
              />
            ))}
          </Document>
        )}
      </ModalBody>
    </Modal>
  );
}
