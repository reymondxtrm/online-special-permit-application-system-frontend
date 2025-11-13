import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const PassportCamera = ({ onCapture, isOpen, toggle, image }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const cropWidth = img.width * 0.35;
      const cropHeight = cropWidth / 0.78;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        img.width / 2 - cropWidth / 2,
        img.height / 2 - cropHeight / 2,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedImage = canvas.toDataURL("image/jpeg", 1.0);
      onCapture(croppedImage);
    };
  };

  return (
    <Modal size="xl" isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <Row>
          <Col className="text-center d-flex flex-column gap-2">
            <div
              className="position-relative mx-auto"
              style={{
                width: "400px",
                height: "500px",
                backgroundColor: "black",
                border: "3px solid #20922aff",
              }}
            >
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-100 h-100 object-fit-cover rounded"
              />

              <div
                className="position-absolute border border-white"
                style={{
                  width: "37%",
                  height: "37%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              <div
                className="position-absolute"
                onClick={capture}
                style={{
                  backgroundColor: "black",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "3px solid white",
                  bottom: 30,
                  left: "44%",
                  cursor: "pointer",
                }}
              ></div>
            </div>
          </Col>

          <Col className="text-center d-flex flex-column align-items-center justify-content-center bg-primary">
            {image ? (
              <div
                className="d-flex flex-column align-items-center justify-content-center rounded shadow"
                style={{
                  height: "480px",
                  width: "380px",
                  padding: "20px",
                }}
              >
                <p className="text-white mb-3 fw-bold fs-2">ID Picture</p>
                <img
                  src={image}
                  alt="Passport"
                  className="img-fluid border"
                  style={{
                    maxWidth: "320px",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            ) : (
              <p className="text-white mb-3 fw-bold fs-2">
                No image captured yet.
              </p>
            )}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default PassportCamera;
