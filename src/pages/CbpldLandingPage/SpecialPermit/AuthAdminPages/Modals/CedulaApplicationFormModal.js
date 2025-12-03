import React from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

export default function CedulaApplicationFormModal({ openModal, toggleModal }) {
  return (
    <Modal isOpen={openModal} toggle={toggleModal} fullscreen>
      <ModalHeader toggle={toggleModal}>CeduLa Form Application</ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter>
        <Button color="warning"></Button>
      </ModalFooter>
    </Modal>
  );
}
