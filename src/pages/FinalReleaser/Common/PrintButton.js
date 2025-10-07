import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { getForPrinting } from "features/FinalReleaser/finalReleaserSlice";

export default function PrintButton({ id, api, forAction }) {
  const dispatch = useDispatch();
  const handlePrint = () => {
    Swal.fire({
      title: "Are you sure you want to Print?",
      icon: "warning",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "processing...",
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
            { business_id: id },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            dispatch(getForPrinting({ for_action: forAction }));
            Swal.fire({
              icon: "success",
              title: "Document Successfully Released",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error.response?.data?.message);
            Swal.fire({
              icon: "warning",
              title: "Release Failed",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      } else {
        console.log("cancel");
      }
    });
  };

  return (
    <Button
      type="button"
      color="primary"
      size="lg"
      className="btn-sm btn-rounded"
      style={{ marginBottom: "2px", width: "60px" }}
      onClick={handlePrint}
    >
      Print
    </Button>
  );
}
