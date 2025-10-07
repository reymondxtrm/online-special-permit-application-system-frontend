import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  Col,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getRequestDetailsList } from "features/request/requestDetailsSlice";
import Select2InputField from "components/Forms/select2InputField";
import BasicInputField from "components/Forms/BasicInputField";
const ForwardRequestModal = ({
  modal,
  toggle,
  modalData,
  history,
  setModalData,
  params,
}) => {
  const dispatch = useDispatch();
  const [divisionOptions, setDivisionOptions] = useState();
  const divisionList = useSelector((state) => state.userList.divisions);
  const requestParams = useSelector((state) => state.requestFilter.params);
  useEffect(() => {
    if (divisionList.length !== 0 && modalData) {
      const options = divisionList.filter(
        (item) => item.divisions_id !== modalData.assigned_division
      );
      const divOptions = options.map((item) => ({
        label: item.division,
        value: item.divisions_id,
      }));
      setDivisionOptions(divOptions);
    }
  }, [divisionList, modalData]);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      division: "",
      actionTaken: "",
    },
    validationSchema: Yup.object({
      division: Yup.object().shape({
        label: Yup.string().required("Please Enter Your Office"),
      }),
      actionTaken: Yup.string()
        .max(250, "Maximum of 250 characters")
        .required("Please enter action/reason"),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Click Yes to Forward Request",
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
            .post("api/admin/forward-request", {
              id: modalData.request_details_id,
              data: values,
              from: modalData.divisions.division,
            })
            .then(
              (res) => {
                setModalData(res.data);
                Swal.fire({
                  icon: "success",
                  title: "Request Successfully Forwarded",
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
          <ModalHeader
            toggle={() => {
              toggle();
              validation.resetForm();
            }}
            tag="h4"
          >
            Forward Request ({modalData.ticket_number})
          </ModalHeader>

          <ModalBody>
            {divisionList && (
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
                    label={"Division"}
                    id={"division"}
                    placeholder={"Select Division"}
                    validation={validation}
                    options={divisionOptions}
                    onChangeFunctions={(divisionOptions) => {
                      validation.setFieldValue("division", divisionOptions);
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

export default ForwardRequestModal;
