import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button, Col, Container, Row } from "reactstrap";
import image from "../../assets/images/sampleImage.jpg";
const PassportCropper = ({ imageSrc, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 150.5;
        canvas.height = 192.94;
        const ctx = canvas.getContext("2d");

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          150.5,
          192.94
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };

      image.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
  
    onCropDone(croppedImage);
  };

  return (
    <Row>
      <Col>
        <div className="d-flex flex-column gap-2">
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={150.5 / 192.94}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button color="primary" onClick={handleDone}>
            Save this photo
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default PassportCropper;
