import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getForCompleteReceiving } from "features/CompleteReceiver/completeReceiverSlice";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getForAssessmentReleasing } from "features/AssessmentReleaser/assessmentReleaserSlice";
const ReleasingButton = ({ id, api, openModal, refreshFunction }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const dispatch = useDispatch();
  const params = {
    for_action: 1,
  };
  const currentYear = new Date().getFullYear();

  const handleReceive = () => {
    if (!openModal) {
      Swal.fire({
        title: "Are you sure you want to release this?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Release",
      }).then((result) => {
        if (result.isConfirmed) {
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
                dispatch(getForAssessmentReleasing(params));
                Swal.fire({
                  icon: "success",
                  title: "Document Successfully Released",
                  showConfirmButton: false,
                  timer: 1500,
                });
              },
              (error) => {
                Swal.fire({
                  icon: "warning",
                  title: "Release Failed",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            );
        }
      });
    } else {
      toggleModal();
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      business_code: null,
    },
    validationSchema: Yup.object({
      business_code: Yup.string()
        .required("Please Enter Business Code")
        .matches(/^\d{5}$/, "Must be exactly 5 digits and numeric"),
    }),

    onSubmit: (values, { resetForm }) => {
      toggleModal();

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
            business_code: "BC-" + currentYear + "-" + values.business_code,
          },
          {
            credentials: "include",
          }
        )
        .then(
          (res) => {
            dispatch(getForAssessmentReleasing(params));
            resetForm();
            Swal.fire({
              icon: "success",
              title: "Document Successfully Released",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {});
          },
          (error) => {
            console.log(error.response.data.message);
            Swal.fire({
              icon: "warning",
              title: "Release Failed",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {});
          }
        );
    },
  });
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleModal}>Add Business Code</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Label className="form-label">Business Code:</Label>

            <InputGroup>
              <InputGroupText>BC - {currentYear} -</InputGroupText>
              <Input
                name="business_code"
                type="string"
                placeholder="Enter Business Code"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.business_code}
                invalid={
                  validation.touched.business_code &&
                  validation.errors.business_code
                    ? true
                    : false
                }
              />
              {validation.touched.business_code &&
              validation.errors.business_code ? (
                <FormFeedback type="invalid" style={{ marginLeft: "20%" }}>
                  {validation.errors.business_code}
                </FormFeedback>
              ) : null}
            </InputGroup>
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
        onClick={handleReceive}
        style={{ marginBottom: "2px" }}
      >
        Release
      </Button>
    </>
  );
};

export default ReleasingButton;
