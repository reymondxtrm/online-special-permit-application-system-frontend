import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const DetailsButton = ({ stages }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const detailsModal = () => {
    toggleModal();
    
  };
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader toggle={toggleModal}>Details</ModalHeader>
        <ModalBody>
          {stages.map((items, index) => {
            return (
              <React.Fragment key={index}>
                {items.stage_name === "initial_received" ? (
                  <h6>Initial Received</h6>
                ) : null}
                {items.stage_name === "assessment_received" ? (
                  <h6>Assessment Received</h6>
                ) : null}
                {items.stage_name === "assessment_released" ? (
                  <h6>Assessment Released</h6>
                ) : null}
                {items.stage_name === "complete_received" ? (
                  <h6>Complete Received</h6>
                ) : null}
                {items.stage_name === "final_released" ? (
                  <h6>Final Released</h6>
                ) : null}
                <p>Date: {items.date}</p>

                <p>User: {items.user_name}</p>
                <hr></hr>
              </React.Fragment>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        type="button"
        color="primary"
        className="btn-sm btn-rounded"
        onClick={(e) => {
          detailsModal();
        }}
        style={{ marginBottom: "2px", width: "60px" }}
      >
        Details
      </Button>
    </>
  );
};

export default DetailsButton;
