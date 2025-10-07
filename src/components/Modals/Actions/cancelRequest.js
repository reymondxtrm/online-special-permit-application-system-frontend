import React, { useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Form,
  Row,
  Input,
  Col,
  FormFeedback,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import axios from "axios";
import { getRequestDetailsList } from "features/request/requestDetailsSlice";
import { useDispatch } from "react-redux";
import BasicInputField from "components/Forms/BasicInputField";
const CancelRequestModal = ({
  modal,
  toggle,
  modalData,
  history,
  setModalData,
  params,
}) => {
  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.status.requestStatusList);
  const requestParams = useSelector((state) => state.requestFilter.params);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string()
        .max(250, "Maximum of 250 characters")
        .required("Please Enter reason of cancellation"),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Click Yes to Cancel Request",
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
            title: "Processing...",
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
            .post("api/admin/cancel-request", {
              id: modalData.request_details_id,
              data: values,
            })
            .then(
              (res) => {
                setModalData(res.data);
                Swal.fire({
                  icon: "success",
                  title: "Request Successfully Cancelled",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {
                  dispatch(
                    getRequestDetailsList({
                      history: history,
                      filter: requestParams,
                    })
                  );
                  toggle();
                  validation.resetForm();
                });
              },
              (error) => {
                console.log(error.response.data.message);
                if (
                  error.response.status === 400 ||
                  error.response.status === 401 ||
                  error.response.status === 403
                ) {
                  Swal.fire({
                    icon: "warning",
                    title: error.response.data.message,
                    showConfirmButton: true,
                  }).then(function () {});
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Something went wrong, please try again",
                    showConfirmButton: true,
                  }).then(function () {});
                }
              }
            );
        } else {
          console.log("cancel");
        }
      });
    },
  });
  return (
    <div>
      {modalData && (
        <Modal
          isOpen={modal}
          toggle={toggle}
          backdrop="static"
          keyboard={false}
          size="md"
        >
          {/* <div className="ribbon-wrapper ribbon-xl">
                <div className="ribbon bg-primary">
                    Records Section
                </div>
            </div> */}
          <ModalHeader
            toggle={() => {
              toggle();
              validation.resetForm();
            }}
            tag="h4"
          >
            Cancel Request ({modalData.ticket_number})
          </ModalHeader>

          <ModalBody>
            {statusList && (
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <BasicInputField
                    col={"12"}
                    label={"Reason"}
                    id={"reason"}
                    placeholder={"Enter reason of cancellation"}
                    validation={validation}
                    type={"textarea"}
                    rows={"3"}
                  />
                </Row>

                <Row>
                  <Col>
                    <button
                      className="btn btn-primary btn-block "
                      type="submit"
                    >
                      Proceeed
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                toggle();
                validation.resetForm();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default CancelRequestModal;
