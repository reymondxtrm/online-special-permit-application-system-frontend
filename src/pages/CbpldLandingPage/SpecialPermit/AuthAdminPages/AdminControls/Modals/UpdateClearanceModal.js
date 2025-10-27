import axios from "axios";
import BasicInputField from "components/Forms/BasicInputField";
import { getClearances } from "features/AdminSlice/AdminSlice";
import { useFormik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function UpdateClearanceModal({
  isOpen,
  selectedClearance,
  toggle,
}) {
  const handleSubmit = useSubmit();
  const dispatch = useDispatch();
  console.log(selectedClearance);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      amount: "",
    },
    onSubmit: (values) => {
      handleSubmit(
        {
          url: "api/admin/update/clearance",
          message: {
            title: "Are you sure you want to roceed?",
            failedTitle: "FAILED",
            success: "Success!",
            error: "unknown error occured",
          },
          params: { id: selectedClearance.id, ...values },
        },
        [() => dispatch(getClearances())],
        [toggle]
      );
    },
  });
  useEffect(() => {
    validation.setValues({
      name: selectedClearance?.name,
      amount: selectedClearance?.amount,
    });
  }, [selectedClearance]);
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
          Update Clearance
        </p>
      </ModalHeader>
      <ModalBody>
        <BasicInputField
          type={"text"}
          name="name"
          label="Clearance"
          validation={validation}
          touched={validation.touched.name}
          errors={validation.errors.name}
          value={validation.values.name}
        />
        <BasicInputField
          type={"text"}
          name="amount"
          label="Amount"
          validation={validation}
          touched={validation.touched.amount}
          errors={validation.errors.amount}
          value={validation.values.amount}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-2">
          <Button
            onClick={() => {
              validation.handleSubmit();
            }}
            color="success"
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              validation.handleReset();
              toggle();
            }}
          >
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
