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
const AssignPersonnelModal = ({
  modal,
  toggle,
  modalData,
  history,
  setModalData,
  params,
}) => {
  const dispatch = useDispatch();
  const personnelList = useSelector((state) => state.userList.personnel);
  const requestParams = useSelector((state) => state.requestFilter.params);
  const [personnelOptions, setPersonnelOptions] = useState();
  useEffect(() => {
    if (personnelList.length !== 0 && modalData) {
      let options = personnelList.filter(
        (item) => item.division_id === modalData.assigned_division
      );
      modalData.request_assignment.map((personnel) => {
        options = options.filter((i) => i.id !== personnel.assigned_personnel);
      });
      const personnelOptions = options.map((item) => {
        var name =
          item.first_name +
          " " +
          (item.middle_name ? item.middle_name.charAt(0) + ". " : "") +
          item.last_name +
          (item.suffix ? ", " + item.suffix : "");
        return { label: name, value: item.id };
      });
      setPersonnelOptions(personnelOptions);
    }
  }, [modalData]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      selectedPersonnel: "",
      actionTaken: "",
    },
    validationSchema: Yup.object({
      selectedPersonnel: Yup.array()
        .min(1, "Minimum of 1 Personnel")
        .required("Please select a personnel"),
      actionTaken: Yup.string()
        .max(250, "Maximum of 250 characters")
        .required("Please enter action/reason"),
    }),
    onSubmit: (values) => {
      // return;
      Swal.fire({
        title: "Click Yes to Assign Selected Personnel(s)",
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
            .post("api/admin/assign-personnel", {
              id: modalData.request_details_id,
              data: values,
            })
            .then(
              (res) => {
                setModalData(res.data);
                Swal.fire({
                  icon: "success",
                  title: "Personnel(s) Successfully Assigned",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {
                  dispatch(
                    getRequestDetailsList({
                      history: history,
                      filter: requestParams,
                    })
                  );
                  // toggle()
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
            Assign Personnel ({modalData.ticket_number})
          </ModalHeader>

          <ModalBody>
            {personnelOptions && (
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
                    isMulti={true}
                    col={"12"}
                    label={"Personnel"}
                    id={"selectedPersonnel"}
                    placeholder={"Select Personnel"}
                    validation={validation}
                    options={personnelOptions}
                    onChangeFunctions={(personnelOptions) => {
                      validation.setFieldValue(
                        "selectedPersonnel",
                        personnelOptions
                      );
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

export default AssignPersonnelModal;
