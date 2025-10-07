import { useFormik } from "formik";
import React, { useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import BasicInputField from "components/Forms/BasicInputField";
import axios from "axios";
import Swal from "sweetalert2";

export default function ChangePasswordModal({ isOpen, toggle }) {
  const formikRef = useRef();
  const changePasswordSchema = Yup.object({
    current_password: Yup.string()
      .required("Current password is required")
      .min(6, "Current password must be at least 6 characters"),

    new_password: Yup.string()
      .required("New password is required")
      .min(6, "New password must be at least 6 characters"),

    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Please confirm your new password"),
  });
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Password Reset</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            current_password: "",
            new_password: "",
            confirm_password: "",
          }}
          innerRef={formikRef}
          validationSchema={changePasswordSchema}
          onSubmit={async (values) => {
            try {
              const response = await axios.post("api/client/change-password", {
                current_password: values.current_password,
                password: values.new_password,
                password_confirmation: values.confirm_password,
              });
              if (response) {
                Swal.fire({
                  icon: "success",
                  title: "Password Changed",
                  text: "Your password has been updated successfully!",
                  confirmButtonColor: "#368be0",
                });

                toggle();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                icon: "error",
                title: "Change Failed",
                text:
                  error.response?.data?.message ||
                  "There was an error changing your password. Please try again.",
                confirmButtonColor: "#e74c3c",
              });
            }
          }}
        >
          {(validation) => (
            <form onSubmit={validation.handleSubmit}>
              <BasicInputField
                label="Current Password"
                name="current_password"
                type="password"
                placeholder="Enter current password"
                validation={validation}
                value={validation.values.current_password}
                errors={validation.errors.current_password}
                touched={validation.touched.current_password}
                col={12}
              />

              <BasicInputField
                label="New Password"
                name="new_password"
                type="password"
                placeholder="Enter new password"
                validation={validation}
                value={validation.values.new_password}
                errors={validation.errors.new_password}
                touched={validation.touched.new_password}
                col={12}
              />

              <BasicInputField
                label="Confirm Password"
                name="confirm_password"
                type="password"
                placeholder="Confirm new password"
                validation={validation}
                value={validation.values.confirm_password}
                errors={validation.errors.confirm_password}
                touched={validation.touched.confirm_password}
                col={12}
              />
            </form>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          type="submit"
          onClick={() => formikRef.current.handleSubmit()}
        >
          Change
        </Button>
        <Button color="warning" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
