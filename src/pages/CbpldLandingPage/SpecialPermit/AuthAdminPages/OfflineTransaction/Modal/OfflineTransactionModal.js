import React, { useCallback, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

const validationSchema = Yup.object({
  special_permit_type_id: Yup.string()
    .nullable()
    .required("Permit type is required"),

  control_number: Yup.string().trim().required("Control number is required"),

  requestor_name: Yup.string()
    .nullable()
    .required("Requestor name is required"),
});

const OfflineTransactionModal = ({
  isOpen,
  toggle,
  toggleRefresh,
  permitTypeOptions = [],
  selectedData = null,
}) => {
  const isEdit = Boolean(selectedData?.id);

  const initialValues = useMemo(
    () => ({
      special_permit_type_id: selectedData?.special_permit_type_id || "",

      control_number: selectedData?.control_number || "",

      requestor_name: selectedData?.requestor_name || "",
      current_status: selectedData?.current_status || "pending",

      received_date: new Date().toISOString().split("T")[0],

      received_time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),
    [selectedData],
  );
  const handleClose = useCallback(() => {
    validation.resetForm();
    toggle?.();
  }, [toggle]);
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting }) => {
      try {
        const result = await Swal.fire({
          title: isEdit
            ? "Update Offline Transaction?"
            : "Create Offline Transaction?",
          text: "Please confirm your action.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: isEdit ? "Update" : "Create",
          cancelButtonText: "Cancel",
          reverseButtons: true,
          allowOutsideClick: false,
        });

        if (!result.isConfirmed) {
          return;
        }

        Swal.fire({
          title: "Processing...",
          text: "Please wait.",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = {
          special_permit_type_id: values.special_permit_type_id || null,
          control_number: values.control_number,
          requestor_name: values.requestor_name,
          date: values.received_date,
          time: values.received_time,
        };

        if (isEdit) {
          await axios.put(
            `/api/admin/update-offline-transactions/${selectedData.id}`,
            payload,
            {
              withCredentials: true,
            },
          );
        } else {
          await axios.post("/api/admin/create-offline-transaction", payload, {
            withCredentials: true,
          });
        }

        Swal.fire({
          icon: "success",
          title: isEdit
            ? "Offline Transaction Updated"
            : "Offline Transaction Created",
          timer: 1500,
          showConfirmButton: false,
        });

        toggleRefresh?.();

        resetForm();
        handleClose();
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: error?.response?.data?.message || "Something went wrong.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [handleClose, isEdit, selectedData, toggleRefresh],
  );

  const validation = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const getFieldError = (field) =>
    validation.touched[field] && Boolean(validation.errors[field]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <ModalHeader toggle={handleClose}>
        {isEdit ? "Edit Offline Transaction" : "Create Offline Transaction"}
      </ModalHeader>

      <ModalBody className="bg-light">
        <Form onSubmit={validation.handleSubmit} noValidate>
          <Card className="shadow-sm border-0">
            <CardBody>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <Label>Permit Type</Label>

                    <Input
                      type="select"
                      name="special_permit_type_id"
                      value={validation.values.special_permit_type_id}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("special_permit_type_id")}
                    >
                      <option value="">Select Permit Type</option>

                      {permitTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Input>

                    <FormFeedback>
                      {validation.errors.special_permit_type_id}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <Label>Control Number</Label>

                    <Input
                      name="control_number"
                      placeholder="Enter control number"
                      value={validation.values.control_number}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("control_number")}
                    />

                    <FormFeedback>
                      {validation.errors.control_number}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <Label>Requestor Name</Label>

                    <Input
                      name="requestor_name"
                      placeholder="Enter requestor name"
                      value={validation.values.requestor_name}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("requestor_name")}
                    />

                    <FormFeedback>
                      {validation.errors.requestor_name}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={6}>
                  <FormGroup>
                    <Label>Date</Label>

                    <Input
                      type="date"
                      name="received_date"
                      value={validation.values.received_date}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("received_date")}
                    />

                    <FormFeedback>
                      {validation.errors.received_date}
                    </FormFeedback>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Time</Label>

                    <Input
                      type="time"
                      name="received_time"
                      value={validation.values.received_time}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={getFieldError("received_time")}
                    />

                    <FormFeedback>
                      {validation.errors.received_time}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <ModalFooter className="px-0 pb-0">
            <Button
              color="primary"
              type="submit"
              disabled={validation.isSubmitting}
            >
              {validation.isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Processing...
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>

            <Button
              color="secondary"
              type="button"
              onClick={handleClose}
              disabled={validation.isSubmitting}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default OfflineTransactionModal;
