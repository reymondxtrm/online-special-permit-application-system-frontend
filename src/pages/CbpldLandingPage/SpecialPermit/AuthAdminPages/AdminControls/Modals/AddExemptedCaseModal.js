import React, { useState, useEffect } from "react";
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

import Select from "react-select";
import { useFormik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getExemptedCases } from "features/AdminSlice/AdminSlice";

function AddExemptedCaseModal({ openModal, toggleModal, mode, exemptedCase }) {
  const handleSubmit = useSubmit();
  const [options, setoptions] = useState([]);
  const dispatch = useDispatch();
  console.log(exemptedCase, mode);

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key]);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      permit_type: "",
      ordinance: "",
      attachment: null,
      name: "",
    },
    onSubmit: (values) => {
      const toProps =
        mode === "add"
          ? { ...values }
          : { ...values, exempted_case_id: exemptedCase.id };
      const formData = getFormData(toProps);
      const url =
        mode === "add"
          ? "api/admin/create/exempted-case"
          : "api/admin/update/exempted-cases";
      handleSubmit(
        {
          url: url,
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

        [() => dispatch(getExemptedCases())],
        [toggleModal]
      );
    },
  });

  useEffect(() => {
    if (openModal) {
      axios.get("api/admin/get/permit-types").then(
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

  useEffect(() => {
    if (mode === "update") {
      validation.setValues({
        name: exemptedCase?.name || "",
        ordinance: exemptedCase?.ordinance || "",
        permit_type: exemptedCase?.special_permit_type_id ?? "",
      });
    } else {
      validation.setValues({
        name: "",
        ordinance: "",
        permit_type: "",
      });
    }
  }, [mode, exemptedCase]);
  console.log(validation.values);
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
          overflowY: "auto",
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
            {mode === "add" ? "NEW EXEMPTED CASE" : "UPDATE EXEMPTED CASE"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Permit Type</Label>
                    <Select
                      isClearable={true}
                      name={"permit_type"}
                      value={
                        options
                          ? options.find(
                              (opt) =>
                                opt.value === validation.values.permit_type
                            )
                          : null
                      }
                      onChange={(selectedOption) => {
                        validation.setFieldValue(
                          "permit_type",
                          selectedOption?.value || ""
                        );
                      }}
                      placeholder="Select Permit Type"
                      options={options}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="ordinance">Ordinance</Label>
                    <Input
                      id="ordinance"
                      name={`ordinance`}
                      placeholder="Ordinance"
                      value={validation.values.ordinance}
                      onChange={validation.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="name">Case Name</Label>
                    <Input
                      id="name"
                      name={`name`}
                      placeholder="Ex. First Time Job Seekers"
                      value={validation.values.name}
                      onChange={validation.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="attachment">Attachment (Ex. Memo)</Label>
                    <Input
                      id="attachment"
                      name="attachment"
                      onChange={(event) => {
                        validation.setFieldValue(
                          "attachment",
                          event.target.files[0]
                        );
                      }}
                      type="file"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Form>
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
              validation.handleSubmit();
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default AddExemptedCaseModal;
