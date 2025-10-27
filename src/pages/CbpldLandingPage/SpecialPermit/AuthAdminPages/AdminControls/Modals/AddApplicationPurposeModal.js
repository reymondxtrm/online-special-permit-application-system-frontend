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
import BasicInputField from "components/Forms/BasicInputField";

function AddApplicationPurposeModal({
  openModal,
  toggleModal,
  toggleRefresh,
  mode,
  applicationPurpose,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [options, setoptions] = useState();

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
  // console.log(applicationPurpose, mode);
  // useEffect(() => {
  //   if (mode === "update") {
  //     formikRef?.current?.setValues({
  //       name: applicationPurpose.name,
  //       permit_type: applicationPurpose.special_permit_type_id,
  //     });
  //     setrefresh((prev) => !prev);
  //   } else {
  //     formikRef?.current?.setValues({
  //       name: "",
  //       permit_type: "",
  //     });
  //     setrefresh((prev) => !prev);
  //   }
  // }, [openModal, applicationPurpose, mode]);

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
            {mode === "add"
              ? "NEW APPLICATION PURPOSE"
              : "UPDATE APPLICATION PURPOSE"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              permit_type:
                mode === "update"
                  ? applicationPurpose?.special_permit_type_id || ""
                  : "",
              name: mode === "update" ? applicationPurpose?.name || "" : "",
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Col>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Permit Type</Label>
                        <Select
                          isClearable
                          name="permit_type"
                          value={
                            options
                              ? options.find(
                                  (opt) =>
                                    opt.value === props.values.permit_type
                                )
                              : null
                          }
                          onChange={(selectedOption) => {
                            props.setFieldValue(
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
                    <BasicInputField
                      type="text"
                      label="Purpose"
                      value={props.values.name}
                      validation={props}
                      errors={props.errors.name}
                      touched={props.touched.name}
                      name="name"
                      placeholder="Ex. Purpose...."
                    />
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

              const consolidatedData =
                mode === "add"
                  ? { ...formik }
                  : { ...formik, purpose_id: applicationPurpose.id };
              const formData = getFormData(consolidatedData);
              const url =
                mode === "add"
                  ? "api/admin/create/application-purpose"
                  : "api/admin/update/application-purpose";
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
                [toggleRefresh],
                [toggleModal]
              );
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

export default AddApplicationPurposeModal;
