import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Input,
} from "reactstrap";
import useSubmit from "hooks/Common/useSubmit";

function UploadPermitModal({
  openModal,
  toggleModal,
  special_permit_application_id,
  activeTab,
  toggleRefresh,
}) {
  const handleSubmit = useSubmit();

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Prepare FormData for submission
  const prepareFormData = (file) => {
    const formData = new FormData();
    formData.append("special_permit", file);
    formData.append(
      "special_permit_application_id",
      special_permit_application_id
    );
    formData.append("permit_type", activeTab);
    return formData;
  };

  // Submit the form
  const submitForm = () => {
    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = prepareFormData(selectedFile);

    handleSubmit(
      {
        url: "/api/admin/upload-permit", 
        headers: {
          "Content-Type": "multipart/form-data",
        },
        message: {
          title: "Are you sure you want to proceed?",
          failedTitle: "Submission Failed",
          success: "File uploaded successfully!",
          error: "An unknown error occurred.",
        },
        params: formData,
      },
      [],
      [toggleRefresh, toggleModal]
    );
  };

  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      fade={true}
      backdrop="static"
      size="m"
      className="modal-dialog-centered"
      unmountOnClose
    >
      <ModalHeader toggle={toggleModal}>
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: "0",
            padding: "0",
            color: "#368be0",
          }}
        >
          UPLOAD FILE
        </p>
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto" }}>
        <Row>
          <Col>
            <FormGroup>
              <Input
                id="officialReceipt"
                name="official_receipt"
                onChange={handleFileChange}
                type="file"
              />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submitForm}>
          Submit
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UploadPermitModal;
