//use navigaotr.media

import React from "react";
import Webcam from "react-webcam";
import { Button } from "reactstrap";
import imageCompression from "browser-image-compression";
export default function WebCam({ validation }) {
  const webcamRef = React.useRef(null);
  const compressBase64Image = (base64, maxWidth = 800, quality = 0.5) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Calculate new dimensions keeping aspect ratio
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export compressed image as base64 JPEG string
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.src = base64;
    });
  };
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // base64
    const compresseImage = await compressBase64Image(imageSrc, 800, 0.7);

    validation.setFieldValue("receiver_picture", compresseImage);
  };
  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          width: "100%",
          height: "80%",
          objectFit: "cover",
          border: "2px solid #33eb91",
          borderRadius: "10px",
        }}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user", // environment if you want to use back cam
        }}
      />
      <Button type="button" onClick={capture} className="w-100" color="primary">
        Capture
      </Button>
    </>
  );
}
