import PassportCropper from "pages/TrialPages/PassportCropper";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function UploadWithCropperModal({
  openModal,
  toggleModal,
  image,
  onCropDone,
}) {
  return (
    <Modal isOpen={openModal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: 0,
            color: "#368be0",
          }}
        >
          Crop Image
        </p>
      </ModalHeader>
      <ModalBody>
        <PassportCropper imageSrc={image} onCropDone={onCropDone} />
      </ModalBody>
    </Modal>
  );
}
