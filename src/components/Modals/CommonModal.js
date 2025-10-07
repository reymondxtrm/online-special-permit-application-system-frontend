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
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";

const CommonModal = ({ modalOpen, toggleModal }) => {
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
          setShowProgressBar(true);
          var bodyFormData = getFormData(values);
          axios
            .post({ API_FOR_UPDATE }, bodyFormData, options, {
              credentials: "include",
            })
            .then(
              (res) => {
                resetForm();
                setShowProgressBar(false);
                setShowError(null);
                setShowSuccess("Success!");
                setUploadProgress(0);
              },
              (error) => {
                setShowError(error.response.data.message);
                setShowProgressBar(false);
                setShowSuccess(null);
                setUploadProgress(0);
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
        isOpen={modalOpen}
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
            <Input
              name="business_code"
              type="text"
              placeholder="Enter Business Code"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.business_code || ""}
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
    </>
  );
};

export default CommonModal;
