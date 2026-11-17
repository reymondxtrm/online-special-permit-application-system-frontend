import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "helpers/axiosSetup";

const useSubmit = () => {
  const dispatch = useDispatch();

  const handleApprove = (
    { url, params, message, headers = {} },
    forDispatchArray = [],
    toggleArray = [],
  ) => {
    Swal.fire({
      title: message?.title
        ? message?.title
        : "Are you sure you want to Submit",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
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

        axios
          .post(url, params, {
            headers: {
              ...headers,
            },
            withCredentials: true,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: message?.success ? message?.success : "Success!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              forDispatchArray?.forEach((forDispatch) => dispatch(forDispatch));
              toggleArray.forEach((toggle) => toggle());
            });
          })
          .catch((error) => {
            const errorMessage = getErrorMessage(error, message?.error);

            Swal.fire({
              icon: "error",
              title: message?.failedTitle ? message?.failedTitle : "FAILED",
              text: errorMessage,
              confirmButtonText: "OK",
              didOpen: (popup) => {
                // keep one line per validation message
                const text = popup.querySelector(".swal2-html-container");
                if (text) text.style.whiteSpace = "pre-line";
              },
            });
          });
      } else {
        console.log("Submission canceled");
      }
    });
  };

  return handleApprove;
};

export default useSubmit;
