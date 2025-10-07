import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AllPermitReceivers from "pages/FinalReleaser/Common/AllPermitReceivers";
import useSubmit from "hooks/Common/useSubmit";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessStageData } from "features/AdminSlice/AdminSlice";
const DetailsButton = ({ business_id, forAction = 0 }) => {
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState();
  const [newDate, setNewDate] = useState();
  // const [data, setdata] = useState([]);
  const handleApprove = useSubmit();
  const toggleModal = () => setModal(!modal);
  const dispatch = useDispatch();
  const batsAdmin = useSelector((state) => state.batsAdmin);

  // console.log(data);
  const detailsModal = () => {
    toggleModal();
  };
  useEffect(() => {
    if (modal && business_id) {
      dispatch(getBusinessStageData({ business_id }));
    }
  }, [business_id, modal, isEditing]);

  const handleSave = (id) => {
    handleApprove(
      {
        url: "api/admin/edit-stage-timestamp",
        params: { business_stage_id: id, updated_time: newDate },
        message: {
          tittle: "Are you want to update the time?",
          success: "Time updated successfully",
        },
      },
      [getBusinessStageData({ business_id: business_id })]
    );

    setIsEditing(null);
  };
  const handleClick = (index) => {
    if (index === isEditing) {
      setIsEditing(null);
    } else {
      setIsEditing(index);
    }
  };
  console.log(batsAdmin?.businessStagesData);
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader toggle={toggleModal}>Details</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <CardTitle className="mb-5">Activity</CardTitle>
              <ul className="verti-timeline list-unstyled">
                {batsAdmin?.businessStagesData?.map((items, index) => {
                  const date = new Date(items?.date);
                  const formattedDate = date?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  });
                  const formattedTime = date?.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // Set to true if you want 12-hour format
                  });
                  return (
                    <li className="event-list" key={index}>
                      <div className="event-timeline-dot">
                        <i
                          className="bx bx-right-arrow-circle font-size-18"
                          onClick={() => {
                            handleClick(index);
                            setNewDate(items.date);
                          }}
                        />
                      </div>
                      <div className="d-flex">
                        <div className="me-3">
                          {isEditing === index ? (
                            <>
                              <Input
                                onChange={(e) => setNewDate(e.target.value)}
                                value={newDate}
                                type="datetime-local"
                              />
                              <div className="text-end">
                                <Button
                                  color="warning"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleSave(items.id)}
                                >
                                  Update
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => setIsEditing(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <h5 className="font-size-14">
                              <strong>
                                {formattedDate} - {formattedTime}
                              </strong>
                              <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                            </h5>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div>
                            <p>
                              <strong>{items?.stage}</strong> By{" "}
                              {items.user_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
          {forAction === 1 ? (
            <Card>
              <CardHeader>Permit Releasing History</CardHeader>
              <CardBody>
                <AllPermitReceivers businessId={business_id} forAction={1} />
              </CardBody>
            </Card>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        type="button"
        color="primary"
        className="btn-sm btn-rounded"
        onClick={(e) => {
          detailsModal();
        }}
        style={{ marginBottom: "2px", width: "60px" }}
      >
        Details
      </Button>
    </>
  );
};

export default DetailsButton;
