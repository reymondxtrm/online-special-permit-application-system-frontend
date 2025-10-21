import axios from "axios";
import BasicInputField from "components/Forms/BasicInputField";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getGovernmentProperty } from "features/AdminSlice/AdminSlice";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";

export default function AddGovernmentPropertyModal({
  isOpen,
  toggle,
  mode,
  property,
}) {
  const dispatch = useDispatch();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const url =
        mode === "add"
          ? "api/add-government-property"
          : "api/update-government-property";

      const params =
        mode === "add"
          ? { name: values.name }
          : { id: property.id, name: values.name };

      try {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showCancelButton: false,
        });
        const response = await axios.post(url, { ...params });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text:
              mode === "add"
                ? "Government property has been added successfully."
                : "Government property has been updated successfully.",
            timer: 2000,
            showConfirmButton: false,
          });

          resetForm();
        }
        toggle();
        dispatch(getGovernmentProperty());
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text:
            error.response?.data?.message ||
            "An error occurred while processing your request.",
          confirmButtonColor: "#3085d6",
        });
      }
    },
  });
  useEffect(() => {
    if (mode === "edit") {
      validation.setFieldValue("name", property.name);
    }
    if (mode === "add") {
      validation.setFieldValue("name", "");
    }
  }, [property, mode]);
  return (
    <Modal toggle={toggle} isOpen={isOpen}>
      <ModalHeader>
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
          {mode === "add"
            ? "Add Government Property"
            : "Update government Property"}{" "}
        </p>
      </ModalHeader>
      <ModalBody>
        <BasicInputField
          type="text"
          name="name"
          validation={validation}
          value={validation.values.name}
          placeholder="Property name"
          label="Property Name"
          touched={validation.touched.name}
          errors={validation.errors.name}
          col={12}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-1">
          <Button onClick={validation.handleSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={toggle}>Close</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
