import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getApplicationDetails } from "features/SpecialPermitAdmin";

function ApplicationActivityModal({ openModal, toggleModal, applicationId }) {
  const dispatch = useDispatch();
  const { applicationDetails, getApplicationDetailsIsFetching } = useSelector(
    (state) => state.specialPermitAdmin,
  );

  useEffect(() => {
    if (openModal && applicationId) {
      dispatch(getApplicationDetails({ id: applicationId }));
    }
  }, [openModal, applicationId]);

  const activity = applicationDetails?.activity ?? [];

  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      fade={true}
      backdrop="static"
      size="m"
      className="modal-dialog-centered"
      style={{ overflowY: "auto" }}
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
          {"Activity"}
        </p>
      </ModalHeader>
      <ModalBody>
        {getApplicationDetailsIsFetching ? (
          <div className="text-center">
            <Spinner color="primary" type="grow">
              Loading...
            </Spinner>
          </div>
        ) : activity.length > 0 ? (
          <ul className="verti-timeline list-unstyled">
            {activity.map((item) => (
              <li className="event-list" key={item.id}>
                <div className="event-timeline-dot">
                  <i className="bx bx-right-arrow-circle font-size-18" />
                </div>
                <div className="d-flex">
                  <div className="me-3">
                    <h5 className="font-size-14">
                      <strong>{item.date_time}</strong>
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                    </h5>
                  </div>
                  <div className="flex-grow-1">
                    <p>
                      <strong>{item.label}</strong> By {item.by}
                    </p>
                    {item.remarks && (
                      <p className="text-muted mb-0">{item.remarks}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">No activity yet.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ApplicationActivityModal;
