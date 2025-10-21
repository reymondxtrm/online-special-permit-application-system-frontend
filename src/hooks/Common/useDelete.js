import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";

const useDelete = () => {
  const dispatch = useDispatch();

  const deleteHandle = async (
    { url, params, message = "This action cannot be undone.", headers = {} },
    forDispatchArray = [],
    toggleArray = []
  ) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showCancelButton: false,
        });
        const response = await axios.post(url, params, {
          headers: { ...headers },
          withCredentials: true,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Record deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });

          forDispatchArray.forEach((toDispatch) => dispatch(toDispatch));
          toggleArray.forEach((toToggle) => toToggle());
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text:
          error.response?.data?.message ||
          "An error occurred while deleting the record.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return deleteHandle;
};

export default useDelete;
