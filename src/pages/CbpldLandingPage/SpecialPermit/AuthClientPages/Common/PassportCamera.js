import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

const PassportCamera = ({ onCapture, isOpen, toggle, image }) => {
  const webcamRef = useRef(null);

  const [camReady, setCamReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setCamReady(true), 800); // give camera time to initialize
    } else {
      setCamReady(false);
    }
  }, [isOpen]);

  const capture = () => {
    if (!camReady) return;

    setIsCapturing(true);

    let imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setTimeout(() => {
        imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) processImage(imageSrc);
        setIsCapturing(false);
      }, 150);
      return;
    }

    processImage(imageSrc);
    setIsCapturing(false);
  };

  const processImage = (imageSrc) => {
    let hasCaptured = false;
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      if (hasCaptured) return;
      hasCaptured = true;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const capturedImage = canvas.toDataURL("image/jpeg", 1.0);

      setFadeIn(false);
      setTimeout(() => {
        onCapture(capturedImage);
        setFadeIn(true);
      }, 80);
    };
  };

  return (
    <Modal size="md" isOpen={isOpen} toggle={toggle} centered fade>
      <ModalHeader toggle={toggle}>
        <span className="fw-bold text-primary">Capture ID Picture</span>
      </ModalHeader>

      <ModalBody style={{ backgroundColor: "#f7f9fc" }}>
        <Row className="gy-4">
          {/* CAMERA SECTION */}
          <Col className="d-flex flex-column align-items-center justify-content-center">
            {!camReady ? (
              <p className="mt-3 text-danger fw-semibold">
                Camera is initializing…
              </p>
            ) : (
              <div
                style={{
                  backgroundColor: "#00c3ff11",
                  width: "100%",
                  height: "60px",
                  borderRadius: "10px",
                  border: "2px solid #00c3fff8",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  className="mdi mdi-information-outline fs-2"
                  style={{ color: "#00c3fffd", margin: "5px" }}
                ></i>
                <p className="p-0 m-0" style={{ color: "#237088fd" }}>
                  <strong> Reminder: </strong>
                  Please align your face inside the Camera.
                </p>
              </div>
            )}

            <div
              className="position-relative rounded shadow-lg"
              style={{
                width: "430px",
                height: "520px",
                backgroundColor: "black",
                overflow: "hidden",
                border: "4px solid #0d6efd",
                borderRadius: "12px",
              }}
            >
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-100 h-100 object-fit-cover"
                videoConstraints={{ facingMode: "user" }}
              />

              <div
                className="position-absolute"
                // style={{
                //   border: "3px solid rgba(255,255,255,0.85)",
                //   width: "31.43%",
                //   height: "32.69%",
                //   top: "50%",
                //   left: "50%",
                //   transform: "translate(-50%, -50%)",
                //   borderRadius: "4px",
                //   boxShadow: "0 0 10px rgba(255,255,255,0.4)",
                // }}
              />

              {/* CAPTURE BUTTON */}
              <div
                className="position-absolute d-flex align-items-center justify-content-center"
                onClick={capture}
                style={{
                  bottom: 25,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "70px",
                  height: "70px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  cursor: camReady ? "pointer" : "not-allowed",
                  border: camReady ? "4px solid #0d6efd" : "4px solid gray",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "0.2s",
                }}
              >
                {isCapturing ? <Spinner color="primary" size="sm" /> : null}
              </div>
            </div>
          </Col>

          {/* PREVIEW SECTION
          <Col
            md={5}
            className="d-flex flex-column align-items-center justify-content-center"
          >
            <div
              className="rounded shadow p-3 bg-white"
              style={{
                width: "350px",
                minHeight: "480px",
                textAlign: "center",
                border: "2px solid #e5e7eb",
                transition: "0.4s",
                // opacity: fadeIn ? 1 : 0.4,
              }}
            >
              <h5 className="fw-bold text-primary text-uppercase mb-3">
                Captured Image
              </h5>

              {image ? (
                <img
                  src={image}
                  alt="Captured ID"
                  className="img-fluid rounded border"
                  style={{ transition: "0.3s", opacity: fadeIn ? 1 : 0 }}
                />
              ) : (
                <p className="text-secondary mt-5">No image captured yet.</p>
              )}
            </div>
          </Col> */}
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default PassportCamera;
