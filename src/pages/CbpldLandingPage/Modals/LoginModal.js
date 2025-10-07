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
import bg from "../../../assets/images/cgb-bg.jpg";
import { Link } from "react-router-dom";

function LoginModal({ openModal, toggleModal, toggleSignUp }) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);

  const purposeOptions = [
    { value: 1, label: "Local Employment" },
    { value: 2, label: "International Employment" },
  ];
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

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="s"
        className="modal-dialog-centered"
        style={{
          //  maxHeight: "90vh",
          overflowY: "auto",
          // maxWidth: "1400px",
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
            {"Sign in"}
          </p>
        </ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Row>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      name={`username`}
                      placeholder="Username"
                      onChange={props.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name={`password`}
                      placeholder="Password"
                      onChange={props.handleChange}
                    />
                  </FormGroup>
                </Row>

                <Row>
                  <div className="mt-3 text-center">
                    <p>
                      Don&apos;t have an account ?
                      <span
                        style={{
                          color: "#368be0",
                          cursor: "pointer",
                          paddingLeft: "5px",
                        }}
                        onClick={() => {
                          toggleSignUp();
                          toggleModal();
                        }}
                      >
                        Signup now
                      </span>
                    </p>
                  </div>
                </Row>
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
              const formData = getFormData(formik);
              handleSubmit(
                {
                  url: "api/client/special-permit/event",
                  message: {
                    title: "Are you sure you want to Proceed?",
                    failedTitle: "FAILED",
                    success: "Success!",
                    error: "unknown error occured",
                  },
                  params: formData,
                },
                [],
                [toggleModal]
              );
            }}
          >
            Sign in
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default LoginModal;
