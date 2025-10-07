import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
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
  Row,
  Col,
  Badge,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
const EditButton = ({
  business_id,
  api,
  business_code,
  business_owner,
  business_name,
  plate_no,
  business_permit,
  action,
  stage,
  control_no,
}) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const handleCancel = () => {
    toggleModal();
    validation.resetForm();
  };
  const initialValues = {
    business_code: business_code ? business_code : "",
    business_owner: business_owner ? business_owner : "",
    business_name: business_name ? business_name : "",
    plate_no: plate_no ? plate_no : "",
    business_permit: business_permit ? business_permit : "",
    business_code_validator: business_code ? "withCode" : "withOutCode",
    business_permit_validator:
      stage === "final_releasing" ? "withPermit" : "withOutPermit",
    // plate_no_validator: plate_no ? "withPlate" : "withOutPlate",
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: initialValues,
    validationSchema: Yup.object({
      business_code: Yup.string().when("business_code_validator", {
        is: "withCode",
        then: Yup.string().required("Please Enter Business Code"),
        otherwise: Yup.string().notRequired(),
      }),
      business_permit: Yup.string().when("business_permit_validator", {
        is: "withPermit",
        then: Yup.string().required("Please Enter Business Permit No."),
        otherwise: Yup.string().notRequired(),
      }),
      // plate_no: Yup.string().when("plate_no_validator", {
      //   is: "withPlate",
      //   then: Yup.string().required("Please Enter Plate No."),
      //   otherwise: Yup.string().notRequired(),
      // }),
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
          Swal.fire({
            title: "Updating...",
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
                stage: stage,
                business_id: business_id,
                business_code:
                  stage === "initial_receiving" ||
                  stage === "complete_receiving"
                    ? values.business_code
                    : null,
                business_name:
                  stage === "initial_receiving" ? values.business_name : null,
                business_owner:
                  stage === "initial_receiving" ? values.business_owner : null,
                business_permit:
                  stage === "final_releasing" ? values.business_permit : null,
                plate_no: stage === "final_releasing" ? values.plate_no : null,
              },
              {
                credentials: "include",
              }
            )
            .then(
              (res) => {
                action();
                Swal.fire({
                  icon: "success",
                  title: "Document Successfully Updated",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {
                  toggleModal();
                });
              },
              (error) => {
                if (error.response.status === 401) {
                }
                console.log(error.response.data.message);
                Swal.fire({
                  icon: "warning",
                  title: "Update Failed",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {});
              }
            );
        } else {
          resetForm();
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
        <ModalHeader toggle={toggleModal}>Update</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <h5>Control No. : </h5>{" "}
            <h3>
              <Badge color={"success"}>{control_no}</Badge>
            </h3>
            {stage === "initial_receiving" || stage === "complete_receiving" ? (
              business_code ? (
                <Row>
                  <Col md="6">
                    <div className="mb-3">
                      <Label className="form-label">Business Code:</Label>
                      <Input
                        name="business_code"
                        type="text"
                        placeholder="Enter Business Code"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.business_code
                            ? validation.values.business_code.toUpperCase()
                            : ""
                        }
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
              ) : null
            ) : null}
            {stage === "initial_receiving" ? (
              <>
                <Row>
                  <Col md="6">
                    <div className="mb-3">
                      <Label className="form-label">Business Name:</Label>
                      <Input
                        name="business_name"
                        type="text"
                        placeholder="Enter Business Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.business_name
                            ? validation.values.business_name.toUpperCase()
                            : ""
                        }
                        invalid={
                          validation.touched.business_name &&
                          validation.errors.business_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.business_name &&
                      validation.errors.business_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.business_name}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col md="6">
                    <div className="mb-3">
                      <Label className="form-label">Business Owner:</Label>
                      <Input
                        name="business_owner"
                        type="text"
                        placeholder="Enter Business Owner"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.business_owner
                            ? validation.values.business_owner.toUpperCase()
                            : ""
                        }
                        invalid={
                          validation.touched.business_owner &&
                          validation.errors.business_owner
                            ? true
                            : false
                        }
                      />
                      {validation.touched.business_owner &&
                      validation.errors.business_owner ? (
                        <FormFeedback type="invalid">
                          {validation.errors.business_owner}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}
            {stage === "final_releasing" ? (
              <>
                <Row>
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
                          validation.values.business_permit
                            ? validation.values.business_permit.toUpperCase()
                            : ""
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
                </Row>
                <Row>
                  <Col md="6">
                    <div className="mb-3">
                      <Label className="form-label">Business Plate No.:</Label>
                      <Input
                        name="plate_no"
                        type="text"
                        placeholder="Enter Business Permit No."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.plate_no
                            ? validation.values.plate_no.toUpperCase()
                            : ""
                        }
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
                </Row>
                {/* {plate_no ? (
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          Business Plate No.:
                        </Label>
                        <Input
                          name="plate_no"
                          type="text"
                          placeholder="Enter Business Permit No."
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={
                            validation.values.plate_no
                              ? validation.values.plate_no.toUpperCase()
                              : ""
                          }
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
                  </Row>
                ) : null} */}
              </>
            ) : null}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={validation.submitForm}>
            Submit
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        type="button"
        color="success"
        size="lg"
        className="btn-sm btn-rounded"
        onClick={(e) => {
          toggleModal();
        }}
        style={{ marginBottom: "2px", width: "60px" }}
      >
        Edit
      </Button>
    </>
  );
};

export default EditButton;
