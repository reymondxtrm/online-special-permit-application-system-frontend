import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
} from "reactstrap";
import { getForFinalReleasing } from "features/FinalReleaser/finalReleaserSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
const EditButton = ({ id, api, openModal, businessPermit, plateNo }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const dispatch = useDispatch();
  const params = {
    for_action: 1,
  };

  const releaseDocument = () => {
    console.log(openModal);
    openModal
      ? toggleModal()
      : Swal.fire({
          title: "Click Yes to Release",
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
              title: "Releasing...",
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
                  dispatch(getForFinalReleasing(params));
                  toggleModal();
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
  };
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      control_no: "",
      business_permit: "",
      plate_no: "",
    },
    validationSchema: Yup.object({
      control_no: Yup.string().notRequired(),
      business_permit: Yup.string().required(
        "Please Enter Business Permit No."
      ),
      plate_no: Yup.string().notRequired(),
    }),

    onSubmit: (values, { resetForm }) => {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          let percent = Math.floor((loaded * 100) / total);

          if (percent < 100) {
            setUploadProgress(percent);
          }
          // (<ProgressBarComponent/>)
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
                control_no: values.control_no,
                business_permit: values.business_permit,
                plate_no: values.plate_no,
              },
              {
                credentials: "include",
              }
            )
            .then(
              (res) => {
                resetForm();
                dispatch(getForFinalReleasing(params));
                Swal.fire({
                  icon: "success",
                  title: "Document Successfully Released",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
                console.log(openModal);
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
        <ModalHeader toggle={toggleModal}>Final Release</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              {businessPermit ? (
                <Col md="6">
                  <div className="mb-3">
                    <Label className="form-label">Business Permit No.:</Label>
                    <Input
                      name="business_permit"
                      type="text"
                      placeholder="Enter Business Permit No."
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.business_permit.toUpperCase() || ""
                      }
                      invalid={
                        validation.touched.business_permit &&
                        validation.errors.business_permit
                          ? true
                          : false
                      }
                    />
                    {validation.touched.business_permit &&
                    validation.errors.business_permit ? (
                      <FormFeedback type="invalid">
                        {validation.errors.business_permit}
                      </FormFeedback> 
                    ) : null}
                  </div>
                </Col>
              ) : null}
            </Row>
            <Row>
              {plateNo ? (
                <Col md="6">
                  <div className="mb-3">
                    <Label className="form-label">Plate No:</Label>
                    <Input
                      name="plate_no"
                      type="text"
                      placeholder="Enter Plate No"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.plate_no.toUpperCase() || ""}
                      invalid={
                        validation.touched.plate_no &&
                        validation.errors.plate_no
                          ? true
                          : false
                      }
                    />
                    {validation.touched.plate_no &&
                    validation.errors.plate_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.plate_no}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              ) : null}
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={validation.submitForm}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        type="button"
        color="primary"
        className="btn-sm btn-rounded"
        onClick={(e) => {
          releaseDocument();
        }}
        style={{ marginBottom: "2px" }}
      >
        Release
      </Button>
    </>
  );
};

export default EditButton;
