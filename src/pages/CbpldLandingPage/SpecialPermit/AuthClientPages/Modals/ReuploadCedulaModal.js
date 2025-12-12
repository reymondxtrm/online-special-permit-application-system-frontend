import { useFormik } from "formik";
import * as Yup from "yup";
import useSubmit from "hooks/Common/useSubmit";
import React from "react";
import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
} from "reactstrap";

const ReuploadCedulaModal = ({
  openModal,
  toggleModal,
  specialPermitApplicationId,
}) => {
  const handleSubmit = useSubmit();

  // Convert values to FormData
  const getFormData = (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
        return;
      }

      formData.append(key, value ?? "");
    });

    return formData;
  };

  // ✅ Yup Validation Schema

  const validation = useFormik({
    initialValues: {
      special_permit_application_id: specialPermitApplicationId,
      community_tax_certificate: "",
    },

    validationSchema: Yup.object({
      community_tax_certificate: Yup.mixed()
        .required("Image is required")
        .test("fileType", "Only images are allowed", (value) => {
          if (!value) return false;
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }),
    }),

    onSubmit: (values) => {
      const params = getFormData(values);

      handleSubmit(
        {
          url: "api/client/reupload-community-tax-certificate",
          headers: { "Content-Type": "multipart/form-data" },
          message: {
            title: "Are you sure you want to Proceed?",
            failedTitle: "FAILED",
            success: "Success!",
            error: "Unknown error occurred",
          },
          params,
        },
        [],
        [toggleModal]
      );
    },
  });

  return (
    <Modal isOpen={openModal} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal}>
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: 0,
            padding: 0,
            color: "#368be0",
          }}
        >
          Reupload Community Tax Certificate
        </p>
      </ModalHeader>

      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="community_tax_certificate">
              Community Tax Certificate (Cedula)
            </Label>

            <Input
              id="community_tax_certificate"
              name="community_tax_certificate"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                validation.setFieldValue("community_tax_certificate", file);
              }}
              invalid={
                validation.touched.community_tax_certificate &&
                Boolean(validation.errors.community_tax_certificate)
              }
            />

            {validation.touched.community_tax_certificate &&
              validation.errors.community_tax_certificate && (
                <FormFeedback>
                  {validation.errors.community_tax_certificate}
                </FormFeedback>
              )}
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={validation.handleSubmit}>
          Update
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            validation.resetForm();
            toggleModal();
          }}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReuploadCedulaModal;
