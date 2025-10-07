import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
const DeleteButton = ({ table, id, refreshTableFunction, api }) => {
  const dispatch = useDispatch();
  const deleteDocument = () => {
    Swal.fire({
      title: "Click Yes to delete",
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
          title: "Deleting...",
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
          .post(
            api,
            {
              id: id,
            },
            {
              credentials: "include",
            }
          )
          .then(
            (res) => {
              dispatch(getCountNeedAction());
              dispatch(refreshTableFunction());
              Swal.fire({
                icon: "success",
                title: "Document Successfully Deleted",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {
                // dispatch(sampleCardModalSlice.actions.closeModal())
              });
            },
            (error) => {
              if (error.response.status === 401) {
              }
              
              Swal.fire({
                icon: "warning",
                title: "Delete Failed",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {});
            }
          );
      } else {
        console.log("cancel");
      }
    });
  };
  return (
    <Button
      type="button"
      color="danger"
      className="btn-sm btn-rounded"
      onClick={(e) => {
        deleteDocument();
      }}
      style={{ marginBottom: "2px" }}
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
