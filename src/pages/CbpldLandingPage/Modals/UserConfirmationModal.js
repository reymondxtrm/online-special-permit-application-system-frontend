import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export default function UserConfirmationModal({
  isOpen,
  toggle,
  handleProceed,
}) {
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <p className="fw-bold">
          “I hereby voluntarily declare that all the information provided in
          this request form for the special permit is true, accurate, and
          complete to the best of my knowledge and belief. I fully understand
          that any false, misleading, or incomplete information may result in
          the disapproval of my application.”
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          toggle={toggle}
          onClick={() => handleProceed(true)}
        >
          Agree
        </Button>
        <Button color="danger" onClick={toggle}>
          DisAgree
        </Button>
      </ModalFooter>
    </Modal>
  );
}
