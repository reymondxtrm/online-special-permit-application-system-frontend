import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from "reactstrap";
import Select, { StylesConfig } from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
const AddUserButton = ({ roleOptions }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [multi, setMulti] = useState(false);
  const setMultiSelect = () => setMulti(!multi);

  const receiveDocument = () => {
    openModal
      ? toggleModal()
      : Swal.fire({
          title: "Click Yes to Receive",
          icon: "warning",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          showCancelButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then(function (result) {
          if (result.value) {
            Swal.fire({
              title: "Receiving...",
              didOpen: () => {
                Swal.showLoading();
              },
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showCancelButton: false,
              showConfirmButton: false,
            });
            axios
              .post(
                api,
                {
                  business_id: id,
                },
                {
                  credentials: "include",
                }
              )
              .then(
                (res) => {
                  dispatch(getForCompleteReceiving(params));
                  Swal.fire({
                    icon: "success",
                    title: "Document Successfully Released",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(function () {});
                },
                (error) => {
                  if (error.response.status === 401) {
                  }
                  //   console.log(error.response.data.message);
                  Swal.fire({
                    icon: "warning",
                    title: "Receive Failed",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(function () {});
                }
              );
          } else {
            console.log("cancel");
          }
        });
  };
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      business_code: "",
    },
    validationSchema: Yup.object({
      business_code: Yup.string().required("Please Enter Business Code"),
    }),

    onSubmit: (values, { resetForm }) => {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          let percent = Math.floor((loaded * 100) / total);

          if (percent < 100) {
            setUploadProgress(percent);
          }
        },
      };
      Swal.fire({
        title: "Click to Save",
        icon: "warning",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(function (result) {
        if (result.value) {
          axios
            .post(
              api,
              {
                business_id: id,
                business_code: values.business_code,
              },
              {
                credentials: "include",
              }
            )
            .then(
              (res) => {
                dispatch(getForCompleteReceiving(params));
                resetForm();
                Swal.fire({
                  icon: "success",
                  title: "Document Successfully Released",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              },
              (error) => {
                if (error.response.status === 401) {
                }
                console.log(error.response.data.message);
                Swal.fire({
                  icon: "warning",
                  title: "Release Failed",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              }
            );
        } else {
          console.log("cancel");
        }
      });
    },
  });

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleModal}>Details</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label className="form-label">First Name:</Label>
                  <Input
                    name="business_code"
                    type="text"
                    placeholder="Enter Business Code"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.business_code.toUpperCase() || ""}
                    invalid={
                      validation.touched.business_code &&
                      validation.errors.business_code
                        ? true
                        : false
                    }
                  />
                  {validation.touched.business_code &&
                  validation.errors.business_code ? (
                    <FormFeedback type="invalid">
                      {validation.errors.business_code}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label className="form-label">Middle Name:</Label>
                  <Input
                    name="business_code"
                    type="text"
                    placeholder="Enter Business Code"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.business_code.toUpperCase() || ""}
                    invalid={
                      validation.touched.business_code &&
                      validation.errors.business_code
                        ? true
                        : false
                    }
                  />
                  {validation.touched.business_code &&
                  validation.errors.business_code ? (
                    <FormFeedback type="invalid">
                      {validation.errors.business_code}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label className="form-label">Last Name:</Label>
                  <Input
                    name="business_code"
                    type="text"
                    placeholder="Enter Business Code"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.business_code.toUpperCase() || ""}
                    invalid={
                      validation.touched.business_code &&
                      validation.errors.business_code
                        ? true
                        : false
                    }
                  />
                  {validation.touched.business_code &&
                  validation.errors.business_code ? (
                    <FormFeedback type="invalid">
                      {validation.errors.business_code}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="mb-3">
                  <Label>Roles:</Label>
                  <Select
                    styles={
                      validation.touched.gender_type_id &&
                      validation.errors.gender_type_id
                        ? customStyles
                        : ""
                    }
                    isMulti={true}
                    isClearable="true"
                    name="gender_type_id"
                    placeholder="Select Gender - Type"
                    onChange={(roleOptions) =>
                      validation.setFieldValue("gender_type_id", roleOptions)
                    }
                    onBlur={() => {
                      validation.handleBlur({
                        target: { name: "gender_type_id" },
                      });
                    }}
                    options={roleOptions}
                    value={validation.values.gender_type_id || null}
                    aria-invalid={
                      validation.touched.gender_type_id &&
                      validation.errors.gender_type_id
                        ? true
                        : false
                    }
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={validation.submitForm}>
            Submit
          </Button>
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
          toggleModal();
        }}
        style={{ marginBottom: "2px" }}
      >
        Add User
      </Button>
    </>
  );
};

export default AddUserButton;
