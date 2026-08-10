import React, { useRef } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";

function UpdateEventModal({
  openModal,
  toggleModal,
  toggleRefresh,
  //   eventId,
  initialData,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const formatDate = (date) => {
    if (!date) return "";
    return date.split(" ")[0]; // removes time
  };
  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="m"
        className="modal-dialog-centered"
        unmountOnClose
      >
        <ModalHeader toggle={toggleModal}>
          <p
            style={{
              fontWeight: "bold",
              letterSpacing: ".2rem",
              fontSize: "18pt",
              margin: 0,
              color: "#368be0",
            }}
          >
            UPDATE
          </p>
        </ModalHeader>

        <ModalBody>
          <Formik
            innerRef={formikRef}
            initialValues={{
              id: initialData?.id,
              name_of_event: initialData?.event_name || "",
              date_from:
                (initialData?.event_date_from &&
                  formatDate(initialData?.event_date_from)) ||
                "",
              date_to:
                (initialData?.event_date_to &&
                  formatDate(initialData?.event_date_to)) ||
                "",
              event_time_from: initialData?.event_time_from || "",
              event_time_to: initialData?.event_time_to || "",
            }}
            enableReinitialize
            onSubmit={(values) => {}}
          >
            {(props) => (
              <Form>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label>Name of Event</Label>
                      <Input
                        name="name_of_event"
                        placeholder="Enter event name"
                        value={props.values.name_of_event}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>Date From</Label>
                      <Input
                        type="date"
                        name="date_from"
                        value={props.values.date_from}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>Date To</Label>
                      <Input
                        type="date"
                        name="date_to"
                        value={props.values.date_to}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>Time From</Label>
                      <Input
                        type="time"
                        name="event_time_from"
                        value={props.values.event_time_from}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label>Time To</Label>
                      <Input
                        type="time"
                        name="event_time_to"
                        value={props.values.event_time_to}
                        onChange={props.handleChange}
                      />
                    </FormGroup>
                  </Col>
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
              color: "white",
            }}
            onClick={(e) => {
              e.preventDefault();

              const formik = formikRef.current.values;
              handleSubmit(
                {
                  url: "api/admin/update/special-permit-schedule",
                  message: {
                    title: "Are you sure you want to update?",
                    failedTitle: "FAILED",
                    success: "Event updated successfully!",
                    error: "Unknown error occurred",
                  },
                  params: {
                    ...formik,
                  },
                },
                [],
                [toggleModal, toggleRefresh],
              );
            }}
          >
            UPDATE
          </Button>

          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateEventModal;
