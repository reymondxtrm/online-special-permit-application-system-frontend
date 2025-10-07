import React, { useEffect, useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import { useDispatch } from "react-redux";
import { getUserList } from "features/user/userListSlice";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Badge,
  Tooltip,
  Placeholder,
} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { Buffer } from "buffer";
const UserDetails = ({
  modal,
  toggle,
  modalData,
  setModalData,
  history,
  params,
}) => {
  //Tooltip
  const [tooltipOpenApprove, setTooltipOpenApprove] = useState(false);
  const toggleToolTipApprove = () => setTooltipOpenApprove(!tooltipOpenApprove);

  const [tooltipOpenDisapprove, setTooltipOpenDisapprove] = useState(false);
  const toggleToolTipDisapprove = () =>
    setTooltipOpenDisapprove(!tooltipOpenDisapprove);
  //***** */
  const dispatch = useDispatch();

  const userStatusUpdate = (status, id) => {
    Swal.fire({
      title: "Click Yes to " + status + " User Account",
      icon: "warning",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: "Updating...",
          didOpen: () => {
            Swal.showLoading();
          },

          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCancelButton: false,
          showConfirmButton: false,
        });

        axios
          .post("api/admin/update-user-status", {
            status: status,
            id: id,
          })
          .then(
            (res) => {
              setModalData(res.data.data);
              dispatch(getUserList({ history: history, filter: params }));
              Swal.fire({
                icon: "success",
                title:
                  "User has been" +
                  (status === "Approve" ? "Approved" : "Disapproved"),
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {});
            },
            (error) => {
              console.log(error.response.data.message);
              if (error.response.status === 401) {
                // Logout()
              } else if (error.response.status === 400) {
                Swal.fire({
                  icon: "warning",
                  title: error.response.data.message,
                  showConfirmButton: true,
                }).then(function () {});
              } else {
                Swal.fire({
                  icon: "warning",
                  title: error.response.data.message,
                  showConfirmButton: true,
                }).then(function () {});
              }
            }
          );
      } else {
      }
    });
  };
  //**Image Viewer */
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  useEffect(() => {
    if (modalData && modalData.uploaded_files.length !== 0) {
      setImgLoading(true);
      axios
        .get(
          "api/admin/get-uploaded-id/" +
            modalData.uploaded_files[0].uploaded_files_id,
          {
            responseType: "arraybuffer",
          }
        )
        .then(
          (res) => {
            const base64Str = Buffer.from(res.data, "utf8").toString("base64");
            setImgSrc(base64Str);
            setImgLoading(false);
          },
          (error) => {
            console.log(error.response.data.message);
            setImgLoading(false);
          }
        );
    }
  }, [modalData]);
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  //**End */
  return (
    <div>
      <Modal
        size="lg"
        centered
        isOpen={modal}
        toggle={() => toggle()}
        backdrop="static"
      >
        <ModalHeader
          toggle={() => {
            toggle();
          }}
          tag="h4"
        >
          User Information
        </ModalHeader>
        <ModalBody>
          {modalData && (
            <div className="table-responsive">
              <Table className="table-nowrap mb-0">
                <tbody>
                  <tr>
                    <th scope="row">Full Name :</th>
                    <td>
                      {modalData.first_name +
                        " " +
                        (modalData.middle_name
                          ? modalData.middle_name.charAt(0) + ". "
                          : "") +
                        modalData.last_name +
                        (modalData.suffix ? ", " + modalData.suffix : "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Mobile :</th>
                    <td>{modalData.contact_number}</td>
                  </tr>
                  <tr>
                    <th scope="row">Office :</th>
                    <td>{modalData.offices.office_description}</td>
                  </tr>
                  <tr>
                    <th scope="row">Position :</th>
                    <td>{modalData.position}</td>
                  </tr>
                  <tr>
                    <th scope="row">Account Status :</th>
                    <td>
                      {modalData.status_id === 1 ? (
                        <Badge color="success">Approved</Badge>
                      ) : modalData.status_id === 2 ? (
                        <Badge color="danger">Disapproved</Badge>
                      ) : modalData.status_id === 3 ? (
                        <Badge color="warning">Pending</Badge>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Username :</th>
                    <td>{modalData.username}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date of Registration :</th>
                    <td>
                      {moment(modalData.created_at).format("MMMM D, YYYY")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Attached ID:</th>
                    <td>
                      {!imgLoading ? (
                        imgSrc && (
                          <>
                            <img
                              src={`data:;base64,${imgSrc}`}
                              height="40"
                              style={{ margin: "2px", cursor: "pointer" }}
                              alt=""
                              onClick={() => openImageViewer(0)}
                            />
                            {isViewerOpen && (
                              <ImageViewer
                                src={[`data:;base64,${imgSrc}`]}
                                currentIndex={currentImage}
                                disableScroll={false}
                                closeOnClickOutside={true}
                                onClose={closeImageViewer}
                              />
                            )}
                          </>
                        )
                      ) : (
                        <Placeholder animation="glow">
                          <Placeholder lg={4} />
                        </Placeholder>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          <br />
          <div>
            {modalData &&
              (modalData.status_id === 3 || modalData.status_id === 2) && (
                <>
                  <button
                    type="button"
                    className="btn btn-success"
                    id="TooltipForApprove"
                    onClick={() => {
                      userStatusUpdate("Approve", modalData.id);
                    }}
                  >
                    <i className="bx bxs-user-check font-size-16 align-middle me-2"></i>{" "}
                    Approve
                  </button>
                  <Tooltip
                    isOpen={tooltipOpenApprove}
                    target="TooltipForApprove"
                    toggle={toggleToolTipApprove}
                  >
                    Approve User Account
                  </Tooltip>{" "}
                  {(!modalData.status_id === 2 ||
                    modalData.status_id === 3) && (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger"
                        id="TooltipForDisapprove"
                        onClick={() => {
                          userStatusUpdate("Disapprove", modalData.id);
                        }}
                      >
                        <i className="bx bxs-user-x font-size-16 align-middle me-2"></i>{" "}
                        Disapprove
                      </button>

                      <Tooltip
                        isOpen={tooltipOpenDisapprove}
                        target="TooltipForDisapprove"
                        toggle={toggleToolTipDisapprove}
                      >
                        Disapprove User Account
                      </Tooltip>
                    </>
                  )}
                </>
              )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              toggle(), setImgSrc();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserDetails;
