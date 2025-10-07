import React, { useRef } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import { Button, Col, Row } from "reactstrap";
export default function Signature({ validation }) {
  const pictureRef = useRef();

  const handleSave = () => {
    const dataUrl = pictureRef.current.toDataURL("image/png", 0.5);

    validation.setFieldValue("receiver_signature", dataUrl);
  };
  const handleClear = () => {
    pictureRef.current.clear();
  };

  return (
    <>
      <ReactSignatureCanvas
        ref={pictureRef}
        penColor="black"
        canvasProps={{
          className: "signatureCanvas",
          style: {
            border: "5px solid black",
            borderRadius: "8px",
            objectFit: "cover",
            width: "100%",
            height: "80%",
            backgroundColor: "#e0e0e0",
          },
        }}
      />
      <Row>
        <Col>
          <Button onClick={handleClear} className="w-100" color="danger">
            Clear
          </Button>
        </Col>
        <Col>
          <Button onClick={handleSave} className="w-100" color="success">
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
}
