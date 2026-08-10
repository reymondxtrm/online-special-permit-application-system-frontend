import axios from "axios";
import BasicInputField from "components/Forms/BasicInputField";
import { useFormik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

function EditDurationModal({ openModal, toggleModal, specialPermitId }) {
  const handleSubmit = useSubmit();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      received_date: "",
      end_date: "",
    },
    onSubmit: (values) => {
      handleSubmit(
        {
          url: "api/admin/update/special-permit-duration",
          method: "POST",
          params: { ...values, special_permit_application_id: specialPermitId },
        },
        [],
        [toggleModal],
      );
    },
  });
  useEffect(() => {
    if (openModal) {
      const fetchData = async () => {
        try {
          const response = await axios({
            url: "api/admin/get/special-permit-duration",
            params: { special_permit_application_id: specialPermitId },
          });
          if (response) {
            validation.setValues({
              received_date: response.data.start,
              end_date: response.data.end,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [openModal]);

  return (
    <Modal isOpen={openModal} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal}>
        {" "}
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
          Update Duration
        </p>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <form>
              <BasicInputField
                type={"datetime-local"}
                label={"Received Date:"}
                name={"received_date"}
                value={validation.values.received_date}
                touched={validation.touched.received_date}
                error={validation.errors.received_date}
                validation={validation}
              />
              <BasicInputField
                type={"datetime-local"}
                label={"End Date:"}
                name={"end_date"}
                value={validation.values.end_date}
                touched={validation.touched.end_date}
                error={validation.errors.end_date}
                validation={validation}
              />
            </form>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-1">
          <Button color="primary" onClick={validation.handleSubmit}>
            Update
          </Button>
          <Button onClick={toggleModal}>Cancel</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default EditDurationModal;
