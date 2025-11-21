import React from "react";
import {
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import CedulaApplicationForm from "../../Printables/CedulaApplicationForm";

export default function CedulaApplicationFormModal({ openModal, toggleModal }) {
  return (
    <Modal isOpen={true} toggle={toggleModal} fullscreen>
      <ModalHeader toggle={toggleModal}>CeduLa Form Application</ModalHeader>
      <ModalBody>
        <CedulaApplicationForm />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}
