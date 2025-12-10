import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";

export default function PrivateImageViewer({ path, openModal, toggleModal }) {
  const [image, setImage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (openModal && path) {
      const fetchImage = async () => {
        try {
          setIsFetching(true);

          const response = await axios.get("/api/client/attachment", {
            params: { filepath: path },
            responseType: "blob", // IMPORTANT
          });

          // Convert blob to object URL
          const url = URL.createObjectURL(response.data);
          setImage(url);
        } catch (error) {
          console.log(error);
        } finally {
          setIsFetching(false);
        }
      };

      fetchImage();
    }
  }, [openModal, path]);

  // cleanup old objectURL
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <Modal isOpen={openModal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}></ModalHeader>

      <ModalBody>
        {isFetching && <Spinner color="primary">Loading...</Spinner>}

        {image && (
          <img
            src={image}
            alt="preview"
            style={{ width: "100%", borderRadius: 8 }}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="success" onClick={toggleModal}>
          Okay
        </Button>
      </ModalFooter>
    </Modal>
  );
}
