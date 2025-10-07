import React, { useEffect, useState } from "react";
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
import Select2InputField from "components/Forms/select2InputField";
import BasicInputField from "components/Forms/BasicInputField";
const UpdateStatusModal = ({
  modal,
  toggle,
  modalData,
  history,
  setModalData,
  params,
}) => {
  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.status.requestStatusList);
  const [statusOptions, setStatusOptions] = useState();
  useEffect(() => {
    if (statusList.length !== 0 && modalData) {
      const options = statusList.filter(
        (item) => item.value !== modalData.status_id
      );
      setStatusOptions(options);
    }
  }, [statusList, modalData]);
  const requestParams = useSelector((state) => state.requestFilter.params);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: "",
      actionTaken: "",
    },
    validationSchema: Yup.object({
      status: Yup.object().shape({
        label: Yup.string().required("Please Select a status"),
      }),
      actionTaken: Yup.string().max(250, "Maximum of 250 characters"),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Click Yes to Update Status",
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
            .post("api/admin/update-request-status", {
              id: modalData.request_details_id,
              data: values,
            })
            .then(
              (res) => {
                setModalData(res.data);
                Swal.fire({
                  icon: "success",
                  title: "Status Successfully Updated",
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
            Update Status ({modalData.ticket_number})
          </ModalHeader>

          <ModalBody>
            {statusOptions && (
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Select2InputField
                    col={"12"}
                    label={"Status"}
                    id={"status"}
                    placeholder={"Select Status"}
                    validation={validation}
                    options={statusOptions}
                    onChangeFunctions={(statusOptions) => {
                      validation.setFieldValue("status", statusOptions);
                    }}
                  />
                </Row>
                <Row>
                  <BasicInputField
                    col={"12"}
                    label={"Action/Reason"}
                    id={"actionTaken"}
                    placeholder={"Enter action taken or reason"}
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
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default UpdateStatusModal;
