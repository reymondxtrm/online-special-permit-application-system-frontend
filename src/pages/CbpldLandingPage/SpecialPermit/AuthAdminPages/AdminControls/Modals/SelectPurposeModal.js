import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { StylesConfig } from "react-select";
import { FieldArray, Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";

function SelectPurposeModal({
  openModal,
  toggleModal,
  toggleRefresh,
  purposeData,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [options, setoptions] = useState();
  console.log(purposeData?.name);
  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]); // Directly append files
      } else if (Array.isArray(object[key])) {
        object[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (typeof object[key] === "object" && object[key] !== null) {
        formData.append(key, JSON.stringify(object[key]));
      } else {
        formData.append(key, object[key]);
      }
    });
    return formData;
  };

  const discountOptions = Array.from({ length: 100 }, (_, index) => ({
    value: index + 1,
    label: `${index + 1}%`,
  }));

  useEffect(() => {
    if (openModal) {
      axios
        .get("api/admin/get/permit-types", {
          //   params: { permit_type: "good_moral" },
        })
        .then(
          (res) => {
            const options = res.data.map((options) => ({
              value: options.id,
              label: options.name,
            }));
            setoptions(options);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [openModal]);

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
        }}
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
            {"REVIEW PURPOSE"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Formik
            innerRef={formikRef}
            initialValues={{
              purpose: purposeData?.name || "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(props) => (
              <Form>
                <Col>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="purpose">Purpose</Label>
                        <Input
                          id="purpose"
                          name={`purpose`}
                          placeholder="Enter Purpose"
                          value={props.values.purpose} // Bind value to Formik's state
                          onChange={props.handleChange} // Update Formik's state
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
              color: "white",
            }}
            onClick={() => {
              const formik = formikRef.current.values;

              const formData = getFormData(formik);

              handleSubmit(
                {
                  url: "api/admin/create/discount-case",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: formData,
                },
                [toggleRefresh],
                [toggleModal]
              );
            }}
          >
            SAVE
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default SelectPurposeModal;
